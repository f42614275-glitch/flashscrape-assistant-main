import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, n as NavLink, r as SiteFooter, t as Button } from "./button-COGY-sf9.mjs";
import { a as generateQuestions, n as Label, o as useServerFn, r as analyzeCareer, t as Input } from "./careercompass.functions-CVDFAxus.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/career-roqUJLDJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INTERESTS = [
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
	"Business & Entrepreneurship"
];
function CareerPage() {
	const runGenerate = useServerFn(generateQuestions);
	const runAnalyze = useServerFn(analyzeCareer);
	const [stage, setStage] = (0, import_react.useState)("interests");
	const [interests, setInterests] = (0, import_react.useState)([]);
	const [customInterest, setCustomInterest] = (0, import_react.useState)("");
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [quizSessionId, setQuizSessionId] = (0, import_react.useState)(null);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [city, setCity] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const toggle = (item) => setInterests((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item].slice(0, 5));
	function addCustomInterest() {
		const value = customInterest.trim();
		if (!value) return;
		setInterests((prev) => prev.some((i) => i.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value].slice(0, 5));
		setCustomInterest("");
	}
	async function startQuiz() {
		setLoading(true);
		setError(null);
		try {
			const res = await runGenerate({ data: {
				interests,
				numQuestions: 12
			} });
			setQuestions(res.questions);
			setQuizSessionId(res.quizSessionId);
			setStage("quiz");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not generate your questions.");
		} finally {
			setLoading(false);
		}
	}
	function answer(option) {
		const q = questions[current];
		if (!q) return;
		setAnswers((prev) => ({
			...prev,
			[q.id]: option
		}));
		if (current + 1 < questions.length) setCurrent(current + 1);
		else setStage("city");
	}
	async function finish() {
		setLoading(true);
		setError(null);
		try {
			const payload = questions.map((q) => ({
				q: q.q,
				a: answers[q.id] ?? "Skipped"
			}));
			const res = await runAnalyze({ data: {
				quizSessionId,
				interests,
				city,
				answers: payload
			} });
			setResult(res);
			setStage("result");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not analyze your answers.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
				to: "/college",
				children: "College Analyzer"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-6 pt-16 pb-20 sm:px-8",
				children: [
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
						children: error
					}),
					stage === "interests" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Step one"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "display-serif mt-4 text-4xl sm:text-5xl",
								children: "What pulls your attention?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-lg leading-relaxed text-muted-foreground",
								children: "Pick one to five areas. Be honest rather than strategic — the reading is only as good as the truth you put in."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex flex-wrap gap-2 border-t border-border/70 pt-8",
								children: INTERESTS.map((item) => {
									const active = interests.includes(item);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggle(item),
										className: `rounded-full border px-4 py-2 text-sm transition-all duration-200 ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`,
										children: item
									}, item);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 max-w-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "custom-interest",
										className: "eyebrow",
										children: "Something else? Add your own"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "custom-interest",
											value: customInterest,
											placeholder: "e.g. Family business, YouTube, Farming",
											onChange: (e) => setCustomInterest(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addCustomInterest();
												}
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											className: "rounded-full px-5",
											onClick: addCustomInterest,
											disabled: customInterest.trim().length === 0 || interests.length >= 5,
											children: "Add"
										})]
									}),
									interests.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-xs text-muted-foreground",
										children: [
											"Selected (",
											interests.length,
											"/5): ",
											interests.join(", ")
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-10 rounded-full px-7",
								size: "lg",
								disabled: interests.length === 0 || loading,
								onClick: startQuiz,
								children: loading ? "Writing your questions…" : "Generate my quiz"
							})
						]
					}),
					stage === "quiz" && questions[current] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-primary",
									children: questions[current].dimension
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground tabular-nums",
									children: [
										String(current + 1).padStart(2, "0"),
										" / ",
										String(questions.length).padStart(2, "0")
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-px w-full bg-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-px bg-primary transition-all duration-500",
									style: { width: `${(current + 1) / questions.length * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "display-serif mt-8 text-3xl sm:text-[2.5rem]",
								children: questions[current].q
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid gap-3",
								children: questions[current].opts.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => answer(opt),
									className: "group rounded-xl border border-border bg-card px-5 py-4 text-left text-sm leading-relaxed transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[var(--shadow-card)]",
									children: opt
								}, opt))
							}),
							current > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "mt-8 px-0",
								onClick: () => setCurrent(current - 1),
								children: "← Back"
							})
						]
					}, current),
					stage === "city" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Last step"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "display-serif mt-4 text-4xl",
								children: "Where do you live?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md leading-relaxed text-muted-foreground",
								children: "We use this to find real colleges within reach of your city."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 max-w-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "city",
									className: "eyebrow",
									children: "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "city",
									className: "mt-2",
									value: city,
									placeholder: "e.g. Indore",
									onChange: (e) => setCity(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-8 rounded-full px-7",
								size: "lg",
								disabled: city.trim().length < 2 || loading,
								onClick: finish,
								children: loading ? "Researching careers and colleges…" : "Show my results"
							})
						]
					}),
					stage === "result" && result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareerReport, { result })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function CareerReport({ result }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rise space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Your reading"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "display-serif mt-4 text-2xl leading-snug sm:text-[1.75rem]",
					children: result.personality_summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground",
					children: result.confidence_note
				})
			] }),
			result.top_careers.map((career, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow text-primary",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "display-serif text-3xl",
								children: career.title
							}),
							career.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-primary uppercase",
								children: "Best match"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: career.why_fit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Entry salary",
								value: career.avg_salary_entry
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "At 5 years",
								value: career.avg_salary_mid_career
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Job market",
								value: career.job_market_outlook
							})
						]
					}),
					career.top_entrance_exams.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Entrance exams: "
						}), career.top_entrance_exams.join(", ")]
					}),
					career.colleges_near_city.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-border/70 pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "eyebrow",
							children: "Colleges near you"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: career.colleges_near_city.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border/70 p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										" ",
										"· ",
										c.course,
										" · ",
										c.tier,
										" · ",
										c.approx_fees_per_year
									]
								})]
							}, c.name))
						})]
					}),
					career.first_steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-border/70 pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "eyebrow",
							children: "Do this in the next month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground",
							children: career.first_steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
						})]
					})
				]
			}, career.title)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-warning/40 bg-warning/5 p-5 text-sm leading-relaxed",
				children: result.data_freshness_warning
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 bg-background/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "eyebrow",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-2 text-sm font-semibold",
			children: value
		})]
	});
}
//#endregion
export { CareerPage as component };
