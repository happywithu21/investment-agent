/**
 * Yahoo Finance 2 Service
 *
 * Wraps the yahoo-finance2 library to fetch company fundamentals,
 * price data, and key financial metrics.
 *
 * All methods return null values (never throw) so the graph can continue
 * even when market data is partially unavailable.
 *
 * This file must only run on the Node.js runtime (not edge).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  CompanyProfile,
  FinancialData,
  FinancialMetrics,
  PriceSummary,
  PricePoint,
} from "@/types/agents";

// Use require to avoid ESM/CJS module resolution issues with yahoo-finance2
// eslint-disable-next-line @typescript-eslint/no-require-imports
const yahooFinance = require("yahoo-finance2") as {
  default: {
    search: (query: string) => Promise<any>;
    quote: (ticker: string) => Promise<any>;
    quoteSummary: (ticker: string, options: { modules: string[] }) => Promise<any>;
    historical: (ticker: string, options: any) => Promise<any[]>;
    setGlobalConfig?: (config: any) => void;
  };
};

const yf = yahooFinance.default ?? yahooFinance;

// Silence yahoo-finance2 validation logs in production
try {
  yf.setGlobalConfig?.({ validation: { logOptionsErrors: false } });
} catch {
  // setGlobalConfig may not exist on all versions
}

// ────────────────────────────────────────────────────────────
// Ticker Resolution
// ────────────────────────────────────────────────────────────

/**
 * Resolve a company name to its primary ticker symbol.
 * Tries Yahoo Finance search; falls back to returning the input as-is.
 */
export async function resolveTicker(companyName: string): Promise<string> {
  try {
    const results = await yf.search(companyName);
    const equity = (results?.quotes as any[])?.find(
      (q) => q.typeDisp === "Equity" || q.quoteType === "EQUITY"
    );
    if (equity?.symbol) {
      return equity.symbol as string;
    }
    return companyName.toUpperCase().trim();
  } catch {
    return companyName.toUpperCase().trim();
  }
}

// ────────────────────────────────────────────────────────────
// Company Profile
// ────────────────────────────────────────────────────────────

export async function fetchCompanyProfile(
  ticker: string
): Promise<Omit<CompanyProfile, "dataSource"> | null> {
  try {
    const summary = await yf.quoteSummary(ticker, {
      modules: ["assetProfile", "summaryDetail", "price"],
    });

    const profile = summary?.assetProfile ?? {};
    const price = summary?.price ?? {};

    return {
      name: price?.longName ?? price?.shortName ?? ticker,
      ticker,
      exchange: price?.exchangeName ?? "N/A",
      sector: profile?.sector ?? "N/A",
      industry: profile?.industry ?? "N/A",
      description: profile?.longBusinessSummary ?? "",
      country: profile?.country ?? "N/A",
      employees: profile?.fullTimeEmployees ?? null,
      website: profile?.website ?? null,
      founded: null,
      ceo:
        profile?.companyOfficers?.find((o: any) =>
          o.title?.toLowerCase().includes("ceo")
        )?.name ?? null,
      marketCap: price?.marketCap ?? null,
      currency: price?.currency ?? "USD",
    };
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────
// Financial Metrics
// ────────────────────────────────────────────────────────────

export async function fetchFinancialMetrics(
  ticker: string
): Promise<FinancialMetrics> {
  const empty: FinancialMetrics = {
    peRatio: null,
    pbRatio: null,
    evToEbitda: null,
    revenueGrowthYoY: null,
    grossMargin: null,
    operatingMargin: null,
    netMargin: null,
    debtToEquity: null,
    currentRatio: null,
    returnOnEquity: null,
    eps: null,
    dividendYield: null,
    freeCashFlow: null,
  };

  try {
    const summary = await yf.quoteSummary(ticker, {
      modules: [
        "summaryDetail",
        "defaultKeyStatistics",
        "financialData",
        "incomeStatementHistory",
      ],
    });

    const sd = summary?.summaryDetail ?? {};
    const ks = summary?.defaultKeyStatistics ?? {};
    const fd = summary?.financialData ?? {};

    return {
      peRatio: sd?.trailingPE ?? null,
      pbRatio: ks?.priceToBook ?? null,
      evToEbitda: ks?.enterpriseToEbitda ?? null,
      revenueGrowthYoY: fd?.revenueGrowth != null ? fd.revenueGrowth * 100 : null,
      grossMargin: fd?.grossMargins != null ? fd.grossMargins * 100 : null,
      operatingMargin: fd?.operatingMargins != null ? fd.operatingMargins * 100 : null,
      netMargin: fd?.profitMargins != null ? fd.profitMargins * 100 : null,
      debtToEquity: fd?.debtToEquity ?? null,
      currentRatio: fd?.currentRatio ?? null,
      returnOnEquity: fd?.returnOnEquity != null ? fd.returnOnEquity * 100 : null,
      eps: ks?.trailingEps ?? null,
      dividendYield: sd?.dividendYield != null ? sd.dividendYield * 100 : null,
      freeCashFlow: fd?.freeCashflow ?? null,
    };
  } catch {
    return empty;
  }
}

// ────────────────────────────────────────────────────────────
// Price Summary
// ────────────────────────────────────────────────────────────

export async function fetchPriceSummary(ticker: string): Promise<PriceSummary> {
  const empty: PriceSummary = {
    currentPrice: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    percentFromHigh: null,
    percentFromLow: null,
    averageVolume: null,
    beta: null,
    priceHistory: [],
  };

  try {
    const quote = await yf.quote(ticker);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    let priceHistory: PricePoint[] = [];
    try {
      const historical = await yf.historical(ticker, {
        period1: startDate.toISOString().split("T")[0],
        period2: endDate.toISOString().split("T")[0],
        interval: "1d",
      });
      priceHistory = (historical ?? []).map((p: any) => ({
        date: (p.date instanceof Date ? p.date : new Date(p.date))
          .toISOString()
          .split("T")[0],
        close: (p.close as number) ?? 0,
        volume: (p.volume as number) ?? 0,
      }));
    } catch {
      // price history is optional
    }

    const current: number | null = quote?.regularMarketPrice ?? null;
    const high52: number | null = quote?.fiftyTwoWeekHigh ?? null;
    const low52: number | null = quote?.fiftyTwoWeekLow ?? null;

    return {
      currentPrice: current,
      fiftyTwoWeekHigh: high52,
      fiftyTwoWeekLow: low52,
      percentFromHigh:
        current && high52 ? ((current - high52) / high52) * 100 : null,
      percentFromLow:
        current && low52 ? ((current - low52) / low52) * 100 : null,
      averageVolume: quote?.averageDailyVolume3Month ?? null,
      beta: quote?.beta ?? null,
      priceHistory,
    };
  } catch {
    return empty;
  }
}

// ────────────────────────────────────────────────────────────
// Revenue History (for chart)
// ────────────────────────────────────────────────────────────

export async function fetchRevenueHistory(
  ticker: string
): Promise<Array<{ year: string; revenue: number | null }>> {
  try {
    const summary = await yf.quoteSummary(ticker, {
      modules: ["incomeStatementHistory"],
    });

    const statements: any[] =
      summary?.incomeStatementHistory?.incomeStatementHistory ?? [];

    return statements
      .map((s: any) => ({
        year: s.endDate
          ? new Date(s.endDate instanceof Date ? s.endDate : s.endDate)
              .getFullYear()
              .toString()
          : "N/A",
        revenue: s.totalRevenue ?? null,
      }))
      .reverse();
  } catch {
    return [];
  }
}

// ────────────────────────────────────────────────────────────
// Combined fetch for the Financial Agent
// ────────────────────────────────────────────────────────────

export async function fetchAllFinancialData(ticker: string): Promise<{
  metrics: FinancialMetrics;
  price: PriceSummary;
  revenueHistory: Array<{ year: string; revenue: number | null }>;
  dataSource: FinancialData["dataSource"];
}> {
  const [metrics, price, revenueHistory] = await Promise.all([
    fetchFinancialMetrics(ticker),
    fetchPriceSummary(ticker),
    fetchRevenueHistory(ticker),
  ]);

  const hasMetrics = Object.values(metrics).some((v) => v !== null);
  const hasPrice = price.currentPrice !== null;
  const dataSource: FinancialData["dataSource"] =
    hasMetrics && hasPrice ? "yahoo-finance2" : hasPrice ? "partial" : "error";

  return { metrics, price, revenueHistory, dataSource };
}
