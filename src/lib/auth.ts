import { useEffect, useState } from "react";
import { loadStore, mutateStore } from "./mockData";
import type { Profile, Role } from "./types";

const CHANGE_EVENT = "mockstore:change";

export async function signUp(name: string, email: string): Promise<Profile> {
  let created!: Profile;
  mutateStore((s) => {
    const existing = s.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      created = existing;
    } else {
      created = {
        id: `p_${Math.random().toString(36).slice(2, 9)}`,
        full_name: name,
        email,
        role: "member",
        created_at: new Date().toISOString(),
      };
      s.profiles.push(created);
    }
    s.session.profileId = created.id;
  });
  return created;
}

export async function signIn(email: string, _password: string): Promise<Profile | null> {
  let result: Profile | null = null;
  mutateStore((s) => {
    const found = s.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      s.session.profileId = found.id;
      result = found;
    }
  });
  return result;
}

export async function signOut(): Promise<void> {
  mutateStore((s) => {
    s.session.profileId = null;
  });
}

export function getCurrentUser(): Profile | null {
  const s = loadStore();
  if (!s.session.profileId) return null;
  return s.profiles.find((p) => p.id === s.session.profileId) ?? null;
}

/** Dev-only: switch session to first profile with role, or sign out. */
export function devViewAs(role: Role | "guest"): void {
  mutateStore((s) => {
    if (role === "guest") {
      s.session.profileId = null;
      return;
    }
    const target = s.profiles.find((p) => p.role === role);
    s.session.profileId = target?.id ?? null;
  });
}

export function useCurrentUser(): Profile | null {
  const [user, setUser] = useState<Profile | null>(() =>
    typeof window === "undefined" ? null : getCurrentUser(),
  );
  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}
