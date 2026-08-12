const GATEWAY_V2 = "https://connector-gateway.lovable.dev/firecrawl/v2";

export type WebFinding = {
  query: string;
  title: string;
  url: string;
  snippet: string;
};

function headers() {
  const lovableKey = process.env["GEMINI_API_KEY"];
  const firecrawlKey = process.env["FIRECRAWL_API_KEY"];
  if (!lovableKey || !firecrawlKey) {
    throw new Error("Web research is not configured yet (missing Firecrawl connection).");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": firecrawlKey,
  };
}

/** Runs one Firecrawl web search and returns compact results for prompt grounding. */
export async function firecrawlSearch(query: string, limit = 5): Promise<WebFinding[]> {
  const response = await fetch(`${GATEWAY_V2}/search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, limit, tbs: "qdr:y" }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Firecrawl search failed [${response.status}]: ${errorBody}`);
    if (response.status === 429 || response.status === 402) {
      throw new Error(`Web research is temporarily unavailable [${response.status}].`);
    }
    return [];
  }

  const payload = (await response.json()) as {
    data?: { web?: unknown[] } | unknown[];
  };
  const raw = Array.isArray(payload.data)
    ? payload.data
    : ((payload.data as { web?: unknown[] } | undefined)?.web ?? []);

  return (raw as Array<Record<string, unknown>>).slice(0, limit).map((item) => ({
    query,
    title: String(item["title"] ?? ""),
    url: String(item["url"] ?? ""),
    snippet: String(item["description"] ?? item["markdown"] ?? "").slice(0, 1500),
  }));
}

/** Runs several searches in parallel; individual failures are ignored. */
export async function firecrawlSearchMany(queries: string[], limit = 4): Promise<WebFinding[]> {
  const settled = await Promise.allSettled(queries.map((q) => firecrawlSearch(q, limit)));
  const all = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return dedupeByUrl(all);
}

function dedupeByUrl(findings: WebFinding[]): WebFinding[] {
  const seen = new Set<string>();
  const out: WebFinding[] = [];
  for (const f of findings) {
    const key = f.url.replace(/[#?].*$/, "").replace(/\/$/, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

/** Ranks findings so authoritative/first-hand sources come first in the prompt. */
const PRIORITY_HOSTS = [
  "reddit.com",
  "quora.com",
  "careers360.com",
  "shiksha.com",
  "collegedukhoj",
  "collegedunia.com",
  "nirfindia.org",
  ".ac.in",
  ".edu.in",
  ".gov.in",
  ".nic.in",
];

export function rankFindings(findings: WebFinding[]): WebFinding[] {
  const score = (f: WebFinding) => {
    const i = PRIORITY_HOSTS.findIndex((h) => f.url.includes(h));
    return i === -1 ? PRIORITY_HOSTS.length : i;
  };
  return [...findings].sort((a, b) => score(a) - score(b));
}

/** Fetches full page markdown for a few high-value URLs so numbers aren't guessed from snippets. */
export async function firecrawlScrapeMany(urls: string[], maxChars = 6000): Promise<WebFinding[]> {
  const settled = await Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetch(`${GATEWAY_V2}/scrape`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
      });
      if (!response.ok) {
        console.error(`Firecrawl scrape failed [${response.status}] for ${url}`);
        return null;
      }
      const payload = (await response.json()) as {
        markdown?: string;
        data?: { markdown?: string; metadata?: { title?: string } };
        metadata?: { title?: string };
      };
      const markdown = payload.markdown ?? payload.data?.markdown ?? "";
      if (!markdown) return null;
      return {
        query: "full page content",
        title: payload.metadata?.title ?? payload.data?.metadata?.title ?? url,
        url,
        snippet: markdown.slice(0, maxChars),
      } satisfies WebFinding;
    }),
  );
  return settled.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []));
}

export function formatFindings(findings: WebFinding[]): string {
  if (findings.length === 0) {
    return "NO SEARCH RESULTS WERE RETURNED. Say so explicitly and mark research_confidence as low.";
  }
  return rankFindings(findings)
    .map(
      (f, i) =>
        `[${i + 1}] search: "${f.query}"\ntitle: ${f.title}\nurl: ${f.url}\nexcerpt: ${f.snippet}`,
    )
    .join("\n\n");
}