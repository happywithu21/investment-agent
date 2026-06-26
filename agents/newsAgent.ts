/**
 * News Agent
 *
 * Node: "newsAgent"
 * Responsibility:
 *   Fetches recent news from NewsAPI and scores sentiment with the LLM.
 *   On any failure, sets status to "unavailable" and continues the workflow.
 *
 * Output: NewsAnalysis added to GraphState
 */

import type { InvestmentGraphState, AgentError } from "@/types/agents";
import { analyzeCompanyNews } from "@/services/news";

export async function newsAgent(
  state: InvestmentGraphState
): Promise<Partial<InvestmentGraphState>> {
  const startTime = Date.now();
  const errors: AgentError[] = [];

  const companyName = state.companyProfile?.name ?? state.companyName;
  const ticker = state.ticker ?? state.companyName.toUpperCase();

  // analyzeCompanyNews never throws — it returns status: "unavailable" on any error
  const newsAnalysis = await analyzeCompanyNews(companyName, ticker);

  // Track if news was unavailable as a workflow warning
  if (newsAnalysis.status === "unavailable") {
    errors.push({
      agent: "newsAgent",
      message: newsAnalysis.warning ?? "News data unavailable",
      timestamp: new Date().toISOString(),
      recoverable: true, // Workflow continues without news
    });
  }

  return {
    newsAnalysis,
    errors: [...state.errors, ...errors],
    timestamps: {
      ...state.timestamps,
      newsAgent: Date.now() - startTime,
    },
  };
}
