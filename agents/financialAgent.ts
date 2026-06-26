/**
 * Financial Agent
 *
 * Node: "financialAgent"
 * Responsibility:
 *   1. Fetch all financial metrics from Yahoo Finance (P/E, margins, debt, etc.)
 *   2. Fetch price history and current quote
 *   3. Use LLM to generate a financial commentary based on the raw numbers
 *
 * Output: FinancialData added to GraphState
 */

import type { InvestmentGraphState, FinancialData, AgentError } from "@/types/agents";
import { fetchAllFinancialData } from "@/services/finance";
import { getFlashModel, withRetry } from "@/services/gemini";

export async function financialAgent(
  state: InvestmentGraphState
): Promise<Partial<InvestmentGraphState>> {
  const startTime = Date.now();
  const errors: AgentError[] = [];

  const ticker = state.ticker ?? state.companyName.toUpperCase();
  const companyName = state.companyProfile?.name ?? state.companyName;
  const sector = state.companyProfile?.sector ?? "N/A";

  try {
    // Step 1: Fetch raw financial data
    const { metrics, price, revenueHistory, dataSource } =
      await fetchAllFinancialData(ticker);

    // Step 2: LLM financial commentary
    let llmAnalysis =
      "Financial data analysis could not be completed at this time.";
    try {
      const model = getFlashModel();

      const metricsStr = Object.entries(metrics)
        .map(([k, v]) => `${k}: ${v !== null ? v.toFixed(2) : "N/A"}`)
        .join(", ");

      const prompt = `You are a CFA-level financial analyst. Analyze the following financial metrics for ${companyName} (${ticker}) in the ${sector} sector.

Financial Metrics:
${metricsStr}

Current Price: ${price.currentPrice ?? "N/A"}
Beta: ${price.beta ?? "N/A"}
52-Week High: ${price.fiftyTwoWeekHigh ?? "N/A"}
52-Week Low: ${price.fiftyTwoWeekLow ?? "N/A"}
% From 52W High: ${price.percentFromHigh?.toFixed(1) ?? "N/A"}%

Provide a concise (3–5 sentence) professional financial commentary that:
1. Assesses valuation relative to the sector
2. Comments on profitability and margin quality
3. Evaluates financial health (debt, cash flow)
4. Notes any standout positive or negative metrics

Return ONLY the commentary text — no headers, no JSON, no bullet points.`;

      const response = await withRetry(() => model.invoke(prompt));
      llmAnalysis =
        typeof response.content === "string"
          ? response.content.trim()
          : "Analysis unavailable.";
    } catch (llmErr) {
      errors.push({
        agent: "financialAgent",
        message: `LLM commentary failed: ${llmErr instanceof Error ? llmErr.message : "unknown"}`,
        timestamp: new Date().toISOString(),
        recoverable: true,
      });
    }

    const financialData: FinancialData = {
      metrics,
      price,
      revenueHistory,
      llmAnalysis,
      dataSource,
    };

    return {
      financialData,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        financialAgent: Date.now() - startTime,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Financial agent failed";

    errors.push({
      agent: "financialAgent",
      message,
      timestamp: new Date().toISOString(),
      recoverable: true,
    });

    const emptyFinancialData: FinancialData = {
      metrics: {
        peRatio: null, pbRatio: null, evToEbitda: null,
        revenueGrowthYoY: null, grossMargin: null,
        operatingMargin: null, netMargin: null,
        debtToEquity: null, currentRatio: null,
        returnOnEquity: null, eps: null,
        dividendYield: null, freeCashFlow: null,
      },
      price: {
        currentPrice: null, fiftyTwoWeekHigh: null,
        fiftyTwoWeekLow: null, percentFromHigh: null,
        percentFromLow: null, averageVolume: null,
        beta: null, priceHistory: [],
      },
      revenueHistory: [],
      llmAnalysis: "Financial data could not be retrieved.",
      dataSource: "error",
    };

    return {
      financialData: emptyFinancialData,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        financialAgent: Date.now() - startTime,
      },
    };
  }
}
