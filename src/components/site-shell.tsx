import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Wordmark() {
  return (
    <Link to="/" className="group inline-flex items-baseline gap-2">
      <span className="font-display text-[1.0625rem] font-medium tracking-tight">
        NAAM NAHI PATA
      </span>
      <span className="eyebrow text-primary">TBD</span>
    </Link>
  );
}

export function SiteHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="border-b border-border/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-8">
        <Wordmark />
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">{right}</nav>
      </div>
    </header>
  );
}

export function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="link-underline hover:link-underline-hover pb-0.5 transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>NAAM NAHI PATA - guidance written the way a good senior would give it.</p>
        <p>Answers are researched live; always verify against official sources.</p>
      </div>
    </footer>
  );
}