// ============================================================
// Agent State & Research Report Core Types
// ============================================================

import { BaseMessage } from "@langchain/core/messages";

/**
 * The central state object that flows through the LangGraph
 */
export interface AgentState {
  // User input
  query: string;
  ticker?: string; // e.g. "TSLA", "AAPL"

  // Planner output
  subQueries: string[];
  searchKeywords: string[];

  // Researcher output
  rawResearch: ResearchArticle[];
  webSearchCompleted: boolean;

  // Analyzer output
  technicalIndicators: TechnicalIndicators | null;
  fundamentalMetrics: FundamentalMetrics | null;

  // Sentiment output
  sentimentScore: SentimentScore | null;

  // Risk output
  riskProfile: RiskProfile | null;

  // Final report
  report: ResearchReport | null;

  // LangGraph bookkeeping
  messages: BaseMessage[];
  step: AgentStep;
  retryCount: number;
  errors: string[];
}

/**
 * Agent execution steps (maps to LangGraph node names)
 */
export type AgentStep =
  | "idle"
  | "researchPlanner"
  | "webResearcher"
  | "dataAnalyzer"
  | "sentimentScorer"
  | "riskAssessor"
  | "reportSynthesizer"
  | "complete"
  | "error";

// ============================================================
// Research & Data Types
// ============================================================

export interface ResearchArticle {
  title: string;
  url: string;
  snippet: string;
  publishedAt?: string;
  source?: string;
  relevanceScore?: number;
}

export interface TechnicalIndicators {
  movingAverage50d: number | null;
  movingAverage200d: number | null;
  rsi14: number | null;  // 0-100
  macd: { value: number; signal: number; histogram: number } | null;
  volumeTrend: "increasing" | "decreasing" | "stable";
  priceChange1d: number | null;   // percentage
  priceChange1w: number | null;   // percentage
  priceChange1m: number | null;   // percentage
  support: number | null;
  resistance: number | null;
}

export interface FundamentalMetrics {
  peRatio: number | null;
  pbRatio: number | null;
  debtToEquity: number | null;
  revenueGrowthYoY: number | null;   // percentage
  earningsGrowthYoY: number | null;  // percentage
  profitMargin: number | null;        // percentage
  marketCap: string | null;          // formatted string e.g. "1.2T"
  dividendYield: number | null;       // percentage
  eps: number | null;
  forwardPE: number | null;
}

// ============================================================
// Sentiment Types
// ============================================================

export type SentimentLabel = "very_bullish" | "bullish" | "neutral" | "bearish" | "very_bearish";

export interface SentimentScore {
  overall: SentimentLabel;
  score: number;         // -1.0 to 1.0
  confidence: number;   // 0.0 to 1.0
  breakdown: {
    positive: number;   // count of positive articles
    neutral: number;
    negative: number;
  };
  keyThemes: string[];  // e.g. ["strong earnings", "regulatory risk"]
  summary: string;
}

// ============================================================
// Risk Types
// ============================================================

export type RiskLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export interface RiskProfile {
  overall: RiskLevel;
  score: number; // 1-10
  factors: RiskFactor[];
  timeHorizon: "short_term" | "medium_term" | "long_term";
  volatilityCategory: "low" | "medium" | "high";
}

export interface RiskFactor {
  name: string;
  level: RiskLevel;
  description: string;
  impact: "low" | "medium" | "high";
}

// ============================================================
// Final Report
// ============================================================

export type Recommendation = "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";

export interface ResearchReport {
  id: string;
  query: string;
  ticker: string;
  companyName: string;
  generatedAt: string; // ISO date string

  recommendation: Recommendation;
  targetPrice: string | null;  // e.g. "$250"
  confidenceLevel: number;     // 0-100

  executiveSummary: string;
  bullishCase: string[];    // 3-5 bullet points
  bearishCase: string[];    // 3-5 bullet points
  catalysts: string[];      // upcoming events/triggers

  sentiment: SentimentScore;
  technicalIndicators: TechnicalIndicators;
  fundamentalMetrics: FundamentalMetrics;
  riskProfile: RiskProfile;

  sources: ResearchArticle[];
  disclaimer: string;
}
