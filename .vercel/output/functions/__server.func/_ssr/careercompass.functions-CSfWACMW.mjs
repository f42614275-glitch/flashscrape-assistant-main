import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-B_bFi4842.mjs";
import { Ct as string, bt as number, ct as _enum, ft as array, pt as boolean, xt as object } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as generateText } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careercompass.functions-CSfWACMW.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var QuestionSchema = object({
	id: number(),
	dimension: string(),
	q: string(),
	opts: array(string()).min(2)
});
var QuestionsSchema = array(QuestionSchema).min(4);
var CareerResultSchema = object({
	personality_summary: string(),
	confidence_note: string(),
	top_careers: array(object({
		title: string(),
		is_primary: boolean().optional().default(false),
		why_fit: string(),
		avg_salary_entry: string(),
		avg_salary_mid_career: string(),
		job_market_outlook: string(),
		top_entrance_exams: array(string()).default([]),
		colleges_near_city: array(object({
			name: string(),
			tier: string().optional().default(""),
			course: string().optional().default(""),
			approx_fees_per_year: string().optional().default("")
		})).default([]),
		first_steps: array(string()).default([])
	})).min(1),
	data_freshness_warning: string()
});
var PhaseSchema = object({
	timeframe: string(),
	actions: array(string()).default([])
});
var CollegeResultSchema = object({
	research_confidence: string(),
	sources_checked: array(string()).default([]),
	gap_analysis: object({
		your_percentage: string(),
		official_cutoff: string(),
		realistic_cutoff_per_students: string(),
		category_note: string().optional().default(""),
		gap_verdict: string(),
		honest_paragraph: string()
	}),
	college_reality_check: object({
		reputation_vs_reality: string(),
		placement_reality: string(),
		campus_life_from_students: string()
	}),
	personalized_roadmap: object({
		months_available: string(),
		phase_1_immediate: PhaseSchema,
		phase_2_near_term: PhaseSchema,
		phase_3_application_prep: PhaseSchema,
		phase_4_final_stretch: PhaseSchema
	}),
	entrance_exam_strategy: object({
		primary_exam: string(),
		score_this_college_needs: string(),
		your_current_readiness: string(),
		prep_recommendation: string()
	}),
	free_certifications: array(object({
		name: string(),
		platform: string(),
		relevance_to_this_college: string(),
		search_term_to_find_it: string().optional().default(""),
		time_commitment: string().optional().default("")
	})).default([]),
	backup_colleges: array(object({
		name: string(),
		why_strong_backup: string(),
		estimated_cutoff_for_you: string().optional().default(""),
		honest_comparison: string().optional().default("")
	})).default([]),
	insider_tips: array(string()).default([]),
	honest_warning: string(),
	data_freshness_note: string()
});
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable-ai-gateway",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: { "Lovable-API-Key": apiKey }
	});
}
function requireLovableApiKey() {
	const key = process.env["GEMINI_API_KEY"];
	if (!key) throw new Error("AI is not configured yet. Missing GEMINI_API_KEY.");
	return key;
}
/** Direct Google Gemini provider using the user's own API key (OpenAI-compatible endpoint). */
function createGeminiProvider(apiKey) {
	return createOpenAICompatible({
		name: "google-gemini",
		baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
		headers: { Authorization: `Bearer ${apiKey}` }
	});
}
function getGeminiApiKey() {
	return process.env["GEMINI_API_KEY"] || void 0;
}
/** Strips markdown fences and parses the model's JSON output. */
function parseModelJson(raw) {
	const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
	const start = cleaned.search(/[[{]/);
	const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
	const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
	return JSON.parse(slice);
}
var FAST_MODEL = "google/gemini-3.1-flash-lite";
var MAIN_MODEL = "google/gemini-3.6-flash";
/** Model ids on Google's own API, keyed by the gateway model id. */
var DIRECT_GEMINI_MODEL = {
	[FAST_MODEL]: "gemini-flash-lite-latest",
	[MAIN_MODEL]: "gemini-flash-latest"
};
async function generateJson(params) {
	const geminiKey = getGeminiApiKey();
	if (geminiKey) try {
		const gemini = createGeminiProvider(geminiKey);
		return parseModelJson((await generateText({
			model: gemini(DIRECT_GEMINI_MODEL[params.model] ?? "gemini-flash-latest"),
			system: params.system,
			prompt: params.prompt,
			temperature: params.temperature
		})).text);
	} catch (error) {
		console.error("Direct Gemini call failed, falling back to Lovable AI:", error);
	}
	const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
	return parseModelJson((await generateText({
		model: gateway(params.model),
		system: params.system,
		prompt: params.prompt,
		temperature: params.temperature
	})).text);
}
async function insertRow(table, row) {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.from(table).insert(row).select("id").single();
	if (error) {
		console.error(`Failed to insert into ${table}:`, error.message);
		return null;
	}
	return data?.id ?? null;
}
var GATEWAY_V2 = "https://connector-gateway.lovable.dev/firecrawl/v2";
function headers() {
	const lovableKey = process.env["GEMINI_API_KEY"];
	const firecrawlKey = process.env["FIRECRAWL_API_KEY"];
	if (!lovableKey || !firecrawlKey) throw new Error("Web research is not configured yet (missing Firecrawl connection).");
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${lovableKey}`,
		"X-Connection-Api-Key": firecrawlKey
	};
}
/** Runs one Firecrawl web search and returns compact results for prompt grounding. */
async function firecrawlSearch(query, limit = 5) {
	const response = await fetch(`${GATEWAY_V2}/search`, {
		method: "POST",
		headers: headers(),
		body: JSON.stringify({
			query,
			limit,
			tbs: "qdr:y"
		})
	});
	if (!response.ok) {
		const errorBody = await response.text();
		console.error(`Firecrawl search failed [${response.status}]: ${errorBody}`);
		if (response.status === 429 || response.status === 402) throw new Error(`Web research is temporarily unavailable [${response.status}].`);
		return [];
	}
	const payload = await response.json();
	return (Array.isArray(payload.data) ? payload.data : payload.data?.web ?? []).slice(0, limit).map((item) => ({
		query,
		title: String(item["title"] ?? ""),
		url: String(item["url"] ?? ""),
		snippet: String(item["description"] ?? item["markdown"] ?? "").slice(0, 1500)
	}));
}
/** Runs several searches in parallel; individual failures are ignored. */
async function firecrawlSearchMany(queries, limit = 4) {
	return dedupeByUrl((await Promise.allSettled(queries.map((q) => firecrawlSearch(q, limit)))).flatMap((r) => r.status === "fulfilled" ? r.value : []));
}
function dedupeByUrl(findings) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const f of findings) {
		const key = f.url.replace(/[#?].*$/, "").replace(/\/$/, "");
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(f);
	}
	return out;
}
/** Ranks findings so authoritative/first-hand sources come first in the prompt. */
var PRIORITY_HOSTS = [
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
	".nic.in"
];
function rankFindings(findings) {
	const score = (f) => {
		const i = PRIORITY_HOSTS.findIndex((h) => f.url.includes(h));
		return i === -1 ? PRIORITY_HOSTS.length : i;
	};
	return [...findings].sort((a, b) => score(a) - score(b));
}
/** Fetches full page markdown for a few high-value URLs so numbers aren't guessed from snippets. */
async function firecrawlScrapeMany(urls, maxChars = 6e3) {
	return (await Promise.allSettled(urls.map(async (url) => {
		const response = await fetch(`${GATEWAY_V2}/scrape`, {
			method: "POST",
			headers: headers(),
			body: JSON.stringify({
				url,
				formats: ["markdown"],
				onlyMainContent: true
			})
		});
		if (!response.ok) {
			console.error(`Firecrawl scrape failed [${response.status}] for ${url}`);
			return null;
		}
		const payload = await response.json();
		const markdown = payload.markdown ?? payload.data?.markdown ?? "";
		if (!markdown) return null;
		return {
			query: "full page content",
			title: payload.metadata?.title ?? payload.data?.metadata?.title ?? url,
			url,
			snippet: markdown.slice(0, maxChars)
		};
	}))).flatMap((r) => r.status === "fulfilled" && r.value ? [r.value] : []);
}
function formatFindings(findings) {
	if (findings.length === 0) return "NO SEARCH RESULTS WERE RETURNED. Say so explicitly and mark research_confidence as low.";
	return rankFindings(findings).map((f, i) => `[${i + 1}] search: "${f.query}"\ntitle: ${f.title}\nurl: ${f.url}\nexcerpt: ${f.snippet}`).join("\n\n");
}
var QUESTION_SYSTEM_PROMPT = `You are an expert career counselor specializing in Indian education and career
pathways, with deep knowledge of the Indian job market, entrance exams (JEE,
NEET, CLAT, CUET, CA Foundation, NDA, and others), and the pressures Indian
12th-grade students face — board exam stress, family expectations, coaching
culture, and the passion-vs-stability tradeoff that comes up constantly in
Indian households.

Generate a personalized psychometric-style questionnaire. Every question must be:
- Grounded in the Indian context, never translated from a Western career test
- Written in simple, relatable language a 16-18 year old Indian student understands
- Designed to reveal genuine personality traits, work style, risk tolerance, and
  values — not just surface-level "what do you like"
- Free of leading language that telegraphs a "correct" answer

Never repeat similar questions. Avoid generic prompts like "what's your favorite
subject" — ground every question in a scenario Indian students actually face.

Return ONLY valid JSON. No markdown formatting, no code fences, no text before
or after the JSON.`;
function buildQuestionPrompt(interests, numQuestions) {
	const list = interests.join(", ");
	return `Generate exactly ${numQuestions} multiple-choice questions for a 12th-grade
Indian student who selected these interest areas: ${list}.

Distribute questions across these dimensions — mix them, don't group them in
obvious blocks:
1. Work environment preference (independent vs team, structured vs flexible, field work vs desk work)
2. Pressure & risk tolerance (handling exam-style pressure; comfort with uncertain-income paths like startups/arts vs stable paths like government jobs)
3. Family and social context (balancing family expectations with personal interest)
4. Cognitive style (analytical vs creative vs people-oriented vs hands-on)
5. Long-term motivation (money vs impact vs prestige vs stability vs passion)
6. Study/learning style (self-study vs coaching-dependent, theory vs practical)
7. Self-assessed strengths relative to peers (without a generic "rate 1-10")

Each question needs exactly 4 options that are meaningfully different from
each other — not "yes / no / maybe / somewhat."

Return this exact JSON structure:
[
  {
    "id": 1,
    "dimension": "which of the 7 dimensions above this maps to",
    "q": "question text",
    "opts": ["option A", "option B", "option C", "option D"]
  }
]

Selected interests: ${list}
Generate ${numQuestions} questions now.`;
}
var CAREER_SYSTEM_PROMPT = `You are a senior Indian career counselor and education analyst. You have
guided thousands of Indian 12th-grade students into careers and colleges
that fit both their personality and India's real job market — not
aspirational fantasy careers, not outdated "safe" careers, an honest match.

You are given WEB RESEARCH RESULTS gathered live from the internet. Use them to
verify current college names, entrance exam patterns, and salary ranges before
answering — Indian college names, affiliations, and cutoffs change often. Do not
rely purely on memorized data for college names and cutoffs, and never cite a
fact as verified if it is not supported by the research provided.

Rules:
1. Only recommend careers with real, current demand in India. If a field is saturated or declining, say so explicitly rather than staying diplomatically vague.
2. Only recommend colleges that actually exist. If you're not fully certain a college exists under that exact name in that exact city, say so rather than inventing one.
3. Give real salary ranges in INR (LPA) based on current Indian market data — never global or US figures.
4. Be honest about job market difficulty. Do not oversell any field.
5. If the student's answers show contradictory signals, name that tension in the personality summary instead of smoothing it over.
6. Never assume the student's reservation category. If category-specific eligibility affects a recommendation, note that eligibility varies rather than assuming General category.
7. Career paths are not only salaried jobs. Where the student's answers genuinely point that way, recommend entrepreneurship, family-business succession, freelancing/self-employment, creator/content work, trading, agri-business, franchise or local service businesses — with honest capital needs, risk and realistic income ranges in INR. Do not force a business path if their answers show low risk tolerance; and never present only conventional salaried roles when self-employment fits better.
8. GROUNDING (hard rule): every salary figure, college name, fee and exam name must be traceable to the WEB RESEARCH RESULTS. Append the source marker like [2] to any figure you take from research. If research does not cover a figure, write "not verified in research — verify on official site" instead of a confident number.
9. Never state a cutoff, fee or salary without the year it applies to.
10. Prefer a narrower, well-supported answer over a broad, confident-sounding one. Vague hedging is a failure too — be specific where the research supports it, explicitly uncertain where it does not.

Return ONLY valid JSON, no markdown, no commentary outside the JSON.`;
function buildCareerPrompt(params) {
	return `Analyze this Indian 12th-grade student's quiz responses and recommend their
top 2 career paths.

At least consider non-salaried routes (business, self-employment, freelancing,
family business, creator economy) alongside conventional jobs, and pick whichever
two genuinely fit best. For a business/self-employment path: treat "avg_salary_entry"
as realistic year-1 earnings, "avg_salary_mid_career" as earnings after ~5 years,
entrance exams may be an empty array, and "colleges_near_city" should list courses/
institutes that actually help that path (BBA, B.Com, design, skill institutes) or be
empty if formal study is not needed.

Selected interests: ${params.interests.join(", ")}
City: ${params.city}

Full Q&A transcript:
${params.transcript}

WEB RESEARCH RESULTS (live search, use these to verify salaries, colleges and exams):
${params.research}

Return this exact JSON:
{
  "personality_summary": "2-3 sentences on personality type, key strengths, and any notable tension in their answers",
  "confidence_note": "one sentence on how clear-cut this match is",
  "top_careers": [
    {
      "title": "career title",
      "is_primary": true,
      "why_fit": "reasoning tied to their actual answers, not generic",
      "avg_salary_entry": "₹X-Y LPA",
      "avg_salary_mid_career": "₹X-Y LPA at 5 years experience",
      "job_market_outlook": "Excellent / Good / Moderate / Competitive — with one honest sentence of reasoning",
      "top_entrance_exams": ["exam name"],
      "colleges_near_city": [
        {"name": "verified real college name", "tier": "Top Tier / Mid Tier / Good College", "course": "exact course name", "approx_fees_per_year": "₹X"}
      ],
      "first_steps": ["specific action for this student in the next month", "action 2", "action 3"]
    }
  ],
  "data_freshness_warning": "reminder that cutoffs, fees, and exam patterns change yearly and should be verified on official sites before final decisions"
}

Return exactly 2 careers, the first with "is_primary": true.`;
}
var COLLEGE_SYSTEM_PROMPT = `You are an Indian college admissions strategist. You have spent years
studying real Indian student admission journeys — not official brochures,
but what actually happens: real cutoffs, real Reddit threads, real regrets,
real hacks that worked.

You are given WEB RESEARCH RESULTS gathered live from Reddit, Quora, the college's
official site, news, and review sites (Careers360, Shiksha, CollegeDekho). You MUST
base your answer on that research, not on memory alone — Indian admission criteria,
cutoffs, and exam patterns change every year.

Core rules:
- NEVER invent a Reddit thread, Quora answer, or statistic. If it is not in the research provided, don't present it as if you found it.
- If the research is thin or unclear on something, say so explicitly rather than filling the gap with a confident-sounding guess.
- Every cutoff, percentile, rank, fee, package and ranking you state MUST come from the research provided and MUST carry (a) the year it applies to and (b) the source marker like [3] pointing at the research item it came from. A number without a year and a source marker is a failure.
- When two sources disagree, give the range and say which source said what, rather than silently picking one.
- Official/college-domain and NIRF data outrank aggregator sites; aggregator data outranks forum anecdotes. Label forum-derived numbers as student-reported, not official.
- Set research_confidence to "high" only when official or NIRF-level sources cover the cutoff AND the placement data; "medium" when only aggregators cover them; "low" when you are relying mostly on forums or the research is thin.
- Do not name a backup college unless it appears in the research or you are certain it exists under that exact name in that state; otherwise describe the type of college to target instead.
- Distinguish clearly between the "official cutoff" (what the college publishes) and the "realistic cutoff" (what students who actually got in report needing).
- Calibrate every recommendation to this specific student's current standing. Generic advice that would apply to any student is a failure condition.
- A student below the realistic cutoff is not a failure — give an honest gap and a real path forward. A student comfortably above cutoff should be told that too, and pointed toward what differentiates candidates at that level.
- Where reservation category (SC/ST/OBC-NCL/EWS/General/PwD) changes the cutoff meaningfully, give the category-specific number. If category wasn't provided, default to General and say so explicitly.
- State the year of every cutoff or statistic you cite.

Output ONLY valid JSON matching the schema in the user message. No markdown
fences, no text before or after the JSON.`;
function buildCollegePrompt(params) {
	const p = params;
	return `Research and build a personalized admission roadmap for this student.

STUDENT PROFILE:
- Dream college: ${p.collegeName}
- Course/stream: ${p.stream}
- Board: ${p.board}
- Current 11th/12th percentage: ${p.boardPercentage}
- Entrance exam score/percentile/rank: ${p.examScore || "N/A"}
- Category: ${p.category}
- Home city/state: ${p.cityState}
- Target admission year: ${p.targetYear}
- Today's date, for your timeline math: ${p.todaysDate}

WEB RESEARCH RESULTS (live searches across Reddit, Quora, official site, news, review sites):
${p.research}

Return ONLY this JSON, fully filled in and calibrated specifically to a
student at ${p.boardPercentage}:

{
  "research_confidence": "high | medium | low",
  "sources_checked": ["[n] Site name — full URL, exactly as given in the research above. Only list items you actually used."],
  "gap_analysis": {
    "your_percentage": "${p.boardPercentage}",
    "official_cutoff": "what the college officially publishes, with year cited",
    "realistic_cutoff_per_students": "what students who actually got in report needing",
    "category_note": "category-specific cutoff if it differs; note if General was used by default",
    "gap_verdict": "one clear sentence: comfortably above / borderline / significant gap, and by how much",
    "honest_paragraph": "3-4 sentences of direct, kind, honest talk"
  },
  "college_reality_check": {
    "reputation_vs_reality": "2-3 sentences",
    "placement_reality": "honest placement data, median/range if found, branch-wise variation if relevant",
    "campus_life_from_students": "what real students say about hostel, food, culture, workload"
  },
  "personalized_roadmap": {
    "months_available": "calculated from ${p.todaysDate} to when ${p.targetYear} applications typically close",
    "phase_1_immediate": { "timeframe": "this month", "actions": ["..."] },
    "phase_2_near_term": { "timeframe": "next 1-3 months", "actions": ["..."] },
    "phase_3_application_prep": { "timeframe": "3-6 months out", "actions": ["..."] },
    "phase_4_final_stretch": { "timeframe": "last 4-6 weeks before deadline", "actions": ["..."] }
  },
  "entrance_exam_strategy": {
    "primary_exam": "exact current name of the exam this college uses",
    "score_this_college_needs": "real number/percentile/rank, cited with year",
    "your_current_readiness": "honest assessment",
    "prep_recommendation": "specific advice for their actual timeline"
  },
  "free_certifications": [
    { "name": "specific course name", "platform": "NPTEL / SWAYAM / Coursera / edX / Google", "relevance_to_this_college": "why this specifically strengthens an application here", "search_term_to_find_it": "exact phrase to search", "time_commitment": "realistic hours/weeks" }
  ],
  "backup_colleges": [
    { "name": "real college name", "why_strong_backup": "reason specific to this student", "estimated_cutoff_for_you": "realistic number", "honest_comparison": "how it genuinely compares" }
  ],
  "insider_tips": ["a specific tip sourced from the research, attributed generally"],
  "honest_warning": "the one thing students commonly say they wish they'd known before joining",
  "data_freshness_note": "reminder that this is based on data found around ${p.todaysDate} and should be re-verified on the official site"
}`;
}
var GenerateQuestionsInput = object({
	interests: array(string().min(1)).min(1).max(8),
	numQuestions: number().int().min(8).max(14).default(12)
});
var generateQuestions_createServerFn_handler = createServerRpc({
	id: "e0e98e52c3b50e18dcdfe0694b2b20ecd3734e03574803bb2d088aed339e417c",
	name: "generateQuestions",
	filename: "src/lib/careercompass.functions.ts"
}, (opts) => generateQuestions.__executeServer(opts));
var generateQuestions = createServerFn({ method: "POST" }).inputValidator((input) => GenerateQuestionsInput.parse(input)).handler(generateQuestions_createServerFn_handler, async ({ data }) => {
	const raw = await generateJson({
		model: FAST_MODEL,
		system: QUESTION_SYSTEM_PROMPT,
		prompt: buildQuestionPrompt(data.interests, data.numQuestions),
		temperature: .8
	});
	const questions = QuestionsSchema.parse(raw);
	return {
		quizSessionId: await insertRow("quiz_sessions", {
			interests: data.interests,
			questions
		}),
		questions
	};
});
var AnalyzeCareerInput = object({
	quizSessionId: string().nullable().optional(),
	interests: array(string().min(1)).min(1),
	city: string().min(1).max(80),
	answers: array(object({
		q: string(),
		a: string()
	})).min(4)
});
var analyzeCareer_createServerFn_handler = createServerRpc({
	id: "78be9b0fdcbf9361fb6335f4faaeb4cb625f9e21fe80d8a73bb23303f5ff2c82",
	name: "analyzeCareer",
	filename: "src/lib/careercompass.functions.ts"
}, (opts) => analyzeCareer.__executeServer(opts));
var analyzeCareer = createServerFn({ method: "POST" }).inputValidator((input) => AnalyzeCareerInput.parse(input)).handler(analyzeCareer_createServerFn_handler, async ({ data }) => {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const searchFindings = await firecrawlSearchMany([
		`best career options in India ${year} for students interested in ${data.interests.join(", ")}`,
		`average salary India ${year} entry level ${data.interests[0]} careers LPA site:ambitionbox.com`,
		`${data.interests[0]} salary in India freshers ${year} glassdoor OR payscale LPA`,
		`India job market demand ${year} ${data.interests.join(" ")} hiring outlook report`,
		`top colleges in ${data.city} for ${data.interests.join(" ")} courses admission ${year}`,
		`entrance exams ${year} India for ${data.interests.join(", ")} courses after 12th`
	], 4);
	const findings = [...searchFindings, ...await firecrawlScrapeMany(rankFindings(searchFindings).slice(0, 2).map((f) => f.url), 4e3)];
	const transcript = data.answers.map((a, i) => `Q${i + 1}: ${a.q}\nA: ${a.a}`).join("\n\n");
	const raw = await generateJson({
		model: MAIN_MODEL,
		system: CAREER_SYSTEM_PROMPT,
		prompt: buildCareerPrompt({
			interests: data.interests,
			city: data.city,
			transcript,
			research: formatFindings(findings)
		}),
		temperature: .25
	});
	const result = CareerResultSchema.parse(raw);
	if (data.quizSessionId) await insertRow("career_results", {
		quiz_session_id: data.quizSessionId,
		result_json: result
	});
	return result;
});
var AnalyzeCollegeInput = object({
	collegeName: string().min(2).max(160),
	stream: string().min(2).max(120),
	board: string().min(2).max(60),
	boardPercentage: string().min(1).max(20),
	examScore: string().max(60).optional().default(""),
	category: string().min(2).max(20).default("General"),
	cityState: string().min(2).max(120),
	targetYear: string().min(4).max(4)
});
var analyzeCollege_createServerFn_handler = createServerRpc({
	id: "6b2e61dd565fd5251abae1a9741ce2fcd7f30e35838a1fab62e71d110f107711",
	name: "analyzeCollege",
	filename: "src/lib/careercompass.functions.ts"
}, (opts) => analyzeCollege.__executeServer(opts));
var analyzeCollege = createServerFn({ method: "POST" }).inputValidator((input) => AnalyzeCollegeInput.parse(input)).handler(analyzeCollege_createServerFn_handler, async ({ data }) => {
	const c = data.collegeName;
	const searchFindings = await firecrawlSearchMany([
		`${c} ${data.stream} cutoff ${data.targetYear} and ${Number(data.targetYear) - 1}`,
		`${c} ${data.stream} ${data.category} category cutoff percentile last year`,
		`site:reddit.com ${c} admission cutoff experience ${data.stream}`,
		`site:quora.com ${c} ${data.stream} admission chances worth it`,
		`${c} official admission criteria eligibility ${data.targetYear} site:.ac.in OR site:.edu.in`,
		`site:careers360.com ${c} ${data.stream} cutoff placement`,
		`site:shiksha.com ${c} ${data.stream} cutoff fees placement`,
		`${c} placement report median package NIRF ranking ${data.targetYear}`,
		`${c} review students hostel campus honest ${data.targetYear}`
	], 4);
	const findings = [...searchFindings, ...await firecrawlScrapeMany(rankFindings(searchFindings).slice(0, 3).map((f) => f.url), 6e3)];
	const todaysDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const raw = await generateJson({
		model: MAIN_MODEL,
		system: COLLEGE_SYSTEM_PROMPT,
		prompt: buildCollegePrompt({
			collegeName: data.collegeName,
			stream: data.stream,
			board: data.board,
			boardPercentage: data.boardPercentage,
			examScore: data.examScore,
			category: data.category,
			cityState: data.cityState,
			targetYear: data.targetYear,
			todaysDate,
			research: formatFindings(findings)
		}),
		temperature: .15
	});
	const result = CollegeResultSchema.parse(raw);
	const cachedUntil = new Date(Date.now() + 12096e5).toISOString();
	await insertRow("college_queries", {
		college_name: data.collegeName,
		stream: data.stream,
		category: data.category,
		board_percentage: data.boardPercentage,
		result_json: result,
		research_confidence: result.research_confidence,
		cached_until: cachedUntil
	});
	return result;
});
var ReportInput = object({
	resultType: _enum(["career", "college"]),
	reportedIssue: string().min(3).max(1e3)
});
var reportInaccuracy_createServerFn_handler = createServerRpc({
	id: "e850f7695cb6baab8ecb22cae7882b99ed37956cb24efd1f52c9adfebb10745e",
	name: "reportInaccuracy",
	filename: "src/lib/careercompass.functions.ts"
}, (opts) => reportInaccuracy.__executeServer(opts));
var reportInaccuracy = createServerFn({ method: "POST" }).inputValidator((input) => ReportInput.parse(input)).handler(reportInaccuracy_createServerFn_handler, async ({ data }) => {
	await insertRow("accuracy_reports", {
		result_type: data.resultType,
		reported_issue: data.reportedIssue
	});
	return { ok: true };
});
//#endregion
export { analyzeCareer_createServerFn_handler, analyzeCollege_createServerFn_handler, generateQuestions_createServerFn_handler, reportInaccuracy_createServerFn_handler };
