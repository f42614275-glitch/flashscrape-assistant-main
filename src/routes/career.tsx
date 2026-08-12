import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { NavLink, SiteFooter, SiteHeader } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeCareer, generateQuestions } from "@/lib/careercompass.functions";
import type { CareerResult, Question } from "@/lib/careercompass.schemas";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "AI Career Finder — NAAM NAHI PATA" },
      {
        name: "description",
        content:
          "Answer an Indian-context psychometric quiz and get two honest career matches with real INR salaries, colleges near you and next steps.",
      },
      { property: "og:title", content: "AI Career Finder — NAAM NAHI PATA" },
      {
        property: "og:description",
        content: "Two honest career matches with real INR salaries and colleges near your city.",
      },
    ],
  }),
  component: CareerPage,
});

const INTERESTS = [
  "Science & Research",
  "Technology & Coding",
  "Medicine & Healthcare",
  "Business & Commerce",
  "Law & Policy",
  "Design & Creative Arts",
  "Media & Communication",
  "Defence & Civil Services",
  "Teaching & Social Work",
  "Sports & Fitness",
  "Business & Entrepreneurship",
];

type Stage = "interests" | "quiz" | "city" | "result";

function CareerPage() {
  const runGenerate = useServerFn(generateQuestions);
  const runAnalyze = useServerFn(analyzeCareer);

  const [stage, setStage] = useState<Stage>("interests");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [city, setCity] = useState("");
  const [result, setResult] = useState<CareerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (item: string) =>
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item].slice(0, 5),
    );

  function addCustomInterest() {
    const value = customInterest.trim();
    if (!value) return;
    setInterests((prev) =>
      prev.some((i) => i.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value].slice(0, 5),
    );
    setCustomInterest("");
  }

  async function startQuiz() {
    setLoading(true);
    setError(null);
    try {
      const res = await runGenerate({ data: { interests, numQuestions: 12 } });
      setQuestions(res.questions);
      setQuizSessionId(res.quizSessionId);
      setStage("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate your questions.");
    } finally {
      setLoading(false);
    }
  }

  function answer(option: string) {
    const q = questions[current];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setStage("city");
  }

  async function finish() {
    setLoading(true);
    setError(null);
    try {
      const payload = questions.map((q) => ({ q: q.q, a: answers[q.id] ?? "Skipped" }));
      const res = await runAnalyze({
        data: { quizSessionId, interests, city, answers: payload },
      });
      setResult(res);
      setStage("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze your answers.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paper min-h-screen">
      <SiteHeader right={<NavLink to="/college">College Analyzer</NavLink>} />

      <main className="mx-auto max-w-3xl px-6 pt-16 pb-20 sm:px-8">
        {error && (
          <p className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {stage === "interests" && (
          <section className="rise">
            <p className="eyebrow">Step one</p>
            <h1 className="display-serif mt-4 text-4xl sm:text-5xl">What pulls your attention?</h1>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              Pick one to five areas. Be honest rather than strategic — the reading is only as good
              as the truth you put in.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border/70 pt-8">
              {INTERESTS.map((item) => {
                const active = interests.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 max-w-md">
              <Label htmlFor="custom-interest" className="eyebrow">
                Something else? Add your own
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="custom-interest"
                  value={customInterest}
                  placeholder="e.g. Family business, YouTube, Farming"
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={addCustomInterest}
                  disabled={customInterest.trim().length === 0 || interests.length >= 5}
                >
                  Add
                </Button>
              </div>
              {interests.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selected ({interests.length}/5): {interests.join(", ")}
                </p>
              )}
            </div>
            <Button
              className="mt-10 rounded-full px-7"
              size="lg"
              disabled={interests.length === 0 || loading}
              onClick={startQuiz}
            >
              {loading ? "Writing your questions…" : "Generate my quiz"}
            </Button>
          </section>
        )}

        {stage === "quiz" && questions[current] && (
          <section key={current} className="rise">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-primary">
                {questions[current].dimension}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
              </p>
            </div>
            <div className="mt-3 h-px w-full bg-border">
              <div
                className="h-px bg-primary transition-all duration-500"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
            <h1 className="display-serif mt-8 text-3xl sm:text-[2.5rem]">{questions[current].q}</h1>
            <div className="mt-8 grid gap-3">
              {questions[current].opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => answer(opt)}
                  className="group rounded-xl border border-border bg-card px-5 py-4 text-left text-sm leading-relaxed transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[var(--shadow-card)]"
                >
                  {opt}
                </button>
              ))}
            </div>
            {current > 0 && (
              <Button variant="ghost" className="mt-8 px-0" onClick={() => setCurrent(current - 1)}>
                ← Back
              </Button>
            )}
          </section>
        )}

        {stage === "city" && (
          <section className="rise">
            <p className="eyebrow">Last step</p>
            <h1 className="display-serif mt-4 text-4xl">Where do you live?</h1>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              We use this to find real colleges within reach of your city.
            </p>
            <div className="mt-8 max-w-sm">
              <Label htmlFor="city" className="eyebrow">
                City
              </Label>
              <Input
                id="city"
                className="mt-2"
                value={city}
                placeholder="e.g. Indore"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Button
              className="mt-8 rounded-full px-7"
              size="lg"
              disabled={city.trim().length < 2 || loading}
              onClick={finish}
            >
              {loading ? "Researching careers and colleges…" : "Show my results"}
            </Button>
          </section>
        )}

        {stage === "result" && result && <CareerReport result={result} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function CareerReport({ result }: { result: CareerResult }) {
  return (
    <section className="rise space-y-8">
      <div>
        <p className="eyebrow">Your reading</p>
        <p className="display-serif mt-4 text-2xl leading-snug sm:text-[1.75rem]">
          {result.personality_summary}
        </p>
        <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground">
          {result.confidence_note}
        </p>
      </div>

      {result.top_careers.map((career, i) => (
        <article
          key={career.title}
          className="card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="eyebrow text-primary">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="display-serif text-3xl">{career.title}</h2>
            {career.is_primary && (
              <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-primary uppercase">
                Best match
              </span>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{career.why_fit}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Entry salary" value={career.avg_salary_entry} />
            <Stat label="At 5 years" value={career.avg_salary_mid_career} />
            <Stat label="Job market" value={career.job_market_outlook} />
          </dl>

          {career.top_entrance_exams.length > 0 && (
            <p className="mt-6 text-sm">
              <span className="font-semibold">Entrance exams: </span>
              {career.top_entrance_exams.join(", ")}
            </p>
          )}

          {career.colleges_near_city.length > 0 && (
            <div className="mt-6 border-t border-border/70 pt-5">
              <h3 className="eyebrow">Colleges near you</h3>
              <ul className="mt-3 space-y-2">
                {career.colleges_near_city.map((c) => (
                  <li key={c.name} className="rounded-lg border border-border/70 p-3 text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {c.course} · {c.tier} · {c.approx_fees_per_year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {career.first_steps.length > 0 && (
            <div className="mt-6 border-t border-border/70 pt-5">
              <h3 className="eyebrow">Do this in the next month</h3>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                {career.first_steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          )}
        </article>
      ))}

      <p className="rounded-xl border border-warning/40 bg-warning/5 p-5 text-sm leading-relaxed">
        {result.data_freshness_warning}
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-sm font-semibold">{value}</dd>
    </div>
  );
}