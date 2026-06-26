"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Search, Mic, Sparkles, Command } from "lucide-react";

interface SearchBarProps {
  onSubmit: (company: string) => void;
  isLoading: boolean;
  compact?: boolean; // smaller variant shown during/after analysis
}

const RECENT_CHIPS = ["Apple", "Tesla", "NVIDIA", "Amazon", "Reliance"];
const POPULAR_CHIPS = ["Microsoft", "HDFC Bank", "Infosys", "Meta", "Alphabet"];

export function SearchBar({ onSubmit, isLoading, compact = false }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = value.trim();
    if (t && !isLoading) onSubmit(t);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit(e as unknown as FormEvent);
  };

  const handleChip = (name: string) => {
    setValue(name);
    inputRef.current?.focus();
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Search box */}
      <form onSubmit={handleSubmit}>
        <div
          className="search-box"
          style={{
            display: "flex",
            alignItems: "center",
            padding: compact ? "6px 8px 6px 14px" : "10px 10px 10px 16px",
            gap: 10,
          }}
        >
          {/* Search icon */}
          <Search
            size={compact ? 15 : 16}
            color={focused ? "var(--accent)" : "var(--text-4)"}
            style={{ flexShrink: 0, transition: "color 0.15s" }}
          />

          {/* Input */}
          <input
            ref={inputRef}
            id="company-search-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search any company — Apple, Reliance, Tesla…"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-1)",
              fontSize: compact ? 13.5 : 14,
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
            }}
          />

          {/* Keyboard shortcut hint */}
          {!compact && !value && (
            <div
              className="hidden sm:flex"
              style={{
                alignItems: "center", gap: 3,
                padding: "2px 7px",
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
                borderRadius: 5,
                color: "var(--text-4)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em",
                flexShrink: 0,
              }}
            >
              <Command size={10} />
              <span>K</span>
            </div>
          )}

          {/* Voice search */}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: "5px", flexShrink: 0, color: "var(--text-4)" }}
            data-tooltip="Voice search"
            aria-label="Voice search"
            tabIndex={-1}
          >
            <Mic size={14} />
          </button>

          {/* Submit */}
          <button
            id="analyze-button"
            type="submit"
            disabled={!value.trim() || isLoading}
            className="btn btn-primary"
            style={{
              flexShrink: 0,
              fontSize: 13.5,
              padding: compact ? "5px 14px" : "7px 18px",
              gap: 6,
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: 12, height: 12,
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin-slow 0.6s linear infinite",
                    flexShrink: 0,
                  }}
                />
                Analyzing
              </>
            ) : (
              <>
                <Sparkles size={13} />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {/* Chips — only in non-compact mode */}
      {!compact && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
          {/* Recent */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 500, flexShrink: 0 }}>
              Recent
            </span>
            {RECENT_CHIPS.map((name) => (
              <button
                key={name}
                onClick={() => handleChip(name)}
                disabled={isLoading}
                style={{
                  padding: "3px 10px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-3)",
                  cursor: "pointer",
                  transition: "all 0.12s",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-hover)";
                  e.currentTarget.style.color = "var(--text-1)";
                  e.currentTarget.style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.color = "var(--text-3)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Popular */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-4)", fontWeight: 500, flexShrink: 0 }}>
              Popular
            </span>
            {POPULAR_CHIPS.map((name) => (
              <button
                key={name}
                onClick={() => handleChip(name)}
                disabled={isLoading}
                style={{
                  padding: "3px 10px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-4)",
                  cursor: "pointer",
                  transition: "all 0.12s",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.color = "var(--text-2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-4)";
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
