import { generateText } from "ai";

import {
  createLovableAiGatewayProvider,
  createGeminiProvider,
  getGeminiApiKey,
  parseModelJson,
  requireLovableApiKey,
} from "./ai-gateway.server";

export const FAST_MODEL = "google/gemini-3.1-flash-lite";
export const MAIN_MODEL = "google/gemini-3.6-flash";

/** Model ids on Google's own API, keyed by the gateway model id. */
const DIRECT_GEMINI_MODEL: Record<string, string> = {
  [FAST_MODEL]: "gemini-flash-lite-latest",
  [MAIN_MODEL]: "gemini-flash-latest",
};

export async function generateJson<T>(params: {
  model: string;
  system: string;
  prompt: string;
  temperature: number;
}): Promise<T> {
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const gemini = createGeminiProvider(geminiKey);
      const direct = await generateText({
        model: gemini(DIRECT_GEMINI_MODEL[params.model] ?? "gemini-flash-latest"),
        system: params.system,
        prompt: params.prompt,
        temperature: params.temperature,
      });
      return parseModelJson<T>(direct.text);
    } catch (error) {
      console.error("Direct Gemini call failed, falling back to Lovable AI:", error);
    }
  }

  const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
  const result = await generateText({
    model: gateway(params.model),
    system: params.system,
    prompt: params.prompt,
    temperature: params.temperature,
  });
  return parseModelJson<T>(result.text);
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const client = supabaseAdmin as unknown as {
    from: (t: string) => {
      insert: (r: Record<string, unknown>) => {
        select: (c: string) => {
          single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
        };
      };
    };
  };
  const { data, error } = await client
    .from(table)
    .insert(row)
    .select("id")
    .single();
  if (error) {
    console.error(`Failed to insert into ${table}:`, error.message);
    return null;
  }
  return data?.id ?? null;
}