import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, n as NavLink, r as SiteFooter, t as Button } from "./button-COGY-sf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B6zIRum1.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
				to: "/career",
				children: "Career Finder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
				to: "/college",
				children: "College Analyzer"
			})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-5xl px-6 pt-20 pb-16 sm:px-8 sm:pt-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow rise",
							children: "For Indian students choosing after 12th"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "display-serif rise mt-6 max-w-3xl text-[2.75rem] sm:text-7xl",
							children: [
								"Honest career advice,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary italic",
									children: "not brochure talk."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid gap-10 border-t border-border/70 pt-8 sm:grid-cols-[1.15fr_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-lg leading-relaxed text-muted-foreground",
								children: "Two tools, both grounded in live research rather than guesswork. One finds the paths that genuinely fit you — jobs, business, freelancing or the family trade. The other tells you exactly where you stand against your dream college's real cutoff."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start gap-3 sm:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "rounded-full px-7",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/career",
										children: "Start the career quiz"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									className: "rounded-full px-7",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/college",
										children: "Analyze a college"
									})
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-5xl px-6 pb-4 sm:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid border-t border-border/70 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							index: "01",
							title: "Career Finder",
							to: "/career",
							cta: "Take the quiz",
							body: "A psychometric-style quiz written for Indian realities — family expectations, coaching culture, the passion versus stability pull. It ends with two matched paths, real INR earning bands, colleges within reach of your city and the three things to do next month."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							index: "02",
							title: "Dream College Analyzer",
							to: "/college",
							cta: "Check your chances",
							body: "Live reading across Reddit, Quora, official sites, news and review portals. You get the official cutoff and the realistic one students actually report, a blunt gap verdict, a four-phase roadmap, strong backups and one honest warning.",
							bordered: true
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-5xl px-6 py-16 sm:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 border-t border-border/70 pt-10 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
								k: "Researched, not recited",
								v: "Every answer is built on sources pulled at the moment you ask — cutoffs and salaries move every year."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
								k: "Written plainly",
								v: "No motivational filler. If a target is out of reach this year, you'll be told, along with what would change that."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Point, {
								k: "Beyond salaried jobs",
								v: "Business, freelancing, the creator route and family trade are weighed alongside conventional careers."
							})
						]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Feature({ index, title, body, to, cta, bordered }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `group flex flex-col py-10 sm:py-14 ${bordered ? "sm:border-l sm:border-border/70 sm:pl-10" : "sm:pr-10"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "eyebrow text-primary",
				children: index
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-serif mt-4 text-3xl sm:text-[2.25rem]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-sm leading-relaxed text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: "link-underline group-hover:link-underline-hover mt-6 self-start pb-0.5 text-sm font-medium",
				children: [cta, " →"]
			})
		]
	});
}
function Point({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "text-base font-medium",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm leading-relaxed text-muted-foreground",
		children: v
	})] });
}
//#endregion
export { Index as component };
