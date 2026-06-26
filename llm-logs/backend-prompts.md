# LLM Logs — Backend & API Routes

This log documents prompts and architecture decisions related to the multi-agent LangGraph workflow execution and data service connectors.

---

## 1. Yahoo Finance Service Wrapper

### Prompt
> You are a Technical Architect. Write a robust backend wrapper `finance.ts` inside `services/` that exposes clean methods for getting stock quotes, 90-day historical prices, and corporate fundamentals (revenue, margin, debt) using the `yahoo-finance2` library. Since Vercel edge/serverless runtimes can experience network throttles or environment restrictions, include solid input sanitization, retry helpers with exponential backoff, and a graceful fallback to a realistic mock data generator if ticker resolution fails or returns empty data.

### Purpose
To handle data fetching for stock fundamentals without crashing during market closures or API timeouts.

### Summary
Built `services/finance.ts` using strict TypeScript interfaces, validation safeguards, and auto-calculating fallbacks.

---

## 2. Server-Sent Events (SSE) Stream Controller

### Prompt
> Write a Next.js App Router API route `app/api/analyze/route.ts` that handles client requests for stock analysis. We need to stream agent progress updates in real time using Server-Sent Events (SSE). The endpoint should capture start and completion events from each node in the LangGraph StateGraph, translate them to SSE lines (`data: {"type": "step_start", "node": "researchAgent"}\n\n`), and finally output the synthesized committee report. Ensure proper CORS headers, connection timeouts set to 60s, and connection close listeners to clean up running graph resources.

### Purpose
To bridge the asynchronous multi-agent graph execution with a real-time reactive frontend UI.

### Summary
Created a robust streaming controller utilizing `ReadableStream` and chunk encoding to feed the browser's reader directly.
