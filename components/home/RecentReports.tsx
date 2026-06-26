"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock recent reports – in production this would come from localStorage or an API
const RECENT = [
  {
    company: "Apple Inc.",
    ticker: "AAPL",
    verdict: "INVEST" as const,
    confidence: 82,
    date: "2 hours ago",
    status: "complete" as const,
  },
  {
    company: "Tesla, Inc.",
    ticker: "TSLA",
    verdict: "PASS" as const,
    confidence: 67,
    date: "Yesterday",
    status: "complete" as const,
  },
  {
    company: "NVIDIA Corp.",
    ticker: "NVDA",
    verdict: "INVEST" as const,
    confidence: 91,
    date: "2 days ago",
    status: "complete" as const,
  },
];

export function RecentReports({ onAnalyze }: { onAnalyze?: (company: string) => void }) {
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
          Recent Reports
        </p>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--text-4)", fontSize: 12 }}>
          View all
        </button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Verdict</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {RECENT.map((row) => (
            <tr
              key={row.ticker}
              onClick={() => onAnalyze?.(row.company)}
            >
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: "var(--surface-hover)",
                      border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10.5, fontWeight: 700, color: "var(--text-2)",
                      flexShrink: 0,
                    }}
                  >
                    {row.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", lineHeight: 1.2 }}>
                      {row.company}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
                      {row.ticker}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <span className={cn("badge", row.verdict === "INVEST" ? "badge-invest" : "badge-pass")}>
                  {row.verdict}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Mini progress bar */}
                  <div style={{ width: 48, height: 3, background: "var(--surface-hover)", borderRadius: 99, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${row.confidence}%`,
                        height: "100%",
                        background: row.verdict === "INVEST" ? "var(--invest)" : "var(--pass)",
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--text-2)", fontWeight: 500 }}>
                    {row.confidence}%
                  </span>
                </div>
              </td>
              <td style={{ fontSize: 12.5, color: "var(--text-3)" }}>{row.date}</td>
              <td>
                <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                  ✓ Complete
                </span>
              </td>
              <td>
                <ChevronRight size={14} color="var(--text-4)" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state hint */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 11.5, color: "var(--text-4)" }}>
          <ExternalLink size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
          Sample data — run an analysis to generate a real report
        </p>
      </div>
    </div>
  );
}
