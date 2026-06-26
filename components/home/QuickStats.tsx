"use client";

import { useEffect, useRef, useState } from "react";

// ─── Animated counter hook ───────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return value;
}

interface StatConfig {
  label: string;
  value: number;
  suffix: string;
  sub: string;
  prefix?: string;
  color: string;
}

const STATS: StatConfig[] = [
  { label: "AI Agents",          value: 5,    suffix: "",   sub: "Working for you",     color: "var(--accent)" },
  { label: "Data Sources",       value: 10,   suffix: "+",  sub: "Real-time insights",  color: "#8b5cf6" },
  { label: "Analysis Accuracy",  value: 95,   suffix: "%",  sub: "Validated results",   color: "var(--invest)" },
  { label: "Avg Response",       value: 24,   suffix: "s",  prefix: "~", sub: "Lightning fast", color: "var(--warn)" },
];

function StatCard({ stat, delay }: { stat: StatConfig; delay: number }) {
  const count = useCountUp(stat.value, 1000, delay);

  return (
    <div
      className="card animate-fade-up"
      style={{
        padding: "16px 18px",
        animationDelay: `${delay}ms`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "var(--text-4)", fontWeight: 500, marginBottom: 4, letterSpacing: "0.01em" }}>
          {stat.label}
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: stat.color,
            lineHeight: 1,
            marginBottom: 3,
          }}
        >
          {stat.prefix ?? ""}{count}{stat.suffix}
        </p>
        <p style={{ fontSize: 11.5, color: "var(--text-4)" }}>{stat.sub}</p>
      </div>

      {/* Mini dot indicator */}
      <div
        style={{
          width: 8, height: 8, borderRadius: "50%",
          background: stat.color,
          marginTop: 4,
          boxShadow: `0 0 8px ${stat.color}`,
          flexShrink: 0,
        }}
        className="animate-pulse-dot"
      />
    </div>
  );
}

export function QuickStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
      }}
      className="quick-stats-grid"
    >
      {STATS.map((s, i) => (
        <StatCard key={s.label} stat={s} delay={i * 60} />
      ))}

      <style>{`
        @media (max-width: 900px) {
          .quick-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .quick-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
