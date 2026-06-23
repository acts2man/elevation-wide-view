import type { Lesson, Profile, Series } from "./types";

export const STORAGE_KEY = "elevation_mock_store_v1";

export interface MockStore {
  profiles: Profile[];
  series: Series[];
  lessons: Lesson[];
  session: { profileId: string | null };
}

const now = () => new Date().toISOString();

function seed(): MockStore {
  const profiles: Profile[] = [
    { id: "p_troy", full_name: "Troy", email: "Troy@reputationguardians.net", role: "admin", created_at: now() },
    { id: "p_admin", full_name: "Pastor Admin", email: "admin@elevation.test", role: "admin", created_at: now() },
    { id: "p_member1", full_name: "Sarah Johnson", email: "sarah@example.com", role: "member", created_at: now() },
    { id: "p_member2", full_name: "Marcus Lee", email: "marcus@example.com", role: "member", created_at: now() },
    { id: "p_supporter", full_name: "Hannah Reyes", email: "hannah@example.com", role: "supporter", created_at: now() },
  ];

  const series: Series[] = [
    {
      id: "s_romans",
      title: "Romans",
      slug: "romans",
      description: "Paul's masterwork on the gospel — sin, grace, faith, and the life of the Spirit, walked through verse by verse.",
      language: "en",
      book_name: "Romans",
      position: 1,
      status: "published",
      created_at: now(),
    },
    {
      id: "s_galatians",
      title: "Galatians",
      slug: "galatians",
      description: "Freedom in Christ versus a religion of rules. A short, fierce letter that reframes how the gospel actually works.",
      language: "en",
      book_name: "Galatians",
      position: 2,
      status: "published",
      created_at: now(),
    },
    {
      id: "s_revelation",
      title: "The Revelation & End-Times Series",
      slug: "revelation-end-times",
      description: "Every end-times passage placed in order so the whole picture reads clearly. No guesswork — just the text.",
      language: "en",
      book_name: "Revelation",
      position: 3,
      status: "draft",
      created_at: now(),
    },
  ];

  const lessons: Lesson[] = [
    // Romans
    {
      id: "l_rom_1", series_id: "s_romans", title: "Romans 1 — The Gospel Paul Was Not Ashamed Of",
      position: 1, youtube_id: "dQw4w9WgXcQ", runtime_min: 32,
      goal: "See why Paul opens with the gospel as the power of God — and what 'righteousness revealed' actually means.",
      description: "We walk verses 1–17 line by line, then survey the indictment that follows.",
      is_supporter_only: false, release_at: now(), outline_url: "", podcast_url: "",
      status: "published", created_at: now(),
    },
    {
      id: "l_rom_2", series_id: "s_romans", title: "Romans 2 — God's Righteous Judgment",
      position: 2, youtube_id: "dQw4w9WgXcQ", runtime_min: 28,
      goal: "Understand how Paul corners both moralist and pagan under the same verdict.",
      description: "Verse-by-verse through chapter 2 with cross-references to the prophets.",
      is_supporter_only: false, release_at: now(), outline_url: "", podcast_url: "",
      status: "published", created_at: now(),
    },
    {
      id: "l_rom_3", series_id: "s_romans", title: "Romans 3 — Justified by Faith",
      position: 3, youtube_id: "dQw4w9WgXcQ", runtime_min: 35,
      goal: "Trace the hinge of the whole letter: propitiation, faith, and the righteousness of God.",
      description: "Deep dive on 3:21–26 with the Greek vocabulary explained for everyone.",
      is_supporter_only: true, release_at: now(), outline_url: "", podcast_url: "",
      status: "published", created_at: now(),
    },
    // Galatians
    {
      id: "l_gal_1", series_id: "s_galatians", title: "Galatians 1 — No Other Gospel",
      position: 1, youtube_id: "dQw4w9WgXcQ", runtime_min: 27,
      goal: "Hear why Paul opens with shock instead of thanks — and what that means for us.",
      description: "Verses 1–24 with the historical backdrop of the Judaizers.",
      is_supporter_only: false, release_at: now(), outline_url: "", podcast_url: "",
      status: "published", created_at: now(),
    },
    {
      id: "l_gal_2", series_id: "s_galatians", title: "Galatians 2 — Paul Confronts Peter",
      position: 2, youtube_id: "dQw4w9WgXcQ", runtime_min: 30,
      goal: "Watch the apostles model what gospel integrity actually looks like.",
      description: "The Antioch incident and the doctrine of justification by faith.",
      is_supporter_only: false, release_at: now(), outline_url: "", podcast_url: "",
      status: "published", created_at: now(),
    },
    // Revelation (draft)
    {
      id: "l_rev_1", series_id: "s_revelation", title: "Revelation 1 — The Vision of the Risen Christ",
      position: 1, youtube_id: "dQw4w9WgXcQ", runtime_min: 33,
      goal: "Set the frame for the whole book: who is speaking, to whom, and why.",
      description: "Genre, structure, and the seven churches in their first-century setting.",
      is_supporter_only: false, release_at: now(), outline_url: "", podcast_url: "",
      status: "draft", created_at: now(),
    },
  ];

  return { profiles, series, lessons, session: { profileId: null } };
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadStore(): MockStore {
  if (!isBrowser()) return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as MockStore;
  } catch {
    const s = seed();
    return s;
  }
}

export function saveStore(store: MockStore) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetMockData(): MockStore {
  const s = seed();
  saveStore(s);
  if (isBrowser()) window.dispatchEvent(new Event("mockstore:change"));
  return s;
}

export function mutateStore(fn: (s: MockStore) => void): MockStore {
  const s = loadStore();
  fn(s);
  saveStore(s);
  if (isBrowser()) window.dispatchEvent(new Event("mockstore:change"));
  return s;
}
