import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, n as NavLink, r as SiteFooter, t as Button } from "./button-COGY-sf9.mjs";
import { i as analyzeCollege, n as Label, o as useServerFn, t as Input } from "./careercompass.functions-CVDFAxus.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/college-BMpt6Unm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"General",
	"OBC-NCL",
	"SC",
	"ST",
	"EWS",
	"PwD"
];
var BOARDS = [
	"CBSE",
	"ICSE",
	"State Board",
	"IB",
	"Other"
];
function CollegePage() {
	const run = useServerFn(analyzeCollege);
	const [form, setForm] = (0, import_react.useState)({
		collegeName: "",
		stream: "",
		board: "CBSE",
		boardPercentage: "",
		examScore: "",
		category: "General",
		cityState: "",
		targetYear: String((/* @__PURE__ */ new Date()).getFullYear() + 1)
	});
	const [result, setResult] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const set = (key) => (value) => setForm((prev) => ({
		...prev,
		[key]: value
	}));
	const ready = form.collegeName.trim().length > 1 && form.stream.trim().length > 1 && form.boardPercentage.trim().length > 0 && form.cityState.trim().length > 1;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
				to: "/career",
				children: "Career Finder"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-6 pt-16 pb-20 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Dream College Analyzer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-serif rise mt-4 text-4xl sm:text-6xl",
						children: "Where do you actually stand?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl leading-relaxed text-muted-foreground",
						children: "We search Reddit, Quora, the official site, news and review portals, then compare the real cutoff to your numbers. No brochure optimism."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-shadow mt-10 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Dream college",
								value: form.collegeName,
								onChange: set("collegeName"),
								placeholder: "e.g. Shri Ram College of Commerce"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Course / stream",
								value: form.stream,
								onChange: set("stream"),
								placeholder: "e.g. B.Com (Hons)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Board",
								value: form.board,
								options: BOARDS,
								onChange: set("board")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Current 11th/12th %",
								value: form.boardPercentage,
								onChange: set("boardPercentage"),
								placeholder: "e.g. 88.4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Entrance score / rank (optional)",
								value: form.examScore,
								onChange: set("examScore"),
								placeholder: "e.g. CUET 720"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Category",
								value: form.category,
								options: CATEGORIES,
								onChange: set("category")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Home city / state",
								value: form.cityState,
								onChange: set("cityState"),
								placeholder: "e.g. Jaipur, Rajasthan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Target admission year",
								value: form.targetYear,
								onChange: set("targetYear"),
								placeholder: "2027"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 rounded-full px-7",
						size: "lg",
						disabled: !ready || loading,
						onClick: submit,
						children: loading ? "Researching this college…" : "Analyze my chances"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
						children: error
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollegeReport, { result })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function CollegeReport({ result }) {
	const roadmap = result.personalized_roadmap;
	const phases = [
		roadmap.phase_1_immediate,
		roadmap.phase_2_near_term,
		roadmap.phase_3_application_prep,
		roadmap.phase_4_final_stretch
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rise mt-12 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-serif text-3xl",
							children: "Gap analysis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "eyebrow rounded-full border border-border px-3 py-1",
							children: ["Research confidence: ", result.research_confidence]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "display-serif mt-5 text-xl leading-snug",
						children: result.gap_analysis.gap_verdict
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "You",
								value: result.gap_analysis.your_percentage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Official cutoff",
								value: result.gap_analysis.official_cutoff
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Realistic cutoff",
								value: result.gap_analysis.realistic_cutoff_per_students
							})
						]
					}),
					result.gap_analysis.category_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: result.gap_analysis.category_note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: result.gap_analysis.honest_paragraph
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-serif text-3xl",
						children: "Reality check"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Reputation vs reality",
						body: result.college_reality_check.reputation_vs_reality
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Placements",
						body: result.college_reality_check.placement_reality
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Campus life",
						body: result.college_reality_check.campus_life_from_students
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-serif text-3xl",
						children: "Your roadmap"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: roadmap.months_available
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-4",
						children: phases.map((phase, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/70 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "eyebrow text-primary",
								children: [
									"Phase ",
									i + 1,
									" · ",
									phase.timeframe
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground",
								children: phase.actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, a))
							})]
						}, i))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-serif text-3xl",
						children: "Entrance exam strategy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Primary exam",
							value: result.entrance_exam_strategy.primary_exam
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Score needed",
							value: result.entrance_exam_strategy.score_this_college_needs
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Your readiness",
						body: result.entrance_exam_strategy.your_current_readiness
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Prep plan",
						body: result.entrance_exam_strategy.prep_recommendation
					})
				]
			}),
			result.free_certifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-serif text-3xl",
					children: "Free certifications that help here"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: result.free_certifications.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border/70 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									c.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["· ", c.platform]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: c.relevance_to_this_college
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Search: “",
									c.search_term_to_find_it,
									"” · ",
									c.time_commitment
								]
							})
						]
					}, c.name))
				})]
			}),
			result.backup_colleges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-serif text-3xl",
					children: "Strong backups"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: result.backup_colleges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border/70 p-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: b.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: b.why_strong_backup
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Likely cutoff for you: ",
									b.estimated_cutoff_for_you,
									" · ",
									b.honest_comparison
								]
							})
						]
					}, b.name))
				})]
			}),
			result.insider_tips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-shadow rounded-2xl border border-border bg-card p-7 sm:p-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-serif text-3xl",
					children: "Insider tips"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground",
					children: result.insider_tips.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-warning/40 bg-warning/5 p-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display-serif text-2xl",
					children: "The honest warning"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed",
					children: result.honest_warning
				})]
			}),
			result.sources_checked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border p-6 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Sources checked"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc space-y-1 pl-5",
						children: result.sources_checked.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3",
						children: result.data_freshness_note
					})
				]
			})
		]
	});
}
function Field({ label, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "eyebrow",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-2",
		value,
		placeholder,
		onChange: (e) => onChange(e.target.value)
	})] });
}
function Select({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "eyebrow",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
		children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o,
			children: o
		}, o))
	})] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 bg-background/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "eyebrow",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm font-semibold",
			children: value
		})]
	});
}
function Block({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 border-t border-border/70 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "eyebrow",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { CollegePage as component };
