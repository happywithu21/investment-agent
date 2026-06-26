// ============================================================
// API Request / Response Types
// ============================================================

import type { CommitteeReport, CompanyProfile, FinancialData, NewsAnalysis, RiskAssessment } from "./agents";

/**
 * POST /api/analyze — request body
 */
export interface AnalyzeRequest {
  company: string;
}

/**
 * Full investment report assembled after the graph completes.
 * This is the payload of the final "report" SSE event.
 */
export interface InvestmentReport {
  companyName: string;
  ticker: string;
  profile: CompanyProfile;
  financials: FinancialData;
  news: NewsAnalysis;
  risk: RiskAssessment;
  committee: CommitteeReport;
  processingTimeMs: number;
  hasWarnings: boolean;
  warnings: string[];
}

/**
 * Individual SSE event types streamed from the agent pipeline
 */
export type StreamEventType =
  | "step_start"    // agent node is starting
  | "step_complete" // node finished
  | "report"        // final report ready
  | "error"         // unrecoverable error
  | "ping";         // keepalive

export interface StreamEvent<T = unknown> {
  type: StreamEventType;
  node?: string;       // which LangGraph node emitted this
  message?: string;    // human-readable progress message
  data?: T;
  timestamp: string;
  threadId?: string;
}

/**
 * GET /api/health — response
 */
export interface HealthResponse {
  status: "ok" | "degraded";
  version: string;
  timestamp: string;
  services: {
    gemini: "connected" | "missing_key" | "error";
    newsApi: "connected" | "missing_key" | "disabled";
    yahooFinance: "available" | "error";
  };
}

/**
 * Client-side representation of a streaming step for UI display
 */
export interface AgentProgressStep {
  id: string;
  node: string;
  label: string;
  status: "pending" | "running" | "complete" | "error";
  message?: string;
  startedAt?: number;
  completedAt?: number;
}
