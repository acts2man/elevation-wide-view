import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getSeriesById,
  reorderLessons,
  updateLesson,
} from "@/lib/api";
import type { Lesson, Series, Status } from "@/lib/types";

export const Route = createFileRoute("/admin/series/$id")({
  component: () => (
    <RequireAuth allow={["admin"]}>
      <AdminSeriesDetailPage />
    </RequireAuth>
  ),
});

const STATUSES: Status[] = ["draft", "published"];

type FormState = {
  title: string;
  youtube_id: string;
  runtime_min: number;
  goal: string;
  description: string;
  is_supporter_only: boolean;
  release_at: string; // datetime-local "YYYY-MM-DDTHH:mm" or ""
  outline_url: string;
  podcast_url: string;
  status: Status;
};

const EMPTY: FormState = {
  title: "",
  youtube_id: "",
  runtime_min: 30,
  goal: "",
  description: "",
  is_supporter_only: false,
  release_at: "",
  outline_url: "",
  podcast_url: "",
  status: "draft",
};

/** Accept either raw 11-char id or a YouTube URL; return raw id. */
function extractYoutubeId(input: string): string {
  const v = input.trim();
  const m = v.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return (m ? m[1] : v).slice(0, 32);
}

function AdminSeriesDetailPage() {
  const { id } = Route.useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lesson | "new" | null>(null);

  async function refresh() {
    const [s, l] = await Promise.all([getSeriesById(id), getLessons(id)]);
    setSeries(s);
    setLessons(l);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function move(lessonId: string, dir: -1 | 1) {
    const ids = lessons.map((l) => l.id);
    const i = ids.indexOf(lessonId);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await reorderLessons(id, ids);
    refresh();
  }

  async function onDelete(l: Lesson) {
    if (!window.confirm(`Delete "${l.title}"? This cannot be undone.`)) return;
    await deleteLesson(l.id);
    refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-16 lg:px-8">
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
            <div className="mt-6 flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
                  {series.language.toUpperCase()} · {series.book_name} · {series.status}
                </p>
                <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
                  {series.title}
                </h1>
                <p className="mt-2 text-sm text-[var(--color-graphite)]">
                  {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} · ordered top-to-bottom.
                </p>
              </div>
              <button
                onClick={() => setEditing("new")}
                className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] hover:bg-[var(--color-summit)]"
              >
                <Plus size={16} /> New lesson
              </button>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]">
              <table className="w-full text-sm">
                <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-[var(--color-graphite)]">
                  <tr>
                    <th className="px-4 py-3 w-20">Order</th>
                    <th className="px-4 py-3 w-14">#</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3 w-20">Min</th>
                    <th className="px-4 py-3 w-28">Access</th>
                    <th className="px-4 py-3 w-28">Status</th>
                    <th className="px-4 py-3 w-40">Release</th>
                    <th className="px-4 py-3 w-40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l, idx) => (
                    <tr key={l.id} className="border-t border-[var(--color-line)] align-top">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => move(l.id, -1)}
                            disabled={idx === 0}
                            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)] text-[var(--color-graphite)] hover:bg-[var(--color-paper)] disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => move(l.id, 1)}
                            disabled={idx === lessons.length - 1}
                            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-line)] text-[var(--color-graphite)] hover:bg-[var(--color-paper)] disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--color-graphite)]">
                        {l.position.toString().padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-display text-base font-semibold text-[var(--color-ink)]">{l.title}</p>
                        {l.goal && <p className="mt-1 max-w-md text-xs text-[var(--color-graphite)] line-clamp-2">{l.goal}</p>}
                      </td>
                      <td className="px-4 py-3">{l.runtime_min}</td>
                      <td className="px-4 py-3">
                        {l.is_supporter_only ? (
                          <span className="rounded-full bg-[var(--color-summit)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-summit)]">
                            Supporter
                          </span>
                        ) : (
                          <span className="rounded-full bg-[var(--color-line)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-graphite)]">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize">{l.status}</td>
                      <td className="px-4 py-3 text-xs text-[var(--color-graphite)]">
                        {l.release_at ? new Date(l.release_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditing(l)}
                          className="mr-2 inline-flex items-center gap-1 rounded-md border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(l)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lessons.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-[var(--color-graphite)]">
                        No lessons yet. Click "New lesson" to add the first one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {editing && series && (
        <LessonFormDrawer
          seriesId={series.id}
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

function toInputDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function LessonFormDrawer({
  seriesId,
  initial,
  onClose,
  onSaved,
}: {
  seriesId: string;
  initial: Lesson | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          youtube_id: initial.youtube_id,
          runtime_min: initial.runtime_min,
          goal: initial.goal,
          description: initial.description,
          is_supporter_only: initial.is_supporter_only,
          release_at: toInputDate(initial.release_at),
          outline_url: initial.outline_url,
          podcast_url: initial.podcast_url,
          status: initial.status,
        }
      : EMPTY,
  );
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const thumb = useMemo(() => {
    const ytId = extractYoutubeId(form.youtube_id);
    return ytId.length >= 6 ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "";
  }, [form.youtube_id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      const payload = {
        ...form,
        youtube_id: extractYoutubeId(form.youtube_id),
        runtime_min: Number(form.runtime_min) || 0,
        release_at: form.release_at ? new Date(form.release_at).toISOString() : "",
      };
      if (initial) {
        await updateLesson(initial.id, payload);
      } else {
        await createLesson({ series_id: seriesId, ...payload });
      }
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-[var(--color-paper)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
              {initial ? "Edit lesson" : "New lesson"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--color-ink)]">
              {initial ? initial.title : "Add a new lesson"}
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
              onChange={(e) => set("title", e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="YouTube video ID" hint="Paste the part after watch?v= — or paste the full URL and we'll extract it.">
            <input
              value={form.youtube_id}
              onChange={(e) => set("youtube_id", e.target.value)}
              placeholder="dQw4w9WgXcQ"
              className={`${inputCls} font-mono text-[14px]`}
            />
          </Field>

          {thumb && (
            <div className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-ink)]">
              <img
                src={thumb}
                alt="YouTube thumbnail preview"
                className="aspect-video w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Runtime (minutes)">
              <input
                type="number"
                min={1}
                value={form.runtime_min}
                onChange={(e) => set("runtime_min", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as Status)}
                className={`${inputCls} capitalize`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Goal" hint="What the viewer walks away with.">
            <textarea
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputCls}
            />
          </Field>

          <div className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-[var(--color-paper-2)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">Supporter-only</p>
              <p className="text-xs text-[var(--color-graphite)]">
                Free members will see a gated preview.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.is_supporter_only}
              onClick={() => set("is_supporter_only", !form.is_supporter_only)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                form.is_supporter_only ? "bg-[var(--color-summit)]" : "bg-[var(--color-line)]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.is_supporter_only ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <Field label="Early-access release" hint="Optional. Leave blank to release immediately.">
            <input
              type="datetime-local"
              value={form.release_at}
              onChange={(e) => set("release_at", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Outline PDF URL" hint="Filename or URL. Real upload comes with Supabase.">
            <input
              value={form.outline_url}
              onChange={(e) => set("outline_url", e.target.value)}
              placeholder="romans-1-outline.pdf"
              className={inputCls}
            />
          </Field>

          <Field label="Podcast URL" hint="Optional audio episode link.">
            <input
              value={form.podcast_url}
              onChange={(e) => set("podcast_url", e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--color-line)] p-5">
          <button
            type="button"
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
            {busy ? "Saving…" : initial ? "Save changes" : "Create lesson"}
          </button>
        </div>
      </aside>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-[15px] text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none";

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
