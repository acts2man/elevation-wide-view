import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Youtube, Check } from "lucide-react";
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
        <StudyLibrarySection />
      </main>
      <SiteFooter />
    </div>
  );
}

const PAINS = [
  {
    pain: "I get lost in the details.",
    outcome: "See how every book connects.",
    body: "Each book has one overarching theme. Once you see it, individual passages stay in context — and they make sense.",
  },
  {
    pain: "End-times debates lose me.",
    outcome: "Watch prophecy fall into order.",
    body: "Lay every passage out in sequence and the puzzle snaps together. No internet speculation — just the text, rightly divided.",
  },
  {
    pain: "My faith feels shakeable.",
    outcome: "Build a foundation that holds.",
    body: "When you understand what God is doing and why, you're not easily moved. Clarity drives you closer to Him, not further.",
  },
];

function WhyExistsSection() {
  return (
    <section className="relative bg-[var(--color-paper)] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="max-w-4xl">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit)]">
            Why this study exists
          </p>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl lg:text-6xl">
            You don't need a seminary degree to understand the Bible. You need
            the right{" "}
            <span className="text-[var(--color-summit)]">altitude.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PAINS.map((c) => (
            <div
              key={c.outcome}
              className="flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]/40 p-7"
            >
              <p className="font-scripture text-base italic text-[var(--color-brand-muted)] line-through decoration-[var(--color-brand-muted)]/60">
                “{c.pain}”
              </p>
              <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
                Instead, you'll
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                {c.outcome}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-graphite)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    n: "01",
    title: "Context first",
    body: "Read each passage inside the argument it belongs to, not as a stand-alone fragment.",
  },
  {
    n: "02",
    title: "Proper order of events",
    body: "Lay the timeline out in sequence and the bigger picture becomes clear.",
  },
  {
    n: "03",
    title: "Scripture with Scripture",
    body: "Let the Bible interpret itself before reaching for outside theory.",
  },
  {
    n: "04",
    title: "History & culture",
    body: "Understand who was being written to, and why it mattered then.",
  },
  {
    n: "05",
    title: "Original language",
    body: "Go to the Greek and Hebrew where the wording actually changes the meaning.",
  },
  {
    n: "06",
    title: "Teaching vs. speculation",
    body: "Where something is uncertain, we say so plainly. Clarity over sensationalism.",
  },
];

function ApproachSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] py-24 text-[var(--color-paper)] md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit-2)]">
          Our Approach · A Legally Trained Mind
        </p>
        <div className="mt-6 h-px w-full bg-white/10" />

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-paper)] md:text-5xl">
              We read Scripture like the{" "}
              <span className="text-[var(--color-summit-2)]">
                evidence it is.
              </span>
            </h2>
            <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-[var(--color-paper-2)]/80">
              You may not agree with every conclusion — and that's fine. What
              matters is that you can see exactly how each one was reached,
              using the same plain rules of interpretation. Open your Bible and
              check the work.
            </p>
            <a
              href="/"
              className="mt-10 inline-flex items-center gap-2 border-b border-[var(--color-summit-2)]/60 pb-1 font-sans text-sm font-medium text-[var(--color-summit-2)] transition-colors hover:text-[var(--color-paper)] hover:border-[var(--color-paper)]"
            >
              Start with Interpretation 101 <span aria-hidden>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="flex flex-col gap-3 bg-[var(--color-ink)] p-7"
              >
                <span className="font-display text-xs font-bold tracking-[0.18em] text-[var(--color-summit-2)]">
                  {p.n}
                </span>
                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-[var(--color-paper)]">
                  {p.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[var(--color-paper-2)]/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const STUDIES = [
  {
    badge: "Start here",
    title: "Bible Interpretation 101",
    meta: "1 lesson · 30 min",
    body: "The simple rules behind every study. Learn them once and the rest opens up.",
    outcome: "You can check the work yourself",
  },
  {
    badge: "New Testament",
    title: "Romans",
    meta: "12 lessons · ~30 min each",
    body: "From the first verse to the last, read as one continuous argument about the gospel.",
    outcome: "Grasp the gospel as one whole",
  },
  {
    badge: "New Testament",
    title: "Galatians",
    meta: "8 lessons · ~30 min each",
    body: "A real-world look at the law and how it relates to the believer — principle vs. rules.",
    outcome: "Live by the law of Christ",
  },
  {
    badge: "Deep dive",
    title: "Colossians",
    meta: "9 lessons · ~30 min each",
    body: "Includes a focused study on the oneness of God — necessary for understanding the whole.",
    outcome: "A clearer view of who Jesus is",
  },
  {
    badge: "Coming soon",
    title: "The Gospels & Acts",
    meta: "In production",
    body: "The next series in the wide-angle walk through the New Testament.",
    outcome: "Supporters get early access",
  },
  {
    badge: "Browse",
    title: "See all studies",
    meta: "By book of the NT",
    body: "The full library, organized in reading order. More added every week.",
    outcome: "View library →",
  },
];

function StudyLibrarySection() {
  return (
    <section className="relative bg-[var(--color-paper-2)] py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit)]">
              The study library
            </p>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl">
              Pick a book. Watch in order, start to finish.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-graphite)] md:text-right">
            Every lesson runs 25–35 minutes and opens with a clear goal: here's
            where we're going, and here's what you'll walk away with.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIES.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] transition-colors hover:border-[var(--color-summit)]/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ink)]">
                <ContourBackdrop
                  className="absolute inset-0 h-full w-full"
                  variant="dark"
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-paper)] backdrop-blur">
                  {s.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                  {s.title}
                </h3>
                <p className="mt-2 font-sans text-xs text-[var(--color-brand-muted)]">
                  {s.meta}
                </p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--color-graphite)]">
                  {s.body}
                </p>
                <p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
                  Outcome → <span className="text-[var(--color-ink)]">{s.outcome}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <RevelationFeatured />
      </div>
    </section>
  );
}

function RevelationFeatured() {
  return (
    <div
      id="revelation"
      className="mt-16 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-ink)] text-[var(--color-paper)] lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
        <ContourBackdrop
          className="absolute inset-0 h-full w-full"
          variant="dark"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            aria-label="Play trailer"
            className="group flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-summit-2)]/50 bg-[var(--color-ink)]/40 text-[var(--color-summit-2)] backdrop-blur transition-colors hover:bg-[var(--color-summit-2)] hover:text-[var(--color-ink)] md:h-28 md:w-28"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 translate-x-0.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit-2)]">
          Flagship series · 33+ lessons
        </p>
        <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-paper)] md:text-4xl lg:text-5xl">
          The Revelation &amp; End-Times Series
        </h3>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-paper-2)]/80">
          Tired of internet prophets and endless predictions? We place every
          end-times passage — the prophets, the words of Jesus, and Revelation
          itself — in its proper order, until the whole thing reads like one
          clear picture. No pre-trib/mid-trib guesswork. Just the text.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)]"
          >
            Start the series
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-[var(--color-paper)] transition-colors hover:bg-white/5"
          >
            <span aria-hidden>▶</span> Watch the trailer
          </a>
        </div>
      </div>
    </div>
  );
}
