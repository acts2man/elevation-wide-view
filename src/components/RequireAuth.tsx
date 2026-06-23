import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/auth";
import type { Role } from "@/lib/types";

interface Props {
  children: ReactNode;
  allow?: Role[]; // if omitted, any signed-in user is allowed
  redirectTo?: string;
}

/** Mock-auth client-side route guard. Renders nothing while redirecting. */
export function RequireAuth({ children, allow, redirectTo = "/login" }: Props) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const allowed = user && (!allow || allow.includes(user.role));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) {
      navigate({ to: redirectTo, search: { redirect: window.location.pathname } as never });
    } else if (allow && !allow.includes(user.role)) {
      navigate({ to: "/library" });
    }
  }, [user, allow, redirectTo, navigate]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-6 text-center">
        <p className="text-sm text-[var(--color-graphite)]">Checking access…</p>
      </div>
    );
  }
  return <>{children}</>;
}
