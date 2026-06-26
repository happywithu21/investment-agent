"use client";

/**
 * useAnalysis hook
 *
 * Manages the full lifecycle of an investment analysis request:
 * - Sends POST /api/analyze
 * - Reads SSE stream
 * - Tracks per-agent step states
 * - Delivers the final InvestmentReport
 */

import { useState, useCallback, useRef } from "react";
import type { InvestmentReport, AgentProgressStep, StreamEvent } from "@/types/api";

// ────────────────────────────────────────────────────────────
// State Types
// ────────────────────────────────────────────────────────────

export type AnalysisStatus =
  | "idle"
  | "loading"
  | "streaming"
  | "complete"
  | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  steps: AgentProgressStep[];
  report: InvestmentReport | null;
  error: string | null;
}

// Agent node → display label mapping
const NODE_LABELS: Record<string, string> = {
  researchAgent: "Company Research",
  financialAgent: "Financial Analysis",
  newsAgent: "News Intelligence",
  riskAgent: "Risk Assessment",
  committeeAgent: "Investment Committee",
};

const ORDERED_NODES = [
  "researchAgent",
  "financialAgent",
  "newsAgent",
  "riskAgent",
  "committeeAgent",
];

function buildInitialSteps(): AgentProgressStep[] {
  return ORDERED_NODES.map((node) => ({
    id: node,
    node,
    label: NODE_LABELS[node] ?? node,
    status: "pending",
  }));
}

// ────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    steps: buildInitialSteps(),
    report: null,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({
      status: "idle",
      steps: buildInitialSteps(),
      report: null,
      error: null,
    });
  }, []);

  const analyze = useCallback(async (company: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      status: "loading",
      steps: buildInitialSteps(),
      report: null,
      error: null,
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ?? `Server responded with ${response.status}`
        );
      }

      setState((prev) => ({ ...prev, status: "streaming" }));

      // Read SSE stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? ""; // keep incomplete chunk

        for (const chunk of lines) {
          if (!chunk.startsWith("data: ")) continue;
          const jsonStr = chunk.slice(6).trim();
          if (!jsonStr) continue;

          let event: StreamEvent;
          try {
            event = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          handleEvent(event);
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Analysis failed",
      }));
    }

    function handleEvent(event: StreamEvent) {
      switch (event.type) {
        case "step_start": {
          const node = event.node ?? "";
          setState((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
              s.node === node
                ? { ...s, status: "running", startedAt: Date.now(), message: event.message }
                : s
            ),
          }));
          break;
        }

        case "step_complete": {
          const node = event.node ?? "";
          setState((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
              s.node === node
                ? { ...s, status: "complete", completedAt: Date.now() }
                : s
            ),
          }));
          break;
        }

        case "report": {
          const report = event.data as InvestmentReport;
          setState((prev) => ({
            ...prev,
            status: "complete",
            report,
            // Mark all steps complete in case any were missed
            steps: prev.steps.map((s) =>
              s.status !== "error"
                ? { ...s, status: "complete", completedAt: Date.now() }
                : s
            ),
          }));
          break;
        }

        case "error": {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: event.message ?? "An unknown error occurred",
            steps: prev.steps.map((s) =>
              s.status === "running" ? { ...s, status: "error" } : s
            ),
          }));
          break;
        }
      }
    }
  }, []);

  return { ...state, analyze, reset };
}
