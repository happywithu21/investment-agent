/**
 * Risk Agent
 *
 * Node: "riskAgent"
 * Responsibility:
 *   Synthesises financial metrics, price data, and news sentiment into a
 *   structured risk assessment. Uses LLM to identify red flags and mitigants.
 *
 * Output: RiskAssessment added to GraphState
 */

import type {
  InvestmentGraphState,
  RiskAssessment,
  RiskFactor,
  RiskLevel,
  AgentError,
} from "@/types/agents";
import { getFlashModel, withRetry } from "@/services/gemini";

export async function riskAgent(
  state: InvestmentGraphState
): Promise<Partial<InvestmentGraphState>> {
  const startTime = Date.now();
  const errors: AgentError[] = [];

  const companyName = state.companyProfile?.name ?? state.companyName;
  const ticker = state.ticker ?? "N/A";
  const sector = state.companyProfile?.sector ?? "N/A";
  const industry = state.companyProfile?.industry ?? "N/A";
  const metrics = state.financialData?.metrics;
  const price = state.financialData?.price;
  const news = state.newsAnalysis;

  try {
    const model = getFlashModel();

    // Build a rich context string for the LLM
    const financialContext = metrics
      ? `
P/E Ratio: ${metrics.peRatio ?? "N/A"}
P/B Ratio: ${metrics.pbRatio ?? "N/A"}
EV/EBITDA: ${metrics.evToEbitda ?? "N/A"}
Revenue Growth YoY: ${metrics.revenueGrowthYoY?.toFixed(1) ?? "N/A"}%
Gross Margin: ${metrics.grossMargin?.toFixed(1) ?? "N/A"}%
Operating Margin: ${metrics.operatingMargin?.toFixed(1) ?? "N/A"}%
Net Margin: ${metrics.netMargin?.toFixed(1) ?? "N/A"}%
Debt/Equity: ${metrics.debtToEquity ?? "N/A"}
Current Ratio: ${metrics.currentRatio ?? "N/A"}
Return on Equity: ${metrics.returnOnEquity?.toFixed(1) ?? "N/A"}%
Free Cash Flow: ${metrics.freeCashFlow ? `$${(metrics.freeCashFlow / 1e9).toFixed(2)}B` : "N/A"}`
      : "Financial metrics unavailable.";

    const priceContext = price
      ? `
Beta: ${price.beta ?? "N/A"}
Current Price vs 52W High: ${price.percentFromHigh?.toFixed(1) ?? "N/A"}%
Current Price vs 52W Low: ${price.percentFromLow?.toFixed(1) ?? "N/A"}%`
      : "Price data unavailable.";

    const newsContext =
      news?.status === "available"
        ? `News Sentiment: ${news.overallSentiment} (score: ${news.sentimentScore.toFixed(2)})
Positive Articles: ${news.positiveCount}, Negative: ${news.negativeCount}
Key Themes: ${news.keyThemes.join(", ")}`
        : "News data unavailable.";

    const prompt = `You are a senior investment risk analyst. Assess the investment risk for ${companyName} (${ticker}) in the ${sector} / ${industry} sector.

=== FINANCIAL METRICS ===
${financialContext}

=== PRICE & VOLATILITY ===
${priceContext}

=== NEWS SENTIMENT ===
${newsContext}

Return ONLY a valid JSON object with this exact structure:
{
  "overallRisk": "low" | "medium" | "high" | "critical",
  "riskScore": <integer 0-100, higher = riskier>,
  "factors": [
    {
      "category": "string (e.g. Valuation, Leverage, Profitability, Market, Regulatory, Competitive)",
      "description": "concise description of the specific risk",
      "severity": "low" | "medium" | "high" | "critical"
    }
  ],
  "redFlags": ["list of specific red flags identified, empty array if none"],
  "mitigants": ["list of factors that reduce risk, e.g. strong cash flow, market leader"],
  "volatilityAssessment": "one sentence assessment of price volatility risk",
  "regulatoryRisk": "low" | "medium" | "high" | "critical",
  "competitiveRisk": "low" | "medium" | "high" | "critical",
  "financialRisk": "low" | "medium" | "high" | "critical",
  "macroRisk": "low" | "medium" | "high" | "critical"
}

Include 4-8 risk factors. Be specific and quantitative where possible. No markdown, just JSON.`;

    const response = await withRetry(() => model.invoke(prompt));
    const text =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("LLM did not return valid risk JSON");

    const parsed = JSON.parse(jsonMatch[0]);

    const riskAssessment: RiskAssessment = {
      overallRisk: parsed.overallRisk as RiskLevel,
      riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore))),
      factors: (parsed.factors ?? []) as RiskFactor[],
      redFlags: parsed.redFlags ?? [],
      mitigants: parsed.mitigants ?? [],
      volatilityAssessment: parsed.volatilityAssessment ?? "",
      regulatoryRisk: parsed.regulatoryRisk as RiskLevel,
      competitiveRisk: parsed.competitiveRisk as RiskLevel,
      financialRisk: parsed.financialRisk as RiskLevel,
      macroRisk: parsed.macroRisk as RiskLevel,
    };

    return {
      riskAssessment,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        riskAgent: Date.now() - startTime,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Risk agent failed";

    errors.push({
      agent: "riskAgent",
      message,
      timestamp: new Date().toISOString(),
      recoverable: true,
    });

    // Provide a conservative default risk assessment
    const fallbackRisk: RiskAssessment = {
      overallRisk: "medium",
      riskScore: 50,
      factors: [
        {
          category: "Data Quality",
          description: "Risk assessment based on incomplete data.",
          severity: "medium",
        },
      ],
      redFlags: ["Risk assessment could not be fully completed"],
      mitigants: [],
      volatilityAssessment: "Volatility could not be assessed.",
      regulatoryRisk: "medium",
      competitiveRisk: "medium",
      financialRisk: "medium",
      macroRisk: "medium",
    };

    return {
      riskAssessment: fallbackRisk,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        riskAgent: Date.now() - startTime,
      },
    };
  }
}
