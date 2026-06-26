"use client";

import { useEffect, useState } from "react";
import { Lightbulb, ChevronRight } from "lucide-react";

const FACTS = [
  "Companies with improving operating margins historically outperform their sector by 2–3× over a 5-year period.",
  "Stocks with debt/equity ratios below 0.5 show 40% less volatility in bear markets.",
  "Free cash flow yield is a stronger predictor of future returns than P/E ratio alone.",
  "Companies that consistently grow revenue at 15%+ tend to compound equity value faster than GDP.",
  "Insider buying activity correlated with above-average 12-month stock returns in 70% of historical cases.",
  "Businesses with >30% net margins show significantly more resilience during economic downturns.",
];

export function InsightsCard() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % FACTS.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ padding: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div
          style={{
            width: 24, height: 24, borderRadius: 6,
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Lightbulb size={12} color="var(--warn)" />
        </div>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-1)" }}>
          Did you know?
        </p>
        {/* Dot progress */}
        <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
          {FACTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 14 : 5,
                height: 5, borderRadius: 99,
                background: i === idx ? "var(--warn)" : "var(--surface-hover)",
                border: "none", cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Fact */}
      <p
        style={{
          fontSize: 12.5,
          color: "var(--text-2)",
          lineHeight: 1.55,
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(4px)" : "translateY(0)",
          transition: "opacity 0.25s, transform 0.25s",
        }}
      >
        {FACTS[idx]}
      </p>

      {/* Footer */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginTop: 10, paddingLeft: 0, color: "var(--text-4)", fontSize: 11.5 }}
      >
        More insights <ChevronRight size={11} />
      </button>
    </div>
  );
}
