"use client";

import { Search, BarChart2, Newspaper, Shield, Users2 } from "lucide-react";

const STEPS = [
  { icon: <Search size={14} />,    label: "Research",   color: "#3b82f6", desc: "Ticker + profile" },
  { icon: <BarChart2 size={14} />, label: "Financial",  color: "#8b5cf6", desc: "Ratios & metrics"  },
  { icon: <Newspaper size={14} />, label: "News",       color: "#06b6d4", desc: "Sentiment scoring" },
  { icon: <Shield size={14} />,    label: "Risk",       color: "#f59e0b", desc: "Risk assessment"   },
  { icon: <Users2 size={14} />,    label: "Committee",  color: "#22c55e", desc: "Final verdict"     },
];

export function HowItWorks() {
  return (
    <div className="card" style={{ padding: "20px" }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>
        How it works
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {STEPS.map((step, i) => (
          <div key={step.label}>
            {/* Step row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 0",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: step.color,
                }}
              >
                {step.icon}
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", lineHeight: 1.2 }}>
                  {step.label}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--text-4)" }}>{step.desc}</p>
              </div>

              {/* Step number */}
              <span
                style={{
                  fontSize: 10.5, fontWeight: 700, color: "var(--text-4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{ paddingLeft: 13 }}>
                <div
                  style={{
                    width: 1, height: 14,
                    background: `linear-gradient(to bottom, ${step.color}40, ${STEPS[i + 1].color}20)`,
                    marginLeft: 1,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
