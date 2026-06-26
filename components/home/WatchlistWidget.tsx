"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const WATCHLIST = [
  { ticker: "AAPL",  name: "Apple",          trend: "up",   change: "+1.4%",  data: [140,142,141,143,145,144,146,148] },
  { ticker: "TSLA",  name: "Tesla",           trend: "down", change: "-2.1%",  data: [190,188,192,185,183,187,184,182] },
  { ticker: "NVDA",  name: "NVIDIA",          trend: "up",   change: "+3.8%",  data: [410,415,418,422,419,425,430,436] },
  { ticker: "MSFT",  name: "Microsoft",       trend: "up",   change: "+0.8%",  data: [370,371,372,370,373,374,375,376] },
  { ticker: "RELIANCE", name: "Reliance Ind.", trend: "up",  change: "+0.5%",  data: [2400,2410,2405,2415,2420,2418,2425,2430] },
];

function Sparkline({ data, trend }: { data: number[]; trend: "up" | "down" | "flat" }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 52, h = 22;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const color = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#71717a";

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WatchlistWidget({ onAnalyze }: { onAnalyze?: (company: string) => void }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>
          Watchlist
        </p>
        <span className="badge badge-neutral" style={{ fontSize: 10 }}>
          {WATCHLIST.length} stocks
        </span>
      </div>

      {/* List */}
      <div>
        {WATCHLIST.map((stock, i) => (
          <div
            key={stock.ticker}
            onClick={() => onAnalyze?.(stock.name)}
            style={{
              display: "flex", alignItems: "center",
              padding: "9px 16px",
              borderBottom: i < WATCHLIST.length - 1 ? "1px solid var(--border)" : "none",
              gap: 10,
              transition: "background 0.1s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Ticker badge */}
            <div
              style={{
                width: 30, height: 30, borderRadius: 7,
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "var(--text-3)",
                flexShrink: 0, fontFamily: "var(--font-mono)",
              }}
            >
              {stock.ticker.slice(0, 3)}
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-1)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {stock.name}
              </p>
              <p style={{ fontSize: 10.5, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
                {stock.ticker}
              </p>
            </div>

            {/* Sparkline */}
            <Sparkline data={stock.data} trend={stock.trend as "up" | "down"} />

            {/* Change */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              {stock.trend === "up"
                ? <TrendingUp size={11} color="var(--invest)" />
                : stock.trend === "down"
                ? <TrendingDown size={11} color="var(--pass)" />
                : <Minus size={11} color="var(--text-4)" />
              }
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: stock.trend === "up" ? "var(--invest)" : stock.trend === "down" ? "var(--pass)" : "var(--text-4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {stock.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
