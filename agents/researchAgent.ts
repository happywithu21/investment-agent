/**
 * Research Agent
 *
 * Node: "researchAgent"
 * Responsibility:
 *   1. Resolve the company name to a ticker symbol via Yahoo Finance.
 *   2. Fetch the company profile (sector, description, employees, etc.).
 *   3. If Yahoo Finance fails, use LLM to infer basic company information.
 *
 * Output: CompanyProfile added to GraphState
 */

import type { InvestmentGraphState, CompanyProfile, AgentError } from "@/types/agents";
import { fetchCompanyProfile, resolveTicker } from "@/services/finance";
import { getFlashModel, withRetry } from "@/services/gemini";

export async function researchAgent(
  state: InvestmentGraphState
): Promise<Partial<InvestmentGraphState>> {
  const startTime = Date.now();
  const errors: AgentError[] = [];

  try {
    // Step 1: Resolve ticker
    const ticker = await resolveTicker(state.companyName);

    // Step 2: Fetch profile from Yahoo Finance
    const yfinanceProfile = await fetchCompanyProfile(ticker);

    let companyProfile: CompanyProfile;

    if (yfinanceProfile) {
      companyProfile = {
        ...yfinanceProfile,
        dataSource: "yahoo-finance2",
      };
    } else {
      // Step 3: LLM fallback — infer company info from training knowledge
      const model = getFlashModel();
      const prompt = `You are a financial research assistant. Provide basic company information for "${state.companyName}" (ticker: ${ticker}).

Return ONLY a valid JSON object with these exact fields:
{
  "name": "full legal company name",
  "ticker": "${ticker}",
  "exchange": "NYSE|NASDAQ|BSE|NSE|etc",
  "sector": "sector name",
  "industry": "industry name",
  "description": "2-3 sentence business description",
  "country": "country of headquarters",
  "employees": null,
  "website": "https://example.com or null",
  "founded": "year or null",
  "ceo": "CEO name or null",
  "marketCap": null,
  "currency": "USD"
}

No markdown, no explanation, just the JSON object.`;

      const response = await withRetry(() => model.invoke(prompt));
      const text =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("LLM did not return valid company JSON");

      const llmData = JSON.parse(jsonMatch[0]);
      companyProfile = { ...llmData, dataSource: "llm-inferred" };
    }

    return {
      ticker,
      companyProfile,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        researchAgent: Date.now() - startTime,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Research agent failed";

    errors.push({
      agent: "researchAgent",
      message,
      timestamp: new Date().toISOString(),
      recoverable: false,
    });

    // Return minimal profile so the graph can continue
    const fallbackProfile: CompanyProfile = {
      name: state.companyName,
      ticker: state.companyName.toUpperCase().slice(0, 5),
      exchange: "N/A",
      sector: "N/A",
      industry: "N/A",
      description: "Profile data unavailable.",
      country: "N/A",
      employees: null,
      website: null,
      founded: null,
      ceo: null,
      marketCap: null,
      currency: "USD",
      dataSource: "llm-inferred",
    };

    return {
      ticker: fallbackProfile.ticker,
      companyProfile: fallbackProfile,
      errors: [...state.errors, ...errors],
      timestamps: {
        ...state.timestamps,
        researchAgent: Date.now() - startTime,
      },
    };
  }
}
