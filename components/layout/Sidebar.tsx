"use client";

import {
  LayoutDashboard, Clock, FileText, Star,
  Bell, Settings, ChevronUp, Zap, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShell } from "./AppShell";

interface NavGroup {
  label?: string;
  items: {
    icon: React.ReactNode;
    label: string;
    href?: string;
    badge?: string;
    active?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", active: true },
      { icon: <Clock size={15} />,           label: "History" },
      { icon: <FileText size={15} />,         label: "Saved Reports" },
      { icon: <Star size={15} />,             label: "Watchlist", badge: "5" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: <Bell size={15} />,     label: "Alerts", badge: "2" },
      { icon: <Settings size={15} />, label: "Settings" },
    ],
  },
];

export function Sidebar() {
  const { sidebarOpen } = useShell();

  return (
    <aside className={cn("sidebar", sidebarOpen && "open")}>
      {/* Logo */}
      <div
        style={{
          padding: "16px 14px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28, height: 28,
              background: "var(--accent)",
              borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={14} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2, fontFamily: "var(--font-display)" }}>
              InsideIIM
            </p>
            <p style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.2 }}>
              Research Agent
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            {group.label && (
              <p className="section-label" style={{ padding: "4px 10px 6px" }}>
                {group.label}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {group.items.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={cn("nav-item", item.active && "active")}
                  onClick={(e) => e.preventDefault()}
                >
                  <span style={{ color: item.active ? "var(--text-1)" : "var(--text-4)" }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "1px 5px",
                        borderRadius: 99,
                        background: item.label === "Alerts"
                          ? "var(--pass-dim)"
                          : "var(--surface-active)",
                        color: item.label === "Alerts"
                          ? "var(--pass)"
                          : "var(--text-3)",
                        border: "1px solid",
                        borderColor: item.label === "Alerts"
                          ? "var(--pass-border)"
                          : "var(--border)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom — user + upgrade */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "10px 8px",
        }}
      >
        {/* Upgrade card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))",
            border: "1px solid var(--accent-border)",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Zap size={12} color="var(--accent)" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-1)" }}>
              Free Plan
            </span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 8, lineHeight: 1.4 }}>
            5 analyses / month remaining
          </p>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "5px 0" }}>
            Upgrade to Pro
          </button>
        </div>

        {/* User */}
        <button
          className="nav-item"
          style={{ width: "100%", marginBottom: 0 }}
        >
          <div
            style={{
              width: 26, height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}
          >
            U
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-1)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              User
            </p>
            <p style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.2 }}>Free plan</p>
          </div>
          <ChevronUp size={13} color="var(--text-4)" />
        </button>
      </div>
    </aside>
  );
}
