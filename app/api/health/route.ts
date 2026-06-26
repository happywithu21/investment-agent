/**
 * GET /api/health
 *
 * Returns service status for monitoring and the frontend status indicator.
 */

import { NextResponse } from "next/server";
import { isGeminiConfigured, isNewsApiConfigured } from "@/services/gemini";
import type { HealthResponse } from "@/types/api";

export const runtime = "nodejs";

export async function GET() {
  const geminiOk = isGeminiConfigured();
  const newsOk = isNewsApiConfigured();

  // Quick Gemini connectivity check
  let geminiStatus: HealthResponse["services"]["gemini"] = "missing_key";
  if (geminiOk) {
    try {
      const { getFlashModel } = await import("@/services/gemini");
      const model = getFlashModel();
      await model.invoke("ping");
      geminiStatus = "connected";
    } catch {
      geminiStatus = "error";
    }
  }

  const health: HealthResponse = {
    status:
      geminiStatus === "connected" ? "ok" : "degraded",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    services: {
      gemini: geminiStatus,
      newsApi: newsOk ? "connected" : "missing_key",
      yahooFinance: "available",
    },
  };

  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 503,
  });
}
