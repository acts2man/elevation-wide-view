export type Role = "admin" | "member" | "supporter";
export type Language = "en" | "es" | "de";
export type Status = "draft" | "published";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: Language;
  book_name: string;
  position: number;
  status: Status;
  created_at: string;
}

export interface Lesson {
  id: string;
  series_id: string;
  title: string;
  position: number;
  youtube_id: string;
  runtime_min: number;
  goal: string;
  description: string;
  is_supporter_only: boolean;
  release_at: string;
  outline_url: string;
  podcast_url: string;
  status: Status;
  created_at: string;
}

export interface Stats {
  series_count: number;
  lessons_count: number;
  members_count: number;
  supporters_count: number;
  languages: Language[];
}
