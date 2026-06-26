import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// ============================================================
// Gemini Model Factory — gemini-2.5-flash
// ============================================================

function assertApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_API_KEY is not set. Please add it to your .env.local file."
    );
  }
  return key;
}

/**
 * Gemini 2.5 Flash — fast, analytical tasks (research, news, risk agents).
 * Low temperature for deterministic structured output.
 */
export function getFlashModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: assertApiKey(),
    temperature: 0.1,
    maxOutputTokens: 8192,
    streaming: false,
  });
}

/**
 * Gemini 2.5 Flash with thinking enabled — for the Investment Committee
 * synthesis step that requires deeper multi-step reasoning.
 */
export function getThinkingModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: assertApiKey(),
    temperature: 0.2,
    maxOutputTokens: 16000,
    streaming: false,
    // Enable thinking budget for deeper reasoning
    // @ts-expect-error — thinkingConfig is valid but not yet typed in the JS SDK
    thinkingConfig: { thinkingBudget: 8000 },
  });
}

/**
 * Retry a function up to `maxAttempts` times with exponential backoff.
 * Used to wrap all LLM calls for production resilience.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/** Check if Gemini API key is configured */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY);
}

/** Check if NewsAPI key is configured */
export function isNewsApiConfigured(): boolean {
  return Boolean(process.env.NEWS_API_KEY);
}
