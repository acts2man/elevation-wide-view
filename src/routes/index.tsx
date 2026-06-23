import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContourBackdrop } from "@/components/ContourBackdrop";
import { VennMark } from "@/components/VennMark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elevation Bible Study — The Thousand-Foot View" },
      {
        name: "description",
        content:
          "A membership Bible study taking a wide-angle view of Scripture — clarity, context, and a legally trained mind.",
      },
      { property: "og:title", content: "Elevation Bible Study" },
      {
        property: "og:description",
        content: "The Thousand-Foot View — membership Bible study.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { value: "9+", label: "Books" },
  { value: "120+", label: "Lessons" },
  { value: "EN · ES · DE", label: "Languages" },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <SiteNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-paper)]">
          <ContourBackdrop
            className="pointer-events-none absolute inset-0 h-full w-full"
            variant="dark"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-ink)]/60" />

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 py-20 md:py-28 lg:grid-cols-5 lg:gap-16 lg:px-8">
            {/* Right card — appears first on mobile, right column on desktop */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md sm:p-8">
                <div className="flex items-center justify-center rounded-xl bg-[var(--color-ink-2)]/60 px-6 py-10">
                  <VennMark
                    className="h-44 w-auto text-[var(--color-paper)]"
                    labelColor="rgba(247,246,242,0.55)"
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-paper)] sm:text-3xl">
                        {s.value}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-brand-muted)]">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Left content */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit-2)]">
                Elevation Bible Study · The Thousand-Foot View
              </p>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-[var(--color-paper)] md:text-6xl lg:text-7xl">
                Step back, and Scripture{" "}
                <span className="text-[var(--color-summit-2)]">
                  snaps into focus.
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-paper-2)]/80">
                Most Bible teaching zooms into a single verse and loses the
                thread. Elevation gives you the wide-angle view — book by book,
                in order, in context — until the whole picture finally comes
                together.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)]"
                >
                  Begin the study — free <span aria-hidden>→</span>
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-[var(--color-paper)] transition-colors hover:bg-white/5"
                >
                  <span aria-hidden>▶</span> Watch the 2-min trailer
                </a>
              </div>

              <p className="mt-10 font-scripture text-base italic text-[var(--color-brand-muted)]">
                “Rightly dividing the word of truth.”{" "}
                <span className="not-italic">— 2 Timothy 2:15</span>
              </p>
            </div>
          </div>
        </section>

        <WhyExistsSection />
        <ApproachSection />
      </main>
      <SiteFooter />
    </div>
  );
}
