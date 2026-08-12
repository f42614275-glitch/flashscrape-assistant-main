import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { NavLink, SiteFooter, SiteHeader } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeCollege } from "@/lib/careercompass.functions";
import type { CollegeResult } from "@/lib/careercompass.schemas";

export const Route = createFileRoute("/college")({
  head: () => ({
    meta: [
      { title: "Dream College Analyzer — NAAM NAHI PATA" },
      {
        name: "description",
        content:
          "See the real cutoff students report for your dream Indian college, your honest gap, a 4-phase roadmap and solid backups.",
      },
      { property: "og:title", content: "Dream College Analyzer — NAAM NAHI PATA" },
      {
        property: "og:description",
        content: "Real cutoffs, honest gap analysis and a personalized admission roadmap.",
      },
    ],
  }),
  component: CollegePage,
});

const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"];
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Other"];

function CollegePage() {
  const run = useServerFn(analyzeCollege);
  const [form, setForm] = useState({
    collegeName: "",
    stream: "",
    board: "CBSE",
    boardPercentage: "",
    examScore: "",
    category: "General",
    cityState: "",
    targetYear: String(new Date().getFullYear() + 1),
  });
  const [result, setResult] = useState<CollegeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const ready =
    form.collegeName.trim().length > 1 &&
    form.stream.trim().length > 1 &&
    form.boardPercentage.trim().length > 0 &&
    form.cityState.trim().length > 1;

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await run({ data: form }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete the analysis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paper min-h-screen">
      <SiteHeader right={<NavLink to="/career">Career Finder</NavLink>} />

      <main className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:px-8">
        <p className="eyebrow">Dream College Analyzer</p>
        <h1 className="display-serif rise mt-4 text-4xl sm:text-6xl">
          Where do you actually stand?
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          We search Reddit, Quora, the official site, news and review portals, then compare the real
          cutoff to your numbers. No brochure optimism.
        </p>

        <div className="card-shadow mt-10 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8">
          <Field label="Dream college" value={form.collegeName} onChange={set("collegeName")} placeholder="e.g. Shri Ram College of Commerce" />
          <Field label="Course / stream" value={form.stream} onChange={set("stream")} placeholder="e.g. B.Com (Hons)" />
          <Select label="Board" value={form.board} options={BOARDS} onChange={set("board")} />
          <Field label="Current 11th/12th %" value={form.boardPercentage} onChange={set("boardPercentage")} placeholder="e.g. 88.4" />
          <Field label="Entrance score / rank (optional)" value={form.examScore} onChange={set("examScore")} placeholder="e.g. CUET 720" />
          <Select label="Category" value={form.category} options={CATEGORIES} onChange={set("category")} />
          <Field label="Home city / state" value={form.cityState} onChange={set("cityState")} placeholder="e.g. Jaipur, Rajasthan" />
          <Field label="Target admission year" value={form.targetYear} onChange={set("targetYear")} placeholder="2027" />
        </div>

        <Button
          className="mt-8 rounded-full px-7"
          size="lg"
          disabled={!ready || loading}
          onClick={submit}
        >
          {loading ? "Researching this college…" : "Analyze my chances"}
        </Button>

        {error && (
          <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {result && <CollegeReport result={result} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function CollegeReport({ result }: { result: CollegeResult }) {
  const roadmap = result.personalized_roadmap;
  const phases = [
    roadmap.phase_1_immediate,
    roadmap.phase_2_near_term,
    roadmap.phase_3_application_prep,
    roadmap.phase_4_final_stretch,
  ];

  return (
    <section className="rise mt-12 space-y-6">
      <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="display-serif text-3xl">Gap analysis</h2>
          <span className="eyebrow rounded-full border border-border px-3 py-1">
            Research confidence: {result.research_confidence}
          </span>
        </div>
        <p className="display-serif mt-5 text-xl leading-snug">{result.gap_analysis.gap_verdict}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="You" value={result.gap_analysis.your_percentage} />
          <Stat label="Official cutoff" value={result.gap_analysis.official_cutoff} />
          <Stat label="Realistic cutoff" value={result.gap_analysis.realistic_cutoff_per_students} />
        </div>
        {result.gap_analysis.category_note && (
          <p className="mt-4 text-xs text-muted-foreground">{result.gap_analysis.category_note}</p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {result.gap_analysis.honest_paragraph}
        </p>
      </div>

      <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h2 className="display-serif text-3xl">Reality check</h2>
        <Block title="Reputation vs reality" body={result.college_reality_check.reputation_vs_reality} />
        <Block title="Placements" body={result.college_reality_check.placement_reality} />
        <Block title="Campus life" body={result.college_reality_check.campus_life_from_students} />
      </div>

      <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h2 className="display-serif text-3xl">Your roadmap</h2>
        <p className="mt-1 text-sm text-muted-foreground">{roadmap.months_available}</p>
        <div className="mt-6 space-y-4">
          {phases.map((phase, i) => (
            <div key={i} className="rounded-xl border border-border/70 p-5">
              <p className="eyebrow text-primary">
                Phase {i + 1} · {phase.timeframe}
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                {phase.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h2 className="display-serif text-3xl">Entrance exam strategy</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Primary exam" value={result.entrance_exam_strategy.primary_exam} />
          <Stat label="Score needed" value={result.entrance_exam_strategy.score_this_college_needs} />
        </div>
        <Block title="Your readiness" body={result.entrance_exam_strategy.your_current_readiness} />
        <Block title="Prep plan" body={result.entrance_exam_strategy.prep_recommendation} />
      </div>

      {result.free_certifications.length > 0 && (
        <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
          <h2 className="display-serif text-3xl">Free certifications that help here</h2>
          <ul className="mt-4 space-y-3">
            {result.free_certifications.map((c) => (
              <li key={c.name} className="rounded-xl border border-border/70 p-4 text-sm">
                <p className="font-semibold">
                  {c.name} <span className="text-muted-foreground">· {c.platform}</span>
                </p>
                <p className="mt-1 text-muted-foreground">{c.relevance_to_this_college}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Search: “{c.search_term_to_find_it}” · {c.time_commitment}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.backup_colleges.length > 0 && (
        <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
          <h2 className="display-serif text-3xl">Strong backups</h2>
          <ul className="mt-4 space-y-3">
            {result.backup_colleges.map((b) => (
              <li key={b.name} className="rounded-xl border border-border/70 p-4 text-sm">
                <p className="font-semibold">{b.name}</p>
                <p className="mt-1 text-muted-foreground">{b.why_strong_backup}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Likely cutoff for you: {b.estimated_cutoff_for_you} · {b.honest_comparison}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.insider_tips.length > 0 && (
        <div className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9">
          <h2 className="display-serif text-3xl">Insider tips</h2>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            {result.insider_tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-warning/40 bg-warning/5 p-7">
        <h2 className="display-serif text-2xl">The honest warning</h2>
        <p className="mt-3 text-sm leading-relaxed">{result.honest_warning}</p>
      </div>

      {result.sources_checked.length > 0 && (
        <div className="rounded-2xl border border-border p-6 text-xs text-muted-foreground">
          <p className="font-semibold">Sources checked</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.sources_checked.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3">{result.data_freshness_note}</p>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="eyebrow">{label}</Label>
      <Input
        className="mt-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="eyebrow">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 border-t border-border/70 pt-4">
      <h3 className="eyebrow">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}