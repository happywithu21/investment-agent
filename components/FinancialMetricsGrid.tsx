"use client";

import { BarChart2, TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPercent, formatMarketCap } from "@/lib/utils";
import type { FinancialData } from "@/types/agents";

interface FinancialMetricsGridProps { data: FinancialData }

/* ── Metric value formatter ─────────────────── */
function fmt(v: number | null, type: "ratio" | "percent" | "currency" | "raw"): string {
  if (v === null) return "—";
  if (type === "ratio")    return `${v.toFixed(2)}×`;
  if (type === "percent")  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
  if (type === "currency") return formatMarketCap(v);
  return v.toFixed(2);
}

/* ── Single metric tile ─────────────────────── */
function Metric({
  label, value, type = "raw", positive, negative, desc,
}: {
  label: string;
  value: number | null;
  type?: "ratio" | "percent" | "currency" | "raw";
  positive?: boolean;
  negative?: boolean;
  desc?: string;
}) {
  const isGood = positive && value !== null && value > 0;
  const isBad  = negative && value !== null && value > 50;
  const color  = isGood ? "var(--invest)" : isBad ? "var(--pass)" : value !== null ? "var(--text-1)" : "var(--text-4)";

  return (
    <div className="metric-card" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <p style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 16.5, fontWeight: 700, color,
          fontFamily: "var(--font-mono)", lineHeight: 1,
        }}
      >
        {fmt(value, type)}
      </p>
      {desc && (
        <p style={{ fontSize: 10.5, color: "var(--text-4)", lineHeight: 1.3 }}>{desc}</p>
      )}
    </div>
  );
}

/* ── Custom tooltip ─────────────────────────── */
function PriceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface-active)", border: "1px solid var(--border-hover)",
        borderRadius: 6, padding: "6px 10px",
      }}
    >
      <p style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", fontFamily: "var(--font-mono)" }}>
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export function FinancialMetricsGrid({ data }: FinancialMetricsGridProps) {
  const m = data.metrics;
  const p = data.price;
  const rising = p.priceHistory.length > 1
    && p.priceHistory.at(-1)!.close > p.priceHistory[0].close;

  return (
    <div className="card animate-fade-up delay-1" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <BarChart2 size={14} color="var(--accent)" />
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", flex: 1 }}>
          Financial Analysis
        </p>
        {p.currentPrice && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-1)" }}>
              ${p.currentPrice.toFixed(2)}
            </span>
            {p.percentFromHigh !== null && (
              <span
                style={{
                  fontSize: 11.5, fontWeight: 600,
                  color: p.percentFromHigh < -5 ? "var(--pass)" : "var(--invest)",
                  display: "flex", alignItems: "center", gap: 2,
                }}
              >
                {p.percentFromHigh < 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                {formatPercent(p.percentFromHigh)} from 52W high
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px" }}>
        {/* Price chart */}
        {p.priceHistory.length > 5 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              90-day price history
            </p>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={p.priceHistory} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={rising ? "#22c55e" : "#ef4444"} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={rising ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date" hide
                  tickLine={false} axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--text-4)" }}
                  tickFormatter={(v: string) => v.slice(5)}
                  interval="preserveStartEnd"
                />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip content={<PriceTooltip />} />
                <Area
                  type="monotone" dataKey="close"
                  stroke={rising ? "#22c55e" : "#ef4444"} strokeWidth={1.5}
                  fill="url(#pg)" dot={false}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Metrics grid */}
        <p style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 500, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Key ratios
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Metric label="P/E Ratio"       value={m.peRatio}          type="ratio"   desc="Trailing" />
          <Metric label="P/B Ratio"        value={m.pbRatio}          type="ratio"   />
          <Metric label="EV/EBITDA"        value={m.evToEbitda}       type="ratio"   />
          <Metric label="Revenue Growth"   value={m.revenueGrowthYoY} type="percent" positive desc="YoY" />
          <Metric label="Gross Margin"     value={m.grossMargin}      type="percent" positive />
          <Metric label="Operating Margin" value={m.operatingMargin}  type="percent" positive />
          <Metric label="Net Margin"       value={m.netMargin}        type="percent" positive />
          <Metric label="Debt / Equity"    value={m.debtToEquity}     negative       />
          <Metric label="Current Ratio"    value={m.currentRatio}     positive       />
          <Metric label="ROE"              value={m.returnOnEquity}   type="percent" positive />
          <Metric label="EPS"              value={m.eps}              type="raw"     />
          <Metric label="Div. Yield"       value={m.dividendYield}    type="percent" />
        </div>

        {/* LLM Commentary */}
        {data.llmAnalysis && data.dataSource !== "error" && (
          <div
            style={{
              padding: "12px 14px",
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              AI commentary
            </p>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65 }}>
              {data.llmAnalysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
