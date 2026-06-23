import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getMembers, getSeries, getStats } from "@/lib/api";
import type { Profile, Series, Stats } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireAuth allow={["admin"]}>
      <AdminPage />
    </RequireAuth>
  ),
});

function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);

  useEffect(() => {
    getStats().then(setStats);
    getSeries().then(setSeries);
    getMembers().then(setMembers);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
          Admin
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
          Dashboard
        </h1>

        {stats && (
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            <Stat label="Series" value={stats.series_count} />
            <Stat label="Lessons" value={stats.lessons_count} />
            <Stat label="Members" value={stats.members_count} />
            <Stat label="Supporters" value={stats.supporters_count} />
          </div>
        )}

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Series</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Position</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => (
                  <tr key={s.id} className="border-t border-[var(--color-line)]">
                    <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">{s.title}</td>
                    <td className="px-4 py-3">{s.language.toUpperCase()}</td>
                    <td className="px-4 py-3">{s.status}</td>
                    <td className="px-4 py-3">{s.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Members</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-[var(--color-line)]">
                    <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">{m.full_name}</td>
                    <td className="px-4 py-3">{m.email}</td>
                    <td className="px-4 py-3 capitalize">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-graphite)]">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
