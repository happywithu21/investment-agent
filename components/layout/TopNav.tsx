"use client";

import { Bell, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useShell } from "./AppShell";

export function TopNav() {
  const { sidebarOpen, toggleSidebar } = useShell();
  const [dark, setDark] = useState(true);

  return (
    <header className="topnav">
      {/* Mobile hamburger */}
      <button
        className="btn btn-ghost btn-sm lg:hidden"
        style={{ padding: "5px 6px" }}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Workspace name */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
          Workspace
        </span>
        <span style={{ color: "var(--text-4)", fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13.5, color: "var(--text-3)" }}>Dashboard</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Powered by badge */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "3px 10px",
          background: "var(--accent-dim)",
          border: "1px solid var(--accent-border)",
          borderRadius: 99,
          cursor: "default",
        }}
        className="hidden sm:flex"
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} className="animate-pulse-dot" />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.01em" }}>
          Gemini 2.5 · LangGraph
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Notifications */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: "5px 6px", position: "relative" }}
          data-tooltip="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span
            style={{
              position: "absolute", top: 5, right: 5,
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--pass)", border: "1.5px solid var(--bg)",
            }}
          />
        </button>

        {/* Dark mode toggle */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: "5px 6px" }}
          onClick={() => setDark((v) => !v)}
          data-tooltip={dark ? "Light mode" : "Dark mode"}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11.5, fontWeight: 700, color: "#fff",
            cursor: "pointer",
            border: "1.5px solid var(--border-hover)",
            marginLeft: 2,
          }}
          data-tooltip="Account"
        >
          U
        </div>
      </div>
    </header>
  );
}
