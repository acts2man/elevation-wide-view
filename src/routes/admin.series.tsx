import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import {
  createSeries,
  deleteSeries,
  getLessons,
  getSeries,
  reorderSeries,
  updateSeries,
} from "@/lib/api";
import type { Language, Series, Status } from "@/lib/types";

export const Route = createFileRoute("/admin/series")({
  component: () => (
    <RequireAuth allow={["admin"]}>
      <AdminSeriesPage />
    </RequireAuth>
  ),
});

const LANGS: Language[] = ["en", "es", "de"];
const STATUSES: Status[] = ["draft", "published"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  title: string;
  slug: string;
  description: string;
  language: Language;
  book_name: string;
  status: Status;
};

const EMPTY: FormState = {
  title: "",
  slug: "",
  description: "",
  language: "en",
  book_name: "",
  status: "draft",
};

function AdminSeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Series | "new" | null>(null);

  async function refresh() {
    const list = await getSeries();
    setSeries(list);
    const entries = await Promise.all(
      list.map(async (s) => [s.id, (await getLessons(s.id)).length] as const),
    );
    setCounts(Object.fromEntries(entries));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function move(id: string, dir: -1 | 1) {
    const ids = series.map((s) => s.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await reorderSeries(ids);
    refresh();
  }

  async function onDelete(s: Series) {
    if (!window.confirm(`Delete "${s.title}" and all its lessons? This cannot be undone.`)) return;
    await deleteSeries(s.id);
    refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
              Admin · Library
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Series
            </h1>
            <p className="mt-2 text-sm text-[var(--color-graphite)]">
              {series.length} {series.length === 1 ? "series" : "series"} · ordered top-to-bottom.
            </p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] hover:bg-[var(--color-summit)]"
          >
            <Plus size={16} /> New series
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
              <tr>
                <th className="px-4 py-3 w-20">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 w-20">Lang</th>
                <th className="px-4 py-3 w-24">Lessons</th>
                <th className="px-4 py-3 w-28">Status</th>
                <th className="px-4 py-3 w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s, idx) => (
                <tr key={s.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => move(s.id, -1)}
                        disabled={idx === 0}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)] text-[var(--color-graphite)] hover:bg-[var(--color-paper)] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => move(s.id, 1)}
                        disabled={idx === series.length - 1}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)] text-[var(--color-graphite)] hover:bg-[var(--color-paper)] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/series/$id"
                      params={{ id: s.id }}
                      className="font-display text-base font-semibold text-[var(--color-ink)] hover:text-[var(--color-summit)]"
                    >
                      {s.title}
                    </Link>
                    <p className="text-xs text-[var(--color-graphite)]">/{s.slug}</p>
                  </td>
                  <td className="px-4 py-3 uppercase">{s.language}</td>
                  <td className="px-4 py-3">{counts[s.id] ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        s.status === "published"
                          ? "bg-[var(--color-summit)]/15 text-[var(--color-summit)]"
                          : "bg-[var(--color-line)] text-[var(--color-graphite)]"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(s)}
                      className="mr-2 inline-flex items-center gap-1 rounded-md border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {series.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--color-graphite)]">
                    No series yet. Click "New series" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {editing && (
        <SeriesFormDrawer
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function SeriesFormDrawer({
  initial,
  onClose,
  onSaved,
}: {
  initial: Series | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          slug: initial.slug,
          description: initial.description,
          language: initial.language,
          book_name: initial.book_name,
          status: initial.status,
        }
      : EMPTY,
  );
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onTitle(v: string) {
    set("title", v);
    if (!slugTouched) set("slug", slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.book_name.trim()) return;
    setBusy(true);
    try {
      if (initial) {
        await updateSeries(initial.id, form);
      } else {
        await createSeries(form);
      }
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-[var(--color-paper)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
              {initial ? "Edit series" : "New series"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--color-ink)]">
              {initial ? initial.title : "Add a new series"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--color-paper-2)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
              required
            />
          </Field>
          <Field label="Slug" hint="Used in the URL. Lowercase, dash-separated.">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 font-mono text-[14px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
              required
            />
          </Field>
          <Field label="Book name">
            <input
              value={form.book_name}
              onChange={(e) => set("book_name", e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Language">
              <select
                value={form.language}
                onChange={(e) => set("language", e.target.value as Language)}
                className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
              >
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as Status)}
                className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] capitalize text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--color-line)] p-5">
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--color-line)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={busy}
            className="rounded-md bg-[var(--color-summit)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] hover:bg-[var(--color-summit-2)] disabled:opacity-60"
          >
            {busy ? "Saving…" : initial ? "Save changes" : "Create series"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-graphite)]">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-[var(--color-graphite)]">{hint}</span>}
    </label>
  );
}
