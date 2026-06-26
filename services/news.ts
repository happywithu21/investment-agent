/**
 * NewsAPI Service
 *
 * Fetches recent news articles for a company using NewsAPI.org.
 * Requires NEWS_API_KEY environment variable.
 *
 * On failure, returns a structured "unavailable" response
 * so the LangGraph workflow can continue without news data.
 */

import type { NewsArticle, NewsAnalysis, SentimentLabel } from "@/types/agents";
import { getFlashModel, withRetry } from "./gemini";

const NEWS_API_BASE = "https://newsapi.org/v2/everything";

// ────────────────────────────────────────────────────────────
// Raw fetch from NewsAPI
// ────────────────────────────────────────────────────────────

interface NewsApiArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string };
}

interface NewsApiResponse {
  status: "ok" | "error";
  articles: NewsApiArticle[];
  message?: string;
}

async function fetchNewsRaw(
  companyName: string,
  ticker: string
): Promise<NewsApiArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not set in environment variables.");
  }

  // Use both company name and ticker for better coverage
  const query = encodeURIComponent(`"${companyName}" OR "${ticker}"`);
  const url = `${NEWS_API_BASE}?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 0 }, // always fresh
    signal: AbortSignal.timeout(10_000), // 10 s timeout
  });

  if (!response.ok) {
    throw new Error(`NewsAPI responded with status ${response.status}`);
  }

  const data: NewsApiResponse = await response.json();

  if (data.status !== "ok") {
    throw new Error(`NewsAPI error: ${data.message ?? "Unknown error"}`);
  }

  return data.articles.filter(
    (a) => a.title && a.title !== "[Removed]"
  );
}

// ────────────────────────────────────────────────────────────
// LLM Sentiment Scoring
// ────────────────────────────────────────────────────────────

interface SentimentResult {
  sentiment: SentimentLabel;
  score: number; // -1 to 1
  summary: string;
}

async function scoreArticleSentiment(
  articles: NewsApiArticle[],
  companyName: string
): Promise<SentimentResult[]> {
  const model = getFlashModel();

  const prompt = `You are a financial news analyst. Analyze the sentiment of each news headline below for the company "${companyName}".

For each article, return a JSON array with objects containing:
- sentiment: "positive" | "neutral" | "negative"
- score: number from -1.0 (very negative) to 1.0 (very positive)  
- summary: one sentence summary of the article's relevance

Articles:
${articles.map((a, i) => `${i + 1}. "${a.title}" — ${a.description ?? ""}`).join("\n")}

Return ONLY a valid JSON array. No markdown, no explanation.`;

  const response = await withRetry(() => model.invoke(prompt));
  const text =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("LLM did not return valid JSON array for sentiment");
  }

  return JSON.parse(jsonMatch[0]) as SentimentResult[];
}

// ────────────────────────────────────────────────────────────
// Key Themes Extraction
// ────────────────────────────────────────────────────────────

async function extractKeyThemes(
  articles: NewsApiArticle[],
  companyName: string
): Promise<string[]> {
  if (articles.length === 0) return [];

  const model = getFlashModel();
  const headlines = articles.map((a) => a.title).join("\n");

  const prompt = `Based on these news headlines about ${companyName}, identify 3-5 key themes or topics.

Headlines:
${headlines}

Return ONLY a JSON array of short theme strings (e.g. ["Revenue Growth", "Regulatory Pressure", "New Product Launch"]).
No markdown, no explanation.`;

  const response = await withRetry(() => model.invoke(prompt));
  const text =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  return JSON.parse(jsonMatch[0]) as string[];
}

// ────────────────────────────────────────────────────────────
// Main Export
// ────────────────────────────────────────────────────────────

/**
 * Fetches and analyzes news for a company.
 * Returns structured NewsAnalysis — always succeeds (returns "unavailable" on error).
 */
export async function analyzeCompanyNews(
  companyName: string,
  ticker: string
): Promise<NewsAnalysis> {
  try {
    // Step 1: Fetch raw articles
    const rawArticles = await fetchNewsRaw(companyName, ticker);

    if (rawArticles.length === 0) {
      return {
        status: "unavailable",
        articles: [],
        overallSentiment: "neutral",
        sentimentScore: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        keyThemes: [],
        warning: "No recent news articles found for this company.",
      };
    }

    // Step 2: LLM sentiment scoring
    let sentiments: SentimentResult[] = [];
    try {
      sentiments = await scoreArticleSentiment(rawArticles, companyName);
    } catch {
      // If LLM sentiment fails, default to neutral
      sentiments = rawArticles.map(() => ({
        sentiment: "neutral" as SentimentLabel,
        score: 0,
        summary: "Sentiment analysis unavailable.",
      }));
    }

    // Step 3: Build article objects
    const articles: NewsArticle[] = rawArticles.map((raw, i) => ({
      title: raw.title,
      source: raw.source.name,
      publishedAt: raw.publishedAt,
      url: raw.url,
      sentiment: sentiments[i]?.sentiment ?? "neutral",
      sentimentScore: sentiments[i]?.score ?? 0,
      summary: sentiments[i]?.summary ?? raw.description ?? "",
    }));

    // Step 4: Aggregate metrics
    const positiveCount = articles.filter((a) => a.sentiment === "positive").length;
    const negativeCount = articles.filter((a) => a.sentiment === "negative").length;
    const neutralCount = articles.filter((a) => a.sentiment === "neutral").length;
    const avgScore =
      articles.reduce((sum, a) => sum + a.sentimentScore, 0) / articles.length;

    let overallSentiment: SentimentLabel = "neutral";
    if (avgScore > 0.15) overallSentiment = "positive";
    else if (avgScore < -0.15) overallSentiment = "negative";

    // Step 5: Extract themes
    let keyThemes: string[] = [];
    try {
      keyThemes = await extractKeyThemes(rawArticles, companyName);
    } catch {
      keyThemes = [];
    }

    return {
      status: "available",
      articles,
      overallSentiment,
      sentimentScore: avgScore,
      positiveCount,
      neutralCount,
      negativeCount,
      keyThemes,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "News fetch failed";
    return {
      status: "unavailable",
      articles: [],
      overallSentiment: "neutral",
      sentimentScore: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      keyThemes: [],
      warning: `News data unavailable: ${message}. Recommendation is based on financial and risk analysis only.`,
    };
  }
}
