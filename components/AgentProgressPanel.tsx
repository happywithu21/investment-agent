"use client";

import { Check, Loader2, X, Activity } from "lucide-react";
import type { AgentProgressStep } from "@/types/api";

interface AgentProgressPanelProps {
  steps: AgentProgressStep[];
  isActive: boolean;
}

const ICONS: Record<string, string> = {
  researchAgent: "🔍",
  financialAgent: "📊",
  newsAgent: "📰",
  riskAgent: "⚠️",
  committeeAgent: "🏛️",
};

export function AgentProgressPanel({ steps, isActive }: AgentProgressPanelProps) {
  if (!isActive && steps.every((s) => s.status === "pending")) return null;

  const done = steps.filter((s) => s.status === "complete").length;
  const total = steps.length;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Activity size={13} color="var(--accent)" />
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-1)", flex: 1 }}>
          Live Agent Pipeline
        </p>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-4)" }}>
          {done}/{total}
        </span>
        {/* Progress bar */}
        <div
          style={{
            width: 64, height: 2,
            background: "var(--surface-hover)",
            borderRadius: 99, overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(done / total) * 100}%`,
              height: "100%",
              background: "var(--accent)",
              borderRadius: 99,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
        {steps.map((step, i) => {
          const isRunning  = step.status === "running";
          const isComplete = step.status === "complete";
          const isError    = step.status === "error";
          const isPending  = step.status === "pending";

          return (
            <div key={step.id}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 8px",
                  borderRadius: 7,
                  background: isRunning ? "rgba(59,130,246,0.05)" : "transparent",
                  border: `1px solid ${isRunning ? "rgba(59,130,246,0.12)" : "transparent"}`,
                  transition: "all 0.2s",
                  opacity: isPending ? 0.45 : 1,
                }}
              >
                {/* Status icon */}
                <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isComplete && (
                    <div
                      style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: "var(--invest-dim)",
                        border: "1px solid var(--invest-border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Check size={9} color="var(--invest)" strokeWidth={2.5} />
                    </div>
                  )}
                  {isRunning && <Loader2 size={15} color="var(--accent)" style={{ animation: "spin-slow 0.7s linear infinite" }} />}
                  {isError   && <X size={14} color="var(--pass)" />}
                  {isPending && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-4)" }} />
                  )}
                </div>

                {/* Emoji */}
                <span style={{ fontSize: 13 }}>{ICONS[step.node] ?? "🤖"}</span>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12.5, fontWeight: 500,
                      color: isComplete ? "var(--text-2)" : isRunning ? "var(--text-1)" : "var(--text-4)",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </p>
                  {isRunning && (
                    <p style={{ fontSize: 11, color: "var(--accent)", marginTop: 1 }}>
                      Processing…
                    </p>
                  )}
                </div>

                {/* Duration */}
                {isComplete && step.completedAt && step.startedAt && (
                  <span
                    style={{
                      fontSize: 10.5, color: "var(--text-4)",
                      fontFamily: "var(--font-mono)", flexShrink: 0,
                    }}
                  >
                    {((step.completedAt - step.startedAt) / 1000).toFixed(1)}s
                  </span>
                )}
              </div>

              {/* Connector dot-line */}
              {i < steps.length - 1 && (
                <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 19 }}>
                  <div
                    style={{
                      width: 1, height: 8,
                      background: isComplete ? "rgba(34,197,94,0.3)" : "var(--border)",
                      marginLeft: 9,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
