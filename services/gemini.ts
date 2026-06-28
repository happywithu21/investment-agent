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
    model: "gemini-1.5-flash",
    apiKey: assertApiKey(),
    temperature: 0.1,
    maxOutputTokens: 8192,
    streaming: false,
  });
}

/**
 * Gemini 1.5 Flash with reasoning — for the Investment Committee
 * synthesis step that requires deeper multi-step reasoning.
 */
export function getThinkingModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: assertApiKey(),
    temperature: 0.2,
    maxOutputTokens: 8192,
    streaming: false,
  });
}

/**
 * Retry a function up to `maxAttempts` times with exponential backoff.
 * Used to wrap all LLM calls for production resilience.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 2,
  baseDelayMs = 500
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
  const key = process.env.GOOGLE_API_KEY;
  return Boolean(key && key.trim().length > 5);
}

/** Check if NewsAPI key is configured */
export function isNewsApiConfigured(): boolean {
  return Boolean(process.env.NEWS_API_KEY && process.env.NEWS_API_KEY.length > 10);
}
