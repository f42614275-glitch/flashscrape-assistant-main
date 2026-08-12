import { Link, createFileRoute } from "@tanstack/react-router";

import { NavLink, SiteFooter, SiteHeader } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAAM NAHI PATA — Honest AI career guidance after 12th" },
      {
        name: "description",
        content:
          "Find the career that actually fits you and get a real admission roadmap for your dream Indian college. Built for 12th-grade students.",
      },
      { property: "og:title", content: "NAAM NAHI PATA — Honest AI career guidance after 12th" },
      {
        property: "og:description",
        content:
          "Find the career that actually fits you and get a real admission roadmap for your dream Indian college.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="paper min-h-screen">
      <SiteHeader
        right={
          <>
            <NavLink to="/career">Career Finder</NavLink>
            <NavLink to="/college">College Analyzer</NavLink>
          </>
        }
      />

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:px-8 sm:pt-28">
          <p className="eyebrow rise">For Indian students choosing after 12th</p>
          <h1 className="display-serif rise mt-6 max-w-3xl text-[2.75rem] sm:text-7xl">
            Honest career advice,
            <br />
            <span className="text-primary italic">not brochure talk.</span>
          </h1>
          <div className="mt-10 grid gap-10 border-t border-border/70 pt-8 sm:grid-cols-[1.15fr_1fr]">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Two tools, both grounded in live research rather than guesswork. One finds the paths
              that genuinely fit you — jobs, business, freelancing or the family trade. The other
              tells you exactly where you stand against your dream college's real cutoff.
            </p>
            <div className="flex flex-wrap items-start gap-3 sm:justify-end">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/career">Start the career quiz</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/college">Analyze a college</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-4 sm:px-8">
          <div className="grid border-t border-border/70 sm:grid-cols-2">
            <Feature
              index="01"
              title="Career Finder"
              to="/career"
              cta="Take the quiz"
              body="A psychometric-style quiz written for Indian realities — family expectations, coaching culture, the passion versus stability pull. It ends with two matched paths, real INR earning bands, colleges within reach of your city and the three things to do next month."
            />
            <Feature
              index="02"
              title="Dream College Analyzer"
              to="/college"
              cta="Check your chances"
              body="Live reading across Reddit, Quora, official sites, news and review portals. You get the official cutoff and the realistic one students actually report, a blunt gap verdict, a four-phase roadmap, strong backups and one honest warning."
              bordered
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
          <div className="grid gap-8 border-t border-border/70 pt-10 sm:grid-cols-3">
            <Point k="Researched, not recited" v="Every answer is built on sources pulled at the moment you ask — cutoffs and salaries move every year." />
            <Point k="Written plainly" v="No motivational filler. If a target is out of reach this year, you'll be told, along with what would change that." />
            <Point k="Beyond salaried jobs" v="Business, freelancing, the creator route and family trade are weighed alongside conventional careers." />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Feature({
  index,
  title,
  body,
  to,
  cta,
  bordered,
}: {
  index: string;
  title: string;
  body: string;
  to: string;
  cta: string;
  bordered?: boolean;
}) {
  return (
    <article
      className={`group flex flex-col py-10 sm:py-14 ${bordered ? "sm:border-l sm:border-border/70 sm:pl-10" : "sm:pr-10"}`}
    >
      <span className="eyebrow text-primary">{index}</span>
      <h2 className="display-serif mt-4 text-3xl sm:text-[2.25rem]">{title}</h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Link
        to={to}
        className="link-underline group-hover:link-underline-hover mt-6 self-start pb-0.5 text-sm font-medium"
      >
        {cta} →
      </Link>
    </article>
  );
}

function Point({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <h3 className="text-base font-medium">{k}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v}</p>
    </div>
  );
}
