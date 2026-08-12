import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

export function requireLovableApiKey(): string {
  const key = process.env["GEMINI_API_KEY"]
  if (!key) throw new Error("AI is not configured yet. Missing GEMINI_API_KEY.");
  return key;
}

/** Direct Google Gemini provider using the user's own API key (OpenAI-compatible endpoint). */
export function createGeminiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "google-gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

export function getGeminiApiKey(): string | undefined {
  return process.env["GEMINI_API_KEY"] || undefined;
}

/** Strips markdown fences and parses the model's JSON output. */
export function parseModelJson<T = unknown>(raw: string): T {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.search(/[[{]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}