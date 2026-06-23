import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import logoAsset from "@/assets/elevation-logo.png.asset.json";
import { signOut, useCurrentUser } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Studies", href: "/" },
  { label: "Revelation Series", href: "/" },
  { label: "Our Approach", href: "/" },
  { label: "Membership", href: "/" },
  { label: "About", href: "/" },
];

const LANGS = ["EN", "ES", "DE"] as const;
type Lang = (typeof LANGS)[number];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("EN");
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-paper)_85%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="Elevation Bible Study">
          <img src={logoAsset.url} alt="Elevation Bible Study" className="h-12 w-auto md:h-14" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="text-sm text-[var(--color-graphite)] transition-colors hover:text-[var(--color-ink)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitcher lang={lang} setLang={setLang} />
          {user ? <AccountMenu /> : <LoggedOutCTAs />}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-[var(--color-ink)]" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[var(--color-paper)]">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] p-5">
              <img src={logoAsset.url} alt="Elevation Bible Study" className="h-10 w-auto" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--color-paper-2)]"
              >
                <X className="h-5 w-5 text-[var(--color-ink)]" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[var(--color-line)] px-6 py-4 font-display text-2xl font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-summit)]"
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/library" onClick={() => setOpen(false)} className="border-b border-[var(--color-line)] px-6 py-4 font-display text-2xl font-semibold text-[var(--color-ink)]">
                    My Library
                  </Link>
                  <Link to="/account" onClick={() => setOpen(false)} className="border-b border-[var(--color-line)] px-6 py-4 font-display text-2xl font-semibold text-[var(--color-ink)]">
                    Account
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="border-b border-[var(--color-line)] px-6 py-4 font-display text-2xl font-semibold text-[var(--color-summit)]">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
            <div className="space-y-4 border-t border-[var(--color-line)] p-6">
              <LangSwitcher lang={lang} setLang={setLang} />
              {user ? (
                <MobileLogout onDone={() => setOpen(false)} />
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full whitespace-nowrap rounded-full border border-[var(--color-ink)] px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full whitespace-nowrap rounded-full bg-[var(--color-summit)] px-5 py-3 text-center text-sm font-medium text-white"
                  >
                    Begin the study
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

function LoggedOutCTAs() {
  return (
    <>
      <Link
        to="/login"
        className="text-sm font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-summit)]"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="w-fit whitespace-nowrap rounded-full bg-[var(--color-summit)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-summit-ink)]"
      >
        Begin the study
      </Link>
    </>
  );
}

function AccountMenu() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  async function handleLogout() {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <>
      {user.role === "admin" && (
        <Link
          to="/admin"
          className="rounded-full border border-[var(--color-summit)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-summit)] hover:bg-[var(--color-summit)] hover:text-white"
        >
          Admin
        </Link>
      )}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
        >
          {user.full_name.split(" ")[0]}
          <ChevronDown size={14} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] shadow-lg">
            <Link to="/library" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">
              My Library
            </Link>
            <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">
              Account
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full border-t border-[var(--color-line)] px-4 py-3 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function MobileLogout({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  async function handle() {
    await signOut();
    onDone();
    navigate({ to: "/" });
  }
  return (
    <button
      onClick={handle}
      className="block w-full whitespace-nowrap rounded-full border border-[var(--color-ink)] px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)]"
    >
      Log out
    </button>
  );
}

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] p-1">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            lang === l
              ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
              : "text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default SiteNav;
