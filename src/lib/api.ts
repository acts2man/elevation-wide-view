import { loadStore, mutateStore } from "./mockData";
import type { Language, Lesson, Profile, Role, Series, Stats, Status } from "./types";

// Simulate async DB. Keep tiny so UI feels instant.
const tick = <T,>(value: T): Promise<T> => Promise.resolve(value);

const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;

// ---------- Stats ----------
export async function getStats(): Promise<Stats> {
  const s = loadStore();
  const published = s.series.filter((x) => x.status === "published");
  const langs = Array.from(new Set(published.map((x) => x.language))) as Language[];
  return tick({
    series_count: published.length,
    lessons_count: s.lessons.filter((l) => l.status === "published").length,
    members_count: s.profiles.filter((p) => p.role === "member").length,
    supporters_count: s.profiles.filter((p) => p.role === "supporter").length,
    languages: langs,
  });
}

// ---------- Series ----------
export interface SeriesFilter {
  language?: Language;
  status?: Status;
  search?: string;
}

export async function getSeries(filter?: SeriesFilter): Promise<Series[]> {
  const s = loadStore();
  let list = [...s.series];
  if (filter?.language) list = list.filter((x) => x.language === filter.language);
  if (filter?.status) list = list.filter((x) => x.status === filter.status);
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((x) => x.title.toLowerCase().includes(q) || x.book_name.toLowerCase().includes(q));
  }
  list.sort((a, b) => a.position - b.position);
  return tick(list);
}

export async function getSeriesById(id: string): Promise<Series | null> {
  const s = loadStore();
  return tick(s.series.find((x) => x.id === id) ?? null);
}

export async function createSeries(
  input: Omit<Series, "id" | "created_at" | "position"> & { position?: number },
): Promise<Series> {
  let created!: Series;
  mutateStore((s) => {
    created = {
      ...input,
      id: uid("s"),
      position: input.position ?? s.series.length + 1,
      created_at: new Date().toISOString(),
    };
    s.series.push(created);
  });
  return tick(created);
}

export async function updateSeries(id: string, patch: Partial<Series>): Promise<Series | null> {
  let result: Series | null = null;
  mutateStore((s) => {
    const idx = s.series.findIndex((x) => x.id === id);
    if (idx >= 0) {
      s.series[idx] = { ...s.series[idx], ...patch, id };
      result = s.series[idx];
    }
  });
  return tick(result);
}

export async function deleteSeries(id: string): Promise<void> {
  mutateStore((s) => {
    s.series = s.series.filter((x) => x.id !== id);
    s.lessons = s.lessons.filter((l) => l.series_id !== id);
  });
  return tick();
}

export async function reorderSeries(orderedIds: string[]): Promise<void> {
  mutateStore((s) => {
    orderedIds.forEach((id, i) => {
      const t = s.series.find((x) => x.id === id);
      if (t) t.position = i + 1;
    });
  });
  return tick();
}

// ---------- Lessons ----------
export async function getLessons(seriesId: string): Promise<Lesson[]> {
  const s = loadStore();
  return tick(s.lessons.filter((l) => l.series_id === seriesId).sort((a, b) => a.position - b.position));
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const s = loadStore();
  return tick(s.lessons.find((l) => l.id === id) ?? null);
}

export async function createLesson(
  input: Omit<Lesson, "id" | "created_at" | "position"> & { position?: number },
): Promise<Lesson> {
  let created!: Lesson;
  mutateStore((s) => {
    const siblings = s.lessons.filter((l) => l.series_id === input.series_id);
    created = {
      ...input,
      id: uid("l"),
      position: input.position ?? siblings.length + 1,
      created_at: new Date().toISOString(),
    };
    s.lessons.push(created);
  });
  return tick(created);
}

export async function updateLesson(id: string, patch: Partial<Lesson>): Promise<Lesson | null> {
  let result: Lesson | null = null;
  mutateStore((s) => {
    const idx = s.lessons.findIndex((l) => l.id === id);
    if (idx >= 0) {
      s.lessons[idx] = { ...s.lessons[idx], ...patch, id };
      result = s.lessons[idx];
    }
  });
  return tick(result);
}

export async function deleteLesson(id: string): Promise<void> {
  mutateStore((s) => {
    s.lessons = s.lessons.filter((l) => l.id !== id);
  });
  return tick();
}

export async function reorderLessons(seriesId: string, orderedIds: string[]): Promise<void> {
  mutateStore((s) => {
    orderedIds.forEach((id, i) => {
      const l = s.lessons.find((x) => x.id === id && x.series_id === seriesId);
      if (l) l.position = i + 1;
    });
  });
  return tick();
}

// ---------- Members ----------
export async function getMembers(search?: string): Promise<Profile[]> {
  const s = loadStore();
  let list = [...s.profiles];
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((p) => p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  }
  return tick(list);
}

export async function updateMemberRole(id: string, role: Role): Promise<Profile | null> {
  let result: Profile | null = null;
  mutateStore((s) => {
    const p = s.profiles.find((x) => x.id === id);
    if (p) {
      p.role = role;
      result = p;
    }
  });
  return tick(result);
}
