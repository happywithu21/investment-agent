// ============================================================
// LangGraph Agent State & Output Types
// ============================================================

/**
 * Shared state flowing through the LangGraph StateGraph.
 * Each agent reads from and writes to this state object.
 */
export interface InvestmentGraphState {
  /** User-supplied company name */
  companyName: string;

  /** Resolved ticker symbol (e.g. "AAPL") */
  ticker?: string;

  /** Output from Research Agent */
  companyProfile?: CompanyProfile;

  /** Output from Financial Agent */
  financialData?: FinancialData;

  /** Output from News Agent */
  newsAnalysis?: NewsAnalysis;

  /** Output from Risk Agent */
  riskAssessment?: RiskAssessment;

  /** Final output from Investment Committee Agent */
  committeeReport?: CommitteeReport;

  /** Accumulated errors from any agent */
  errors: AgentError[];

  /** Timestamps for each agent step */
  timestamps: Record<string, number>;
}

// ────────────────────────────────────────────────────────────
// Research Agent Output
// ────────────────────────────────────────────────────────────

export interface CompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  country: string;
  employees: number | null;
  website: string | null;
  founded: string | null;
  ceo: string | null;
  marketCap: number | null;
  currency: string;
  dataSource: "yahoo-finance2" | "llm-inferred";
}

// ────────────────────────────────────────────────────────────
// Financial Agent Output
// ────────────────────────────────────────────────────────────

export interface FinancialMetrics {
  peRatio: number | null;
  pbRatio: number | null;
  evToEbitda: number | null;
  revenueGrowthYoY: number | null; // percentage
  grossMargin: number | null;       // percentage
  operatingMargin: number | null;   // percentage
  netMargin: number | null;         // percentage
  debtToEquity: number | null;
  currentRatio: number | null;
  returnOnEquity: number | null;    // percentage
  eps: number | null;
  dividendYield: number | null;     // percentage
  freeCashFlow: number | null;
}

export interface PricePoint {
  date: string;
  close: number;
  volume: number;
}

export interface PriceSummary {
  currentPrice: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  percentFromHigh: number | null;
  percentFromLow: number | null;
  averageVolume: number | null;
  beta: number | null;
  priceHistory: PricePoint[]; // last 30 data points for chart
}

export interface FinancialData {
  metrics: FinancialMetrics;
  price: PriceSummary;
  revenueHistory: Array<{ year: string; revenue: number | null }>;
  llmAnalysis: string; // LLM financial commentary
  dataSource: "yahoo-finance2" | "partial" | "error";
}

// ────────────────────────────────────────────────────────────
// News Agent Output
// ────────────────────────────────────────────────────────────

export type SentimentLabel = "positive" | "neutral" | "negative";

export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: SentimentLabel;
  sentimentScore: number; // -1 to 1
  summary: string;
}

export interface NewsAnalysis {
  status: "available" | "unavailable";
  articles: NewsArticle[];
  overallSentiment: SentimentLabel;
  sentimentScore: number; // -1 to 1
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  keyThemes: string[];
  warning?: string; // shown when status = "unavailable"
}

// ────────────────────────────────────────────────────────────
// Risk Agent Output
// ────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskFactor {
  category: string;
  description: string;
  severity: RiskLevel;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  riskScore: number; // 0–100, higher = riskier
  factors: RiskFactor[];
  redFlags: string[];
  mitigants: string[];
  volatilityAssessment: string;
  regulatoryRisk: RiskLevel;
  competitiveRisk: RiskLevel;
  financialRisk: RiskLevel;
  macroRisk: RiskLevel;
}

// ────────────────────────────────────────────────────────────
// Investment Committee Agent Output (Final)
// ────────────────────────────────────────────────────────────

export interface CommitteeReport {
  decision: "INVEST" | "PASS";
  confidence: number; // 0–100
  positiveFactors: string[];
  negativeFactors: string[];
  reasoning: string;
  generatedAt: string; // ISO timestamp
}

// ────────────────────────────────────────────────────────────
// Error tracking
// ────────────────────────────────────────────────────────────

export interface AgentError {
  agent: string;
  message: string;
  timestamp: string;
  recoverable: boolean;
}
