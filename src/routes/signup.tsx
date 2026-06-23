import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ContourBackdrop } from "@/components/ContourBackdrop";
import { signUp } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create your free account — Elevation Bible Study" },
      { name: "description", content: "Start watching the library free. No card required." },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/signup" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !email.trim() || password.length < 6) {
      setErr("Please fill every field. Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await signUp(name.trim(), email.trim());
      navigate({ to: redirect ?? "/library" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Begin the study — free."
      subtitle="No card required. The whole library opens the moment you finish."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Full name" value={name} onChange={setName} autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint="At least 6 characters."
        />
        {err && <p className="text-sm text-red-300">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)] disabled:opacity-60"
        >
          {busy ? "Creating account…" : "Create free account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--color-paper-2)]/70">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4 hover:text-[var(--color-paper)]">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-paper-2)]/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-[var(--color-paper)] placeholder:text-[var(--color-paper-2)]/40 focus:border-[var(--color-summit-2)] focus:outline-none"
      />
      {hint && <span className="text-xs text-[var(--color-paper-2)]/50">{hint}</span>}
    </label>
  );
}

function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-ink)] text-[var(--color-paper)]">
      <ContourBackdrop className="pointer-events-none absolute inset-0 h-full w-full opacity-40" variant="dark" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="mb-10 text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)]/60 hover:text-[var(--color-paper)]">
          ← Back to home
        </Link>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit-2)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-paper-2)]/75">{subtitle}</p>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}

export { AuthShell };
