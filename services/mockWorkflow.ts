/**
 * Dynamic Mock Investment Workflow Generator
 * 
 * Generates unique, realistic financial metrics, price charts, news analysis,
 * risk assessments, and investment decisions customized dynamically for EVERY company.
 */

import type { InvestmentGraphState, CompanyProfile, FinancialData, NewsAnalysis, RiskAssessment, CommitteeReport, RiskLevel, SentimentLabel } from "@/types/agents";
import type { StepEventCallback } from "@/agents/graph";

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateMockTicker(companyName: string): string {
  const cleaned = companyName.toUpperCase().replace(/[^A-Z]/g, "");
  if (cleaned.length <= 4) return cleaned || "MOCK";
  if (cleaned.includes("RELIANCE")) return "RELIANCE";
  if (cleaned.includes("TATA")) return "TCS";
  if (cleaned.includes("NVIDIA")) return "NVDA";
  if (cleaned.includes("APPLE")) return "AAPL";
  if (cleaned.includes("TESLA")) return "TSLA";
  if (cleaned.includes("MICROSOFT")) return "MSFT";
  return cleaned.slice(0, 4);
}

export async function runMockInvestmentWorkflow(
  companyName: string,
  onStep?: StepEventCallback
): Promise<InvestmentGraphState> {
  const startTime = Date.now();
  const cleanName = companyName.trim();
  const ticker = generateMockTicker(cleanName);
  const hash = getHash(cleanName.toLowerCase());

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Sector and industry determination
  const lower = cleanName.toLowerCase();
  let sector = "Technology & Innovation";
  let industry = "Enterprise Software & Cloud";
  let country = "United States";
  let exchange = "NASDAQ";
  let currency = "USD";

  if (lower.includes("reliance") || lower.includes("tata") || lower.includes("infosys") || lower.includes("wipro") || lower.includes("hdfc") || lower.includes("icici")) {
    country = "India";
    exchange = "NSE / BSE";
    currency = "INR";
    if (lower.includes("reliance")) {
      sector = "Energy & Digital Services";
      industry = "Integrated Conglomerate & Telecom";
    } else if (lower.includes("tata") || lower.includes("infosys")) {
      sector = "Information Technology";
      industry = "IT Consulting & Digital Transformation";
    }
  } else if (lower.includes("tesla") || lower.includes("auto") || lower.includes("motors")) {
    sector = "Consumer Discretionary";
    industry = "Electric Vehicles & Clean Energy";
  } else if (lower.includes("nvidia") || lower.includes("semiconductor") || lower.includes("chip")) {
    sector = "Semiconductors";
    industry = "AI Hardware & GPU Computing";
  } else if (lower.includes("pharma") || lower.includes("health") || lower.includes("bio")) {
    sector = "Healthcare & Pharmaceuticals";
    industry = "Biotechnology & Drug Discovery";
  }

  // --- Step 1: Research Agent ---
  onStep?.("step_start", "researchAgent", "Researching Company...");
  await delay(700);

  const companyProfile: CompanyProfile = {
    name: cleanName,
    ticker,
    exchange,
    sector,
    industry,
    description: `${cleanName} is a prominent market participant in the ${industry} domain. The organization focuses on scalable operational architecture, continuous technological R&D, and expanding market footprint across global territories.`,
    country,
    employees: 25000 + (hash % 180000),
    website: `https://www.${ticker.toLowerCase()}.com`,
    founded: (1970 + (hash % 45)).toString(),
    ceo: ["Satya Nadella", "Jensen Huang", "Tim Cook", "Elon Musk", "Mukesh Ambani", "N. Chandrasekaran", "Sundar Pichai"][hash % 7],
    marketCap: (20 + (hash % 280)) * 1000000000,
    currency,
    dataSource: "llm-inferred",
  };
  onStep?.("step_complete", "researchAgent", "Researching Company complete");

  // --- Step 2: Financial Agent ---
  onStep?.("step_start", "financialAgent", "Analyzing Financials...");
  await delay(800);

  const peRatio = Number((12.5 + (hash % 35) + (hash % 10) / 10).toFixed(2));
  const pbRatio = Number((2.1 + (hash % 12) + (hash % 10) / 10).toFixed(2));
  const evToEbitda = Number((8.5 + (hash % 22) + (hash % 10) / 10).toFixed(2));
  const revenueGrowthYoY = Number((-4.0 + (hash % 38) + (hash % 10) / 10).toFixed(1));
  const grossMargin = Number((28.0 + (hash % 48) + (hash % 10) / 10).toFixed(1));
  const operatingMargin = Number((10.0 + (hash % 24) + (hash % 10) / 10).toFixed(1));
  const netMargin = Number((6.0 + (hash % 18) + (hash % 10) / 10).toFixed(1));
  const debtToEquity = Number((0.15 + (hash % 85) / 100).toFixed(2));
  const currentRatio = Number((1.2 + (hash % 15) / 10).toFixed(2));
  const returnOnEquity = Number((12.0 + (hash % 25) + (hash % 10) / 10).toFixed(1));
  const basePrice = Number((35.0 + (hash % 420) + (hash % 10) / 10).toFixed(2));
  const eps = Number((basePrice / peRatio).toFixed(2));

  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0];
    const trend = Math.sin((i + (hash % 10)) / 2.5) * (basePrice * 0.08) + ((i - 15) * (basePrice * 0.005));
    return {
      date,
      close: Number((basePrice + trend).toFixed(2)),
      volume: 5000000 + (hash % 20) * 1000000,
    };
  });

  const financialData: FinancialData = {
    metrics: {
      peRatio,
      pbRatio,
      evToEbitda,
      revenueGrowthYoY,
      grossMargin,
      operatingMargin,
      netMargin,
      debtToEquity,
      currentRatio,
      returnOnEquity,
      eps,
      dividendYield: Number(((hash % 30) / 10).toFixed(1)),
      freeCashFlow: (2 + (hash % 25)) * 1000000000,
    },
    price: {
      currentPrice: basePrice,
      fiftyTwoWeekHigh: Number((basePrice * 1.22).toFixed(2)),
      fiftyTwoWeekLow: Number((basePrice * 0.78).toFixed(2)),
      percentFromHigh: Number((((basePrice - basePrice * 1.22) / (basePrice * 1.22)) * 100).toFixed(1)),
      percentFromLow: Number((((basePrice - basePrice * 0.78) / (basePrice * 0.78)) * 100).toFixed(1)),
      averageVolume: 12000000 + (hash % 15) * 1000000,
      beta: Number((0.85 + (hash % 60) / 100).toFixed(2)),
      priceHistory,
    },
    revenueHistory: [
      { year: "2021", revenue: (12 + (hash % 20)) * 1000000000 },
      { year: "2022", revenue: (15 + (hash % 22)) * 1000000000 },
      { year: "2023", revenue: (19 + (hash % 25)) * 1000000000 },
      { year: "2024", revenue: (24 + (hash % 28)) * 1000000000 },
    ],
    llmAnalysis: `${cleanName} demonstrates key fundamental indicators with a ${revenueGrowthYoY}% YoY revenue trajectory and operating margins standing at ${operatingMargin}%. Trading at a valuation multiple of ${peRatio}x P/E, the asset reflects a ${returnOnEquity}% Return on Equity and a balance sheet leverage ratio of ${debtToEquity} D/E.`,
    dataSource: "partial",
  };
  onStep?.("step_complete", "financialAgent", "Analyzing Financials complete");

  // --- Step 3: News Agent ---
  onStep?.("step_start", "newsAgent", "Scanning News...");
  await delay(700);

  const isPositiveNews = hash % 2 === 0;
  const newsSentiment: SentimentLabel = isPositiveNews ? "positive" : "neutral";
  const sentimentScore = isPositiveNews ? 0.68 : 0.12;

  const newsAnalysis: NewsAnalysis = {
    status: "available",
    articles: [
      {
        title: `${cleanName} Highlights Operational Progress in Latest Strategic Quarterly Update`,
        source: "Financial Express",
        publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        url: "#",
        sentiment: newsSentiment,
        sentimentScore,
        summary: `Leadership outlined upcoming market initiatives and product pipeline advancements for ${cleanName}.`,
      },
      {
        title: `Market Analysts Evaluate Industry Dynamics Impacting ${ticker}`,
        source: "Wall Street Journal",
        publishedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
        url: "#",
        sentiment: "neutral",
        sentimentScore: 0.1,
        summary: `Institutional researchers analyze competitive positioning and sector growth outlook.`,
      },
    ],
    overallSentiment: newsSentiment,
    sentimentScore,
    positiveCount: isPositiveNews ? 2 : 1,
    neutralCount: 1,
    negativeCount: 0,
    keyThemes: [`${sector} R&D`, "Market Expansion", "Capital Allocation", "Operational Scaling"],
  };
  onStep?.("step_complete", "newsAgent", "Scanning News complete");

  // --- Step 4: Risk Agent ---
  onStep?.("step_start", "riskAgent", "Assessing Risk...");
  await delay(700);

  const riskScore = 25 + (hash % 45);
  let overallRisk: RiskLevel = "medium";
  if (riskScore < 35) overallRisk = "low";
  else if (riskScore > 55) overallRisk = "high";

  const riskAssessment: RiskAssessment = {
    overallRisk,
    riskScore,
    factors: [
      {
        category: "Valuation & Multiples",
        description: `P/E ratio of ${peRatio}x reflects investor expectations for continued growth.`,
        severity: peRatio > 30 ? "high" : "medium",
      },
      {
        category: "Market Competition",
        description: `Competitive pressure within the ${sector} industry segment.`,
        severity: "medium",
      },
    ],
    redFlags: peRatio > 35 ? ["High valuation multiple leaves narrow margin of safety."] : [],
    mitigants: [
      `Solid Return on Equity of ${returnOnEquity}%`,
      `Healthy liquidity buffer with current ratio of ${currentRatio}`,
    ],
    volatilityAssessment: `Measured stock price volatility with a Beta rating of ${financialData.price.beta}.`,
    regulatoryRisk: "low",
    competitiveRisk: "medium",
    financialRisk: debtToEquity > 0.7 ? "medium" : "low",
    macroRisk: "medium",
  };
  onStep?.("step_complete", "riskAgent", "Assessing Risk complete");

  // --- Step 5: Committee Agent ---
  onStep?.("step_start", "committeeAgent", "Investment Committee...");
  await delay(900);

  const isInvest = revenueGrowthYoY > 5 && returnOnEquity > 14 && peRatio < 38;
  const decision = isInvest ? "INVEST" : "PASS";
  const confidence = 70 + (hash % 23);

  const committeeReport: CommitteeReport = {
    decision,
    confidence,
    positiveFactors: [
      `Revenue growth trajectory of ${revenueGrowthYoY}% YoY`,
      `Return on Equity of ${returnOnEquity}% demonstrating operating efficiency`,
      `Established operational moat in ${industry}`,
    ],
    negativeFactors: [
      `Valuation multiple sitting at ${peRatio}x P/E`,
      `Macroeconomic exposure across the ${sector} sector`,
    ],
    reasoning: `The Investment Committee issues a definitive ${decision} recommendation for ${cleanName} (${ticker}) with a confidence score of ${confidence}%. The synthesis highlights an operational return profile (ROE: ${returnOnEquity}%) alongside a revenue trajectory of ${revenueGrowthYoY}% YoY. ${isInvest ? "The fundamental strengths and cash flow generation support a favorable long-term entry point." : "Valuation multiples and sector volatility warrant a conservative hold/pass stance at present levels."}`,
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
      researchAgent: 700,
      financialAgent: 800,
      newsAgent: 700,
      riskAgent: 700,
      committeeAgent: 900,
    },
  };
}
