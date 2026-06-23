import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getLessons, getSeries } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import type { Lesson, Series } from "@/lib/types";

export const Route = createFileRoute("/series/$slug")({
  component: () => (
    <RequireAuth>
      <SeriesPage />
    </RequireAuth>
  ),
});

function SeriesPage() {
  const { slug } = Route.useParams();
  const user = useCurrentUser();
  const [series, setSeries] = useState<Series | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    getSeries().then((list) => {
      const s = list.find((x) => x.slug === slug) ?? null;
      setSeries(s);
      if (s) getLessons(s.id).then(setLessons);
    });
  }, [slug]);

  if (!series) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)]">
        <SiteNav />
        <p className="px-6 py-20 text-center text-sm text-[var(--color-graphite)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-5 py-16 lg:px-8">
        <Link to="/library" className="text-xs uppercase tracking-[0.22em] text-[var(--color-graphite)] hover:text-[var(--color-ink)]">
          ← Library
        </Link>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
          {series.language.toUpperCase()} · {series.book_name}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)] md:text-5xl">
          {series.title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-graphite)]">
          {series.description}
        </p>

        <ol className="mt-10 flex flex-col gap-3">
          {lessons.map((l) => {
            const gated = l.is_supporter_only && user?.role !== "supporter" && user?.role !== "admin";
            return (
              <li key={l.id}>
                <Link
                  to="/watch/$lessonId"
                  params={{ lessonId: l.id }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-2)] px-5 py-4 transition-colors hover:border-[var(--color-ink)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-bold text-[var(--color-summit)]">{l.position.toString().padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{l.title}</p>
                      <p className="text-xs text-[var(--color-graphite)]">{l.runtime_min} min</p>
                    </div>
                  </div>
                  {gated && (
                    <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-paper)]">
                      Supporter
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
