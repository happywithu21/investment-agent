/**
 * Investment Committee Agent
 *
 * Node: "committeeAgent"
 * Responsibility:
 *   The final synthesis step. Acts as a virtual investment committee that
 *   reads all prior agent outputs and renders a binary INVEST or PASS verdict
 *   with confidence score, positive/negative factors, and full reasoning.
 *
 * Output: CommitteeReport added to GraphState
 */

import type {
  InvestmentGraphState,
  CommitteeReport,
  AgentError,
} from "@/types/agents";
import { getThinkingModel, withRetry } from "@/services/gemini";

export async function committeeAgent(
  state: InvestmentGraphState
): Promise<Partial<InvestmentGraphState>> {
  const startTime = Date.now();
  const errors: AgentError[] = [];

  const companyName = state.companyProfile?.name ?? state.companyName;
  const ticker = state.ticker ?? "N/A";
  const profile = state.companyProfile;
  const financials = state.financialData;
  const news = state.newsAnalysis;
  const risk = state.riskAssessment;

  try {
    const model = getThinkingModel();

    // Build comprehensive context for the committee
    const profileCtx = profile
      ? `Company: ${profile.name} (${profile.ticker})
Exchange: ${profile.exchange}
Sector: ${profile.sector} | Industry: ${profile.industry}
Country: ${profile.country}
Employees: ${profile.employees?.toLocaleString() ?? "N/A"}
Market Cap: ${profile.marketCap ? `$${(profile.marketCap / 1e9).toFixed(2)}B` : "N/A"}
Description: ${profile.description}`
      : `Company: ${companyName}`;

    const financialCtx = financials
      ? `
=== FINANCIAL METRICS ===
P/E: ${financials.metrics.peRatio?.toFixed(1) ?? "N/A"} | P/B: ${financials.metrics.pbRatio?.toFixed(1) ?? "N/A"} | EV/EBITDA: ${financials.metrics.evToEbitda?.toFixed(1) ?? "N/A"}
Revenue Growth YoY: ${financials.metrics.revenueGrowthYoY?.toFixed(1) ?? "N/A"}%
Gross Margin: ${financials.metrics.grossMargin?.toFixed(1) ?? "N/A"}% | Operating: ${financials.metrics.operatingMargin?.toFixed(1) ?? "N/A"}% | Net: ${financials.metrics.netMargin?.toFixed(1) ?? "N/A"}%
Debt/Equity: ${financials.metrics.debtToEquity ?? "N/A"} | Current Ratio: ${financials.metrics.currentRatio ?? "N/A"}
ROE: ${financials.metrics.returnOnEquity?.toFixed(1) ?? "N/A"}% | Free Cash Flow: ${financials.metrics.freeCashFlow ? `$${(financials.metrics.freeCashFlow / 1e9).toFixed(2)}B` : "N/A"}
Current Price: ${financials.price.currentPrice ?? "N/A"} | Beta: ${financials.price.beta ?? "N/A"}
52W High: ${financials.price.fiftyTwoWeekHigh ?? "N/A"} | 52W Low: ${financials.price.fiftyTwoWeekLow ?? "N/A"}
% from 52W High: ${financials.price.percentFromHigh?.toFixed(1) ?? "N/A"}%

Financial Commentary:
${financials.llmAnalysis}`
      : "Financial data unavailable.";

    const newsCtx =
      news?.status === "available"
        ? `
=== NEWS ANALYSIS ===
Overall Sentiment: ${news.overallSentiment} (score: ${news.sentimentScore.toFixed(2)})
Articles: ${news.articles.length} | Positive: ${news.positiveCount} | Neutral: ${news.neutralCount} | Negative: ${news.negativeCount}
Key Themes: ${news.keyThemes.join(", ")}
Recent Headlines:
${news.articles
  .slice(0, 5)
  .map((a) => `  - [${a.sentiment.toUpperCase()}] ${a.title}`)
  .join("\n")}`
        : `=== NEWS ===
${news?.warning ?? "News data unavailable. Decision based on financial and risk data only."}`;

    const riskCtx = risk
      ? `
=== RISK ASSESSMENT ===
Overall Risk: ${risk.overallRisk.toUpperCase()} (Score: ${risk.riskScore}/100)
Financial Risk: ${risk.financialRisk} | Regulatory: ${risk.regulatoryRisk} | Competitive: ${risk.competitiveRisk} | Macro: ${risk.macroRisk}
Red Flags: ${risk.redFlags.length > 0 ? risk.redFlags.join("; ") : "None identified"}
Mitigants: ${risk.mitigants.length > 0 ? risk.mitigants.join("; ") : "None identified"}
Volatility: ${risk.volatilityAssessment}`
      : "Risk assessment unavailable.";

    const prompt = `You are an Investment Committee making a binary investment decision. Your role is to synthesize all research and render a final verdict.

${profileCtx}
${financialCtx}
${newsCtx}
${riskCtx}

Based on ALL available information, make a definitive investment decision.

IMPORTANT RULES:
1. You MUST choose either "INVEST" or "PASS" — no other values allowed
2. Confidence must be between 0 and 100
3. Provide exactly 3-6 positive factors and 3-6 negative factors
4. Reasoning must be 3-5 sentences explaining the decision logic
5. If news is unavailable, acknowledge this in your reasoning

Return ONLY this exact JSON structure, no markdown:
{
  "decision": "INVEST" | "PASS",
  "confidence": <integer 0-100>,
  "positiveFactors": ["factor 1", "factor 2", ...],
  "negativeFactors": ["factor 1", "factor 2", ...],
  "reasoning": "Multi-sentence explanation of the investment decision, weighting all factors considered.",
  "generatedAt": "${new Date().toISOString()}"
}`;

    const response = await withRetry(() => model.invoke(prompt), 3, 2000);
    const text =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Committee agent did not return valid JSON");

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate decision is strictly binary
    const decision = parsed.decision === "INVEST" ? "INVEST" : "PASS";
    const confidence = Math.min(100, Math.max(0, Number(parsed.confidence) || 50));

    const committeeReport: CommitteeReport = {
      decision,
      confidence,
      positiveFactors: Array.isArray(parsed.positiveFactors)
        ? parsed.positiveFactors
        : [],
      negativeFactors: Array.isArray(parsed.negativeFactors)
        ? parsed.negativeFactors
        : [],
      reasoning:
        typeof parsed.reasoning === "string"
          ? parsed.reasoning
          : "Reasoning unavailable.",
      generatedAt: new Date().toISOString(),
    };

    return {
      committeeReport,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        committeeAgent: Date.now() - startTime,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Committee agent failed";

    errors.push({
      agent: "committeeAgent",
      message,
      timestamp: new Date().toISOString(),
      recoverable: false,
    });

    // Conservative fallback: PASS with low confidence
    const fallback: CommitteeReport = {
      decision: "PASS",
      confidence: 20,
      positiveFactors: [],
      negativeFactors: ["Analysis could not be completed due to a system error."],
      reasoning:
        "The investment committee could not complete its analysis due to a technical error. A PASS recommendation is issued as a conservative default. Please retry the analysis.",
      generatedAt: new Date().toISOString(),
    };

    return {
      committeeReport: fallback,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        committeeAgent: Date.now() - startTime,
      },
    };
  }
}
