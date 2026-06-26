"use client";

import { Building2, Globe, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatMarketCap } from "@/lib/utils";
import type { CommitteeReport, CompanyProfile } from "@/types/agents";

interface InvestmentVerdictProps {
  report: CommitteeReport;
  profile: CompanyProfile;
}

export function InvestmentVerdict({ report, profile }: InvestmentVerdictProps) {
  const isInvest = report.decision === "INVEST";
  const c = report.confidence;

  // SVG circle ring
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - c / 100);

  const color = isInvest ? "var(--invest)" : "var(--pass)";
  const dimColor = isInvest ? "var(--invest-dim)" : "var(--pass-dim)";
  const borderColor = isInvest ? "var(--invest-border)" : "var(--pass-border)";

  return (
    <div className="card animate-fade-up" style={{ overflow: "hidden" }}>
      {/* Top color bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div style={{ padding: "20px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
          {/* Confidence ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={96} height={96} viewBox="0 0 96 96">
              {/* Track */}
              <circle
                cx={48} cy={48} r={r}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={6}
              />
              {/* Progress */}
              <circle
                cx={48} cy={48} r={r}
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 48 48)"
                className="verdict-ring"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </svg>
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 20, fontWeight: 800,
                  color,
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                }}
              >
                {c}
              </span>
              <span style={{ fontSize: 9, color: "var(--text-4)", letterSpacing: "0.04em" }}>
                CONF
              </span>
            </div>
          </div>

          {/* Company info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Ticker badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span
                style={{
                  padding: "1px 7px",
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                {profile.ticker}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>{profile.exchange}</span>
            </div>

            <h2
              style={{
                fontSize: 17, fontWeight: 700,
                color: "var(--text-1)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                marginBottom: 3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {profile.name}
            </h2>
            <p style={{ fontSize: 12.5, color: "var(--text-4)" }}>
              {profile.sector} · {profile.industry}
            </p>

            {/* Verdict badge */}
            <div style={{ marginTop: 10 }}>
              <span
                id="investment-verdict-badge"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 14px",
                  background: dimColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  fontSize: 13, fontWeight: 800,
                  color,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.06em",
                }}
              >
                {isInvest ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {report.decision}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8, marginBottom: 16,
          }}
        >
          {[
            { icon: <Globe size={12} />,     label: "Country",    value: profile.country },
            { icon: <Building2 size={12} />, label: "Sector",     value: profile.sector },
            { icon: <Users size={12} />,     label: "Employees",  value: profile.employees?.toLocaleString() ?? "N/A" },
            { icon: <DollarSign size={12} />,label: "Market Cap", value: profile.marketCap ? formatMarketCap(profile.marketCap) : "N/A" },
          ].map((s) => (
            <div
              key={s.label}
              className="metric-card"
              style={{ padding: "10px 12px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, color: "var(--text-4)" }}>
                {s.icon}
                <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "0.02em" }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reasoning */}
        <div
          style={{
            padding: "12px 14px",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-4)", marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Committee Reasoning
          </p>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
            {report.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
