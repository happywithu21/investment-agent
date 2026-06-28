/**
 * Mock Investment Workflow Generator
 * 
 * Used when API keys (GOOGLE_API_KEY / NEWS_API_KEY) are not configured.
 * Generates realistic, rich fictional investment analysis data tailored to any company name.
 */

import type { InvestmentGraphState, CompanyProfile, FinancialData, NewsAnalysis, RiskAssessment, CommitteeReport } from "@/types/agents";
import type { StepEventCallback } from "@/agents/graph";

function generateMockTicker(companyName: string): string {
  const cleaned = companyName.toUpperCase().replace(/[^A-Z]/g, "");
  if (cleaned.length <= 4) return cleaned || "MOCK";
  return cleaned.slice(0, 4);
}

export async function runMockInvestmentWorkflow(
  companyName: string,
  onStep?: StepEventCallback
): Promise<InvestmentGraphState> {
  const startTime = Date.now();
  const ticker = generateMockTicker(companyName);
  const cleanName = companyName.trim();

  // Helper for step delays
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Step 1: Research Agent ---
  onStep?.("step_start", "researchAgent", "Researching Company...");
  await delay(800);

  const companyProfile: CompanyProfile = {
    name: cleanName.length > 3 ? cleanName : `${cleanName} Corp`,
    ticker,
    exchange: cleanName.toLowerCase().includes("ltd") || cleanName.toLowerCase().includes("india") || cleanName.toLowerCase().includes("tata") || cleanName.toLowerCase().includes("reliance") ? "NSE / BSE" : "NASDAQ",
    sector: "Technology & Growth",
    industry: "Enterprise Solutions & Innovation",
    description: `${cleanName} is a leading enterprise operating in high-growth market segments. The company specializes in scalable operations, proprietary technology infrastructure, and global distribution channels.`,
    country: cleanName.toLowerCase().includes("tata") || cleanName.toLowerCase().includes("reliance") ? "India" : "United States",
    employees: 45200,
    website: `https://www.${ticker.toLowerCase()}.com`,
    founded: "2010",
    ceo: "Alex Mercer",
    marketCap: 145000000000, // $145B
    currency: cleanName.toLowerCase().includes("tata") || cleanName.toLowerCase().includes("reliance") ? "INR" : "USD",
    dataSource: "llm-inferred",
  };
  onStep?.("step_complete", "researchAgent", "Researching Company complete");

  // --- Step 2: Financial Agent ---
  onStep?.("step_start", "financialAgent", "Analyzing Financials...");
  await delay(900);

  const basePrice = 185.5;
  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0];
    const variation = Math.sin(i / 3) * 12 + (i * 0.8);
    return {
      date,
      close: Number((basePrice + variation).toFixed(2)),
      volume: Math.floor(15000000 + Math.random() * 5000000),
    };
  });

  const financialData: FinancialData = {
    metrics: {
      peRatio: 24.8,
      pbRatio: 6.2,
      evToEbitda: 16.4,
      revenueGrowthYoY: 18.5,
      grossMargin: 64.2,
      operatingMargin: 22.8,
      netMargin: 17.4,
      debtToEquity: 0.45,
      currentRatio: 1.85,
      returnOnEquity: 26.4,
      eps: 7.48,
      dividendYield: 1.2,
      freeCashFlow: 18400000000,
    },
    price: {
      currentPrice: 208.4,
      fiftyTwoWeekHigh: 225.0,
      fiftyTwoWeekLow: 155.2,
      percentFromHigh: -7.38,
      percentFromLow: 34.28,
      averageVolume: 18200000,
      beta: 1.12,
      priceHistory,
    },
    revenueHistory: [
      { year: "2021", revenue: 28500000000 },
      { year: "2022", revenue: 34200000000 },
      { year: "2023", revenue: 41000000000 },
      { year: "2024", revenue: 48500000000 },
    ],
    llmAnalysis: `${cleanName} demonstrates robust financial fundamentals with a 18.5% YoY revenue expansion and strong operating margins of 22.8%. Valuation metrics reflect premium quality pricing (P/E of 24.8x) backed by high Return on Equity (26.4%) and manageable debt balance.`,
    dataSource: "partial",
  };
  onStep?.("step_complete", "financialAgent", "Analyzing Financials complete");

  // --- Step 3: News Agent ---
  onStep?.("step_start", "newsAgent", "Scanning News...");
  await delay(800);

  const newsAnalysis: NewsAnalysis = {
    status: "available",
    articles: [
      {
        title: `${cleanName} Announces Strategic Expansion into Next-Gen AI Infrastructure`,
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        url: "#",
        sentiment: "positive",
        sentimentScore: 0.85,
        summary: "The company unveiled major investment plans targeting automated operations and strategic cloud enterprise partnerships.",
      },
      {
        title: `Q4 Earnings Preview: Wall Street Analysts Raise Target Price for ${ticker}`,
        source: "Bloomberg",
        publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        url: "#",
        sentiment: "positive",
        sentimentScore: 0.72,
        summary: "Institutional analysts cite solid margin expansion and strong customer retention metrics as key growth catalysts.",
      },
      {
        title: `Tech Sector Market Update: Macro Volatility Tests Mid-Cap Valuations`,
        source: "Reuters",
        publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        url: "#",
        sentiment: "neutral",
        sentimentScore: 0.05,
        summary: "Broader industry headwinds remain a factor as central bank rate policy influences growth stock valuations.",
      },
    ],
    overallSentiment: "positive",
    sentimentScore: 0.54,
    positiveCount: 2,
    neutralCount: 1,
    negativeCount: 0,
    keyThemes: ["AI Infrastructure", "Margin Expansion", "Strategic Partnerships", "Global Scale"],
  };
  onStep?.("step_complete", "newsAgent", "Scanning News complete");

  // --- Step 4: Risk Agent ---
  onStep?.("step_start", "riskAgent", "Assessing Risk...");
  await delay(800);

  const riskAssessment: RiskAssessment = {
    overallRisk: "medium",
    riskScore: 38,
    factors: [
      {
        category: "Valuation",
        description: "Trading at elevated multi-year multiples relative to broader sector peers.",
        severity: "medium",
      },
      {
        category: "Competition",
        description: "Rapid technological advances by incumbent technology providers.",
        severity: "medium",
      },
      {
        category: "Macroeconomic",
        description: "Currency fluctuations and global interest rate adjustments impact international revenue.",
        severity: "low",
      },
    ],
    redFlags: [],
    mitigants: [
      "Substantial free cash flow reserves ($18.4B)",
      "Strong pricing power supported by high gross margins (64.2%)",
      "Diversified customer base across global geographic regions",
    ],
    volatilityAssessment: "Moderate price volatility driven by broader tech sector sector momentum and quarterly earnings reports.",
    regulatoryRisk: "low",
    competitiveRisk: "medium",
    financialRisk: "low",
    macroRisk: "medium",
  };
  onStep?.("step_complete", "riskAgent", "Assessing Risk complete");

  // --- Step 5: Committee Agent ---
  onStep?.("step_start", "committeeAgent", "Investment Committee...");
  await delay(1000);

  const committeeReport: CommitteeReport = {
    decision: "INVEST",
    confidence: 84,
    positiveFactors: [
      "Accelerating YoY revenue growth of 18.5% with expanding operating profitability",
      "High Return on Equity (26.4%) demonstrating capital allocation efficiency",
      "Robust balance sheet anchored by $18.4B in annual Free Cash Flow",
      "Positive news sentiment and strong institutional analyst backing",
    ],
    negativeFactors: [
      "Premium valuation multiple (24.8x P/E) limits short-term margin of safety",
      "Exposure to broader tech sector market volatility",
    ],
    reasoning: `The Investment Committee renders a definitive INVEST verdict for ${cleanName} (${ticker}). The company combines strong top-line momentum with impressive operational leverage and pristine balance sheet strength. While valuation metrics sit at a minor premium, the structural competitive moat and robust cash generation justify a favorable long-term position.`,
    generatedAt: new Date().toISOString(),
  };
  onStep?.("step_complete", "committeeAgent", "Investment Committee complete");

  return {
    companyName: cleanName,
    ticker,
    companyProfile,
    financialData,
    newsAnalysis,
    riskAssessment,
    committeeReport,
    errors: [],
    timestamps: {
      workflowStart: startTime,
      researchAgent: 800,
      financialAgent: 900,
      newsAgent: 800,
      riskAgent: 800,
      committeeAgent: 1000,
    },
  };
}
