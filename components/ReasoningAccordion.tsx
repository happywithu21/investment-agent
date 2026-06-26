"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle, FileText } from "lucide-react";
import type { CommitteeReport } from "@/types/agents";

interface ReasoningAccordionProps { report: CommitteeReport }

type SectionId = "positive" | "negative" | "reasoning";

export function ReasoningAccordion({ report }: ReasoningAccordionProps) {
  const [open, setOpen] = useState<SectionId>("positive");

  const toggle = (s: SectionId) => setOpen((prev) => (prev === s ? ("" as SectionId) : s));

  const sections = [
    {
      id: "positive" as SectionId,
      label: "Positive Factors",
      count: report.positiveFactors.length,
      icon: <CheckCircle2 size={13} color="var(--invest)" />,
      accentColor: "var(--invest)",
      items: report.positiveFactors,
      bullet: "✓",
    },
    {
      id: "negative" as SectionId,
      label: "Risk Factors",
      count: report.negativeFactors.length,
      icon: <XCircle size={13} color="var(--pass)" />,
      accentColor: "var(--pass)",
      items: report.negativeFactors,
      bullet: "✗",
    },
    {
      id: "reasoning" as SectionId,
      label: "Full Reasoning",
      count: null,
      icon: <FileText size={13} color="var(--accent)" />,
      accentColor: "var(--accent)",
      items: [],
      bullet: "",
    },
  ];

  return (
    <div className="card animate-fade-up delay-1" style={{ overflow: "hidden" }}>
      {/* Summary bar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={12} color="var(--invest)" />
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>
            {report.positiveFactors.length} positive
          </span>
          <XCircle size={12} color="var(--pass)" />
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>
            {report.negativeFactors.length} concerns
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 1 }}>Confidence</p>
          <p
            style={{
              fontSize: 18, fontWeight: 800,
              color: report.decision === "INVEST" ? "var(--invest)" : "var(--pass)",
              fontFamily: "var(--font-mono)", lineHeight: 1,
            }}
          >
            {report.confidence}%
          </p>
        </div>
      </div>

      {/* Accordion items */}
      {sections.map((sec) => (
        <div key={sec.id} style={{ borderBottom: "1px solid var(--border)" }}>
          {/* Toggle header */}
          <button
            id={`accordion-${sec.id}`}
            onClick={() => toggle(sec.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "11px 16px",
              background: "transparent", border: "none", cursor: "pointer",
              textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            {sec.icon}
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--text-1)" }}>
              {sec.label}
            </span>
            {sec.count !== null && (
              <span
                style={{
                  fontSize: 10.5, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                  background: "var(--surface-hover)", color: "var(--text-4)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {sec.count}
              </span>
            )}
            <ChevronDown
              size={14}
              color="var(--text-4)"
              style={{
                transform: open === sec.id ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {/* Content */}
          {open === sec.id && (
            <div
              style={{
                padding: "4px 16px 14px",
                animation: "fade-up 0.15s ease both",
              }}
            >
              {sec.id === "reasoning" ? (
                <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65 }}>
                  {report.reasoning}
                </p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {sec.items.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.45 }}>
                      <span style={{ color: sec.accentColor, fontWeight: 700, flexShrink: 0 }}>{sec.bullet}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Timestamp */}
      <div style={{ padding: "8px 16px" }}>
        <p style={{ fontSize: 11, color: "var(--text-4)" }}>
          Generated {new Date(report.generatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
