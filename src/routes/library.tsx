import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getSeries } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import type { Series } from "@/lib/types";

export const Route = createFileRoute("/library")({
  component: () => (
    <RequireAuth>
      <LibraryPage />
    </RequireAuth>
  ),
});

function LibraryPage() {
  const user = useCurrentUser();
  const [series, setSeries] = useState<Series[]>([]);
  useEffect(() => {
    getSeries({ status: "published" }).then(setSeries);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
          My library
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)] md:text-5xl">
          Welcome back, {user?.full_name.split(" ")[0]}.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-graphite)]">
          Pick a book and start the next lesson. Everything plays in order.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <Link
              key={s.id}
              to="/series/$slug"
              params={{ slug: s.slug }}
              className="group rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)] p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
                {s.language.toUpperCase()} · {s.book_name}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-graphite)]">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
