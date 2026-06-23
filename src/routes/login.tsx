import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AuthShell } from "./signup";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Log in — Elevation Bible Study" },
      { name: "description", content: "Welcome back. Pick up where you left off." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const user = await signIn(email.trim(), password);
      if (!user) {
        setErr("No account found with that email. Try creating one.");
        return;
      }
      navigate({ to: redirect ?? "/library" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in."
      subtitle="Pick up the next lesson where you left off."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-paper-2)]/60">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-[var(--color-paper)] placeholder:text-[var(--color-paper-2)]/40 focus:border-[var(--color-summit-2)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-paper-2)]/60">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-[var(--color-paper)] placeholder:text-[var(--color-paper-2)]/40 focus:border-[var(--color-summit-2)] focus:outline-none"
          />
        </label>
        {err && <p className="text-sm text-red-300">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--color-paper-2)]/70">
        New here?{" "}
        <Link to="/signup" className="underline underline-offset-4 hover:text-[var(--color-paper)]">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}
