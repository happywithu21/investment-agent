import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely, resolving conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers to human-readable strings
 * e.g. 1_200_000_000_000 → "1.2T"
 */
export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

/**
 * Format a percentage with sign and fixed decimals
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a short random ID (for stream events, not crypto-secure)
 */
export function generateId(prefix = ""): string {
  const id = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Delay for N milliseconds (useful in streaming mocks)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Map a recommendation string to a display color
 */
export function getRecommendationColor(
  rec: string
): { text: string; bg: string; border: string } {
  switch (rec) {
    case "STRONG_BUY":
      return {
        text: "text-emerald-300",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
      };
    case "BUY":
      return {
        text: "text-green-300",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
      };
    case "HOLD":
      return {
        text: "text-amber-300",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
      };
    case "SELL":
      return {
        text: "text-orange-300",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
      };
    case "STRONG_SELL":
      return {
        text: "text-red-300",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
      };
    default:
      return {
        text: "text-slate-300",
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
      };
  }
}

/**
 * Truncate text to N characters with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
