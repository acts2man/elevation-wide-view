import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getMembers, updateMemberRole } from "@/lib/api";
import type { Profile, Role } from "@/lib/types";

export const Route = createFileRoute("/admin/members")({
  component: () => (
    <RequireAuth allow={["admin"]}>
      <AdminMembersPage />
    </RequireAuth>
  ),
});

type Filter = "all" | "member" | "supporter" | "admin";

const ROLES: Role[] = ["member", "supporter", "admin"];

const ROLE_STYLES: Record<Role, string> = {
  member: "bg-[var(--color-line)] text-[var(--color-graphite)]",
  supporter: "bg-[var(--color-summit)]/15 text-[var(--color-summit)]",
  admin: "bg-[var(--color-ink)] text-[var(--color-paper)]",
};

function AdminMembersPage() {
  const [people, setPeople] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function refresh() {
    setPeople(await getMembers());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people.filter((p) => {
      if (filter !== "all" && p.role !== filter) return false;
      if (!term) return true;
      return p.full_name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term);
    });
  }, [people, q, filter]);

  async function onRoleChange(p: Profile, role: Role) {
    if (role === p.role) return;
    setSavingId(p.id);
    try {
      await updateMemberRole(p.id, role);
      await refresh();
    } finally {
      setSavingId(null);
    }
  }

  function exportCsv() {
    const rows = [["Name", "Email", "Tier"]];
    for (const p of people) rows.push([p.full_name, p.email, p.role]);
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elevation-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const counts = useMemo(() => {
    const c = { all: people.length, member: 0, supporter: 0, admin: 0 };
    for (const p of people) c[p.role]++;
    return c;
  }, [people]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
              Admin · People
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Members
            </h1>
            <p className="mt-2 text-sm text-[var(--color-graphite)]">
              {counts.all} total · {counts.member} free · {counts.supporter} supporters · {counts.admin} admins
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
          >
            <Download size={16} /> Export emails (CSV)
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-graphite)]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper-2)] py-2.5 pl-9 pr-3 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
            />
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-2)] p-1">
            {(["all", "supporter", "member", "admin"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  filter === f
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
                }`}
              >
                {f === "all" ? "All" : f === "member" ? "Free" : f === "supporter" ? "Supporters" : "Admins"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 w-32">Tier</th>
                <th className="px-4 py-3 w-40">Joined</th>
                <th className="px-4 py-3 w-44">Change tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-3 font-display text-base font-semibold text-[var(--color-ink)]">
                    {p.full_name}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-graphite)]">{p.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${ROLE_STYLES[p.role]}`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-graphite)]">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.role}
                      disabled={savingId === p.id}
                      onChange={(e) => onRoleChange(p, e.target.value as Role)}
                      className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-2.5 py-1.5 text-xs font-medium capitalize text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[var(--color-graphite)]">
                    No members match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-[var(--color-graphite)]">
          Tier changes save immediately. Until payments are live, granting "supporter" here is how access is unlocked.
        </p>
      </main>
    </div>
  );
}
