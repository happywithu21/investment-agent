"use client";

import { Shield, AlertTriangle } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import type { RiskAssessment, RiskLevel } from "@/types/agents";

interface RiskRadarProps { risk: RiskAssessment }

const RISK_COLOR: Record<RiskLevel, string> = {
  low:      "var(--invest)",
  medium:   "var(--warn)",
  high:     "var(--pass)",
  critical: "#dc2626",
};

const RISK_SCORE: Record<RiskLevel, number> = {
  low: 20, medium: 50, high: 75, critical: 95,
};

function RiskPill({ level }: { level: RiskLevel }) {
  const c = RISK_COLOR[level];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "1px 7px", borderRadius: 4,
        fontSize: 10.5, fontWeight: 600,
        color: c,
        background: `${c}15`,
        border: `1px solid ${c}30`,
        letterSpacing: "0.02em",
        textTransform: "capitalize",
      }}
    >
      {level}
    </span>
  );
}

export function RiskRadar({ risk }: RiskRadarProps) {
  const overallColor = RISK_COLOR[risk.overallRisk];

  const radarData = [
    { subject: "Financial",   value: RISK_SCORE[risk.financialRisk],   fullMark: 100 },
    { subject: "Regulatory",  value: RISK_SCORE[risk.regulatoryRisk],  fullMark: 100 },
    { subject: "Competitive", value: RISK_SCORE[risk.competitiveRisk], fullMark: 100 },
    { subject: "Macro",       value: RISK_SCORE[risk.macroRisk],       fullMark: 100 },
    { subject: "Overall",     value: risk.riskScore,                   fullMark: 100 },
  ];

  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - risk.riskScore / 100);

  return (
    <div className="card animate-fade-up delay-3" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Shield size={14} color="var(--accent)" />
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", flex: 1 }}>
          Risk Assessment
        </p>
        <RiskPill level={risk.overallRisk} />
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16 }}>
          {/* Score ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={80} height={80} viewBox="0 0 80 80">
              <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
              <circle
                cx={40} cy={40} r={r} fill="none"
                stroke={overallColor} strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: overallColor, fontFamily: "var(--font-display)", lineHeight: 1 }}>
                {risk.riskScore}
              </span>
              <span style={{ fontSize: 8.5, color: "var(--text-4)", letterSpacing: "0.04em" }}>RISK</span>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { label: "Financial",   level: risk.financialRisk },
              { label: "Regulatory",  level: risk.regulatoryRisk },
              { label: "Competitive", level: risk.competitiveRisk },
              { label: "Macro",       level: risk.macroRisk },
            ].map(({ label, level }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: RISK_COLOR[level], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--text-4)", flex: 1 }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: RISK_COLOR[level], fontFamily: "var(--font-mono)" }}>
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <ResponsiveContainer width="100%" height={160}>
          <RadarChart data={radarData} margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-4)", fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Risk" dataKey="value"
              stroke={overallColor} fill={overallColor} fillOpacity={0.1}
              strokeWidth={1.5}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-active)", border: "1px solid var(--border-hover)",
                borderRadius: 6, color: "var(--text-1)", fontSize: 12,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Red flags */}
        {risk.redFlags.length > 0 && (
          <div
            style={{
              marginTop: 12, padding: "10px 12px",
              background: "var(--pass-dim)", border: "1px solid var(--pass-border)",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <AlertTriangle size={12} color="var(--pass)" />
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pass)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Red Flags
              </p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {risk.redFlags.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: 7, fontSize: 12.5, color: "var(--text-2)" }}>
                  <span style={{ color: "var(--pass)", flexShrink: 0, fontWeight: 700 }}>✗</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mitigants */}
        {risk.mitigants.length > 0 && (
          <div
            style={{
              marginTop: 8, padding: "10px 12px",
              background: "var(--invest-dim)", border: "1px solid var(--invest-border)",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Shield size={12} color="var(--invest)" />
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--invest)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Mitigants
              </p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {risk.mitigants.map((m, i) => (
                <li key={i} style={{ display: "flex", gap: 7, fontSize: 12.5, color: "var(--text-2)" }}>
                  <span style={{ color: "var(--invest)", flexShrink: 0, fontWeight: 700 }}>✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
