/**
 * POST /api/analyze
 *
 * Runs the investment research LangGraph workflow and streams
 * Server-Sent Events (SSE) back to the client.
 *
 * Event flow:
 *   step_start  → node is beginning work
 *   step_complete → node finished
 *   report      → final InvestmentReport payload
 *   error       → unrecoverable failure
 *   ping        → keepalive (every 15 s — handled by client timeout)
 */

import { NextRequest } from "next/server";
import { runInvestmentWorkflow } from "@/agents/graph";
import { isGeminiConfigured } from "@/services/gemini";
import type { InvestmentReport, StreamEvent, AnalyzeRequest } from "@/types/api";

// Force Node.js runtime (required for yahoo-finance2)
export const runtime = "nodejs";
export const maxDuration = 60;

// ────────────────────────────────────────────────────────────
// SSE Helpers
// ────────────────────────────────────────────────────────────

function encodeEvent<T>(event: StreamEvent<T>): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function makeEvent<T>(
  type: StreamEvent["type"],
  partial: Omit<StreamEvent<T>, "type" | "timestamp">
): StreamEvent<T> {
  return { type, ...partial, timestamp: new Date().toISOString() };
}

// ────────────────────────────────────────────────────────────
// Route Handler
// ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Validate request body
  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { company } = body;
  if (!company || typeof company !== "string" || company.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "company field is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Guard: API key check
  if (!isGeminiConfigured()) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_API_KEY is not configured on the server." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const workflowStart = Date.now();

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = <T>(event: StreamEvent<T>) => {
        controller.enqueue(encoder.encode(encodeEvent(event)));
      };

      try {
        // Run the LangGraph workflow, forwarding step events as SSE
        const graphState = await runInvestmentWorkflow(
          company.trim(),
          (type, node, message) => {
            send(makeEvent(type, { node, message }));
          }
        );

        // Check that we have the minimum required data
        if (!graphState.committeeReport) {
          throw new Error("Committee agent did not produce a report.");
        }

        // Collect warnings
        const warnings: string[] = [];
        if (graphState.newsAnalysis?.status === "unavailable") {
          warnings.push(
            graphState.newsAnalysis.warning ??
              "News data unavailable, recommendation based on available information."
          );
        }
        if (graphState.financialData?.dataSource === "error") {
          warnings.push("Financial data could not be fully retrieved.");
        }

        // Assemble the final report
        const report: InvestmentReport = {
          companyName: graphState.companyProfile?.name ?? company.trim(),
          ticker: graphState.ticker ?? "N/A",
          profile: graphState.companyProfile!,
          financials: graphState.financialData!,
          news: graphState.newsAnalysis!,
          risk: graphState.riskAssessment!,
          committee: graphState.committeeReport,
          processingTimeMs: Date.now() - workflowStart,
          hasWarnings: warnings.length > 0,
          warnings,
        };

        send(makeEvent("report", { data: report, message: "Analysis complete" }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        send(
          makeEvent("error", {
            message: `Analysis failed: ${message}`,
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable Nginx buffering for SSE
    },
  });
}
