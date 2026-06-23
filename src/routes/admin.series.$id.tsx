import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getLessons, getSeriesById } from "@/lib/api";
import type { Lesson, Series } from "@/lib/types";

export const Route = createFileRoute("/admin/series/$id")({
  component: () => (
    <RequireAuth allow={["admin"]}>
      <AdminSeriesDetailPage />
    </RequireAuth>
  ),
});

function AdminSeriesDetailPage() {
  const { id } = Route.useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getSeriesById(id), getLessons(id)]).then(([s, l]) => {
      setSeries(s);
      setLessons(l);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-5 py-16 lg:px-8">
        <Link
          to="/admin/series"
          className="text-xs uppercase tracking-[0.22em] text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
        >
          ← All series
        </Link>

        {loading ? (
          <p className="mt-10 text-sm text-[var(--color-graphite)]">Loading…</p>
        ) : !series ? (
          <h1 className="mt-10 font-display text-3xl font-bold text-[var(--color-ink)]">
            Series not found
          </h1>
        ) : (
          <>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
              {series.language.toUpperCase()} · {series.book_name} · {series.status}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
              {series.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-graphite)]">
              {series.description}
            </p>

            <section className="mt-12">
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">
                Lessons ({lessons.length})
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
                <table className="w-full text-sm">
                  <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
                    <tr>
                      <th className="px-4 py-3 w-16">#</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3 w-20">Min</th>
                      <th className="px-4 py-3 w-28">Access</th>
                      <th className="px-4 py-3 w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((l) => (
                      <tr key={l.id} className="border-t border-[var(--color-line)]">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--color-graphite)]">
                          {l.position.toString().padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">{l.title}</td>
                        <td className="px-4 py-3">{l.runtime_min}</td>
                        <td className="px-4 py-3">
                          {l.is_supporter_only ? (
                            <span className="rounded-full bg-[var(--color-summit)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-summit)]">
                              Supporter
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--color-graphite)]">Free</span>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize">{l.status}</td>
                      </tr>
                    ))}
                    {lessons.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-graphite)]">
                          No lessons yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[var(--color-graphite)]">
                Lesson editing comes next. For now, view-only.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
