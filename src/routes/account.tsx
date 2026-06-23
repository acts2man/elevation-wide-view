import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { signOut, useCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  component: () => (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  ),
});

function AccountPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  async function onSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
          Account
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
          {user.full_name}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--color-graphite)]">{user.email}</p>

        <dl className="mt-10 grid gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)] p-6 sm:grid-cols-2">
          <Row label="Membership" value={user.role === "supporter" ? "Supporter" : user.role === "admin" ? "Admin" : "Free member"} />
          <Row label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
        </dl>

        <button
          onClick={onSignOut}
          className="mt-8 inline-flex w-fit items-center whitespace-nowrap rounded-md border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          Log out
        </button>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-graphite)]">{label}</dt>
      <dd className="mt-1 font-display text-lg font-semibold text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}
