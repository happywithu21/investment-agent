"use client";

import { Zap, ArrowRight } from "lucide-react";

export function PromoCard() {
  return (
    <div
      style={{
        borderRadius: 14,
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.10) 50%, rgba(34,197,94,0.06) 100%)",
        border: "1px solid rgba(59,130,246,0.18)",
        padding: "18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background abstract shape */}
      <div
        style={{
          position: "absolute",
          right: -20, top: -20,
          width: 120, height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 20, bottom: -30,
          width: 80, height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.10), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Zap size={15} color="var(--accent)" />
      </div>

      {/* Content */}
      <p
        style={{
          fontSize: 14, fontWeight: 700,
          color: "var(--text-1)",
          fontFamily: "var(--font-display)",
          lineHeight: 1.3, marginBottom: 6,
          letterSpacing: "-0.01em",
        }}
      >
        Make Smarter Investment Decisions
      </p>
      <p style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 14 }}>
        AI agents analyze thousands of financial signals so you don't have to.
      </p>

      <button
        className="btn btn-primary btn-sm"
        style={{ gap: 5 }}
      >
        Upgrade to Pro <ArrowRight size={12} />
      </button>
    </div>
  );
}
