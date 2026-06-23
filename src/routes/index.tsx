import { useEffect } from "react";
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
              <div
                style={{
                  border: "1px solid rgba(247,246,242,0.16)",
                  borderRadius: "18px",
                  padding: "30px",
                  background:
                    "linear-gradient(180deg, rgba(247,246,242,0.04), rgba(247,246,242,0.01))",
                }}
              >
                <VennMark className="block w-full h-auto" />
                <div
                  className="mt-7 grid grid-cols-3 gap-3 pt-6"
                  style={{ borderTop: "1px solid rgba(247,246,242,0.16)" }}
                >
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className="font-medium uppercase"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.16em",
                          color: "#7e8085",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        className="font-display mt-2 whitespace-nowrap"
                        style={{
                          fontWeight: 800,
                          color: "#f7f6f2",
                          fontSize: s.value.includes("·") ? "18px" : "22px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {s.value}
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
              <h1 className="reveal mt-6 h-hero text-[var(--color-paper)]">
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
                  className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)]"
                >
                  Begin the study — free <span aria-hidden>→</span>
                </a>
                <a
                  href="/"
                  className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-[var(--color-paper)] transition-colors hover:bg-white/5"
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
        <ListenWatchSection />
        <MembershipSection />
        <LanguagesSection />
        <AboutSection />
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
          <h2 className="reveal mt-6 h-section text-[var(--color-ink)]">
            You don't need a seminary degree to understand the Bible. You need
            the right{" "}
            <span className="text-[var(--color-summit)]">altitude.</span>
          </h2>
        </div>

        <div className="reveal mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PAINS.map((c) => (
            <div
              key={c.outcome}
              className="card-lift flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]/40 p-7"
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

        <div className="reveal mt-14 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="reveal h-section text-[var(--color-paper)]">
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
            <h2 className="reveal mt-6 h-section text-[var(--color-ink)]">
              Pick a book. Watch in order, start to finish.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-graphite)] md:text-right">
            Every lesson runs 25–35 minutes and opens with a clear goal: here's
            where we're going, and here's what you'll walk away with.
          </p>
        </div>

        <div className="reveal mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIES.map((s) => (
            <article
              key={s.title}
              className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] hover:border-[var(--color-summit)]/40"
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
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)]"
          >
            Start the series
          </a>
          <a
            href="/"
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-[var(--color-paper)] transition-colors hover:bg-white/5"
          >
            <span aria-hidden>▶</span> Watch the trailer
          </a>
        </div>
      </div>
    </div>
  );
}

function ListenWatchSection() {
  const cards = [
    {
      Icon: Headphones,
      eyebrow: "Audio",
      title: "Prefer to listen?",
      body: "Every lesson is released as a podcast — drive, walk, or wash dishes while you study.",
      cta: "Subscribe to the podcast →",
    },
    {
      Icon: Youtube,
      eyebrow: "Video",
      title: "Also on YouTube",
      body: "Watch free on YouTube, then come back here to follow the series in order.",
      cta: "Open YouTube channel →",
    },
  ];
  return (
    <section className="bg-[var(--color-paper)] py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-2 md:gap-8 lg:px-8">
        {cards.map(({ Icon, eyebrow, title, body, cta }) => (
          <div
            key={title}
            className="card-lift flex items-start gap-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-2)]/50 p-6 md:p-8"
          >
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-[var(--color-ink)] text-[var(--color-summit-2)]">
              <Icon size={24} />
            </div>
            <div className="flex-1">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit)]">
                {eyebrow}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-tight text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-graphite)]">
                {body}
              </p>
              <a
                href="/"
                className="mt-4 inline-block font-sans text-sm font-medium text-[var(--color-summit)] hover:text-[var(--color-summit-ink)]"
              >
                {cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FREE_FEATURES = [
  "Full video library, in order",
  "The complete Revelation series",
  "Podcast audio of every lesson",
  "Available in English, Spanish & German",
];

const SUPPORTER_FEATURES = [
  "Everything in the free account",
  "Downloadable lesson outlines",
  "Early access — a week ahead of release",
  "Members-only deep-dive sessions",
  "Priority on questions & responses",
];

function MembershipSection() {
  return (
    <section
      id="join"
      className="bg-[var(--color-paper-2)] py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit)]">
            Membership
          </p>
          <h2 className="reveal mt-6 h-section text-[var(--color-ink)]">
            Watch everything free.{" "}
            <span className="text-[var(--color-summit)]">
              Support it if it feeds you.
            </span>
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[var(--color-graphite)]">
            No one has to pay to learn. Create a free account and the library
            is yours. If the teaching is worth something to you, become a
            supporter — it's what keeps new lessons coming.
          </p>
        </div>

        <div className="reveal mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Free */}
          <div className="card-lift flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8 md:p-10">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">
              Free Account
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--color-ink)]">
                $0
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-graphite)]">
              All you need is a name and email.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-[var(--color-ink)]">
                  <Check size={18} className="mt-0.5 flex-none text-[var(--color-summit)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="/"
              className="mt-10 inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Create free account
            </a>
          </div>

          {/* Supporter (dark) */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-summit-2)]/30 bg-[var(--color-ink)] p-8 text-[var(--color-paper)] md:p-10">
            <ContourBackdrop
              className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
              variant="dark"
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit-2)]">
                  Partner in the Work
                </p>
                <span className="rounded-full bg-[var(--color-summit)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-paper)]">
                  Supporter
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--color-paper)]">
                  $7
                </span>
                <span className="text-sm text-[var(--color-paper-2)]/70">
                  / month
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-paper-2)]/75">
                Less than a hamburger — and it keeps the lessons coming.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {SUPPORTER_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-[var(--color-paper)]">
                    <Check size={18} className="mt-0.5 flex-none text-[var(--color-summit-2)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/"
                className="mt-10 inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[var(--color-summit)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-summit-2)]"
              >
                Become a supporter
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-[var(--color-brand-muted)]">
          A note on support: contributions are not tax-deductible, and that's
          on purpose. Staying independent of 501(c)(3) restrictions keeps the
          teaching free to say what Scripture says.
        </p>
        <p className="mt-4 font-scripture text-base italic text-[var(--color-graphite)]">
          “The labourer is worthy of his reward.”
        </p>
      </div>
    </section>
  );
}

const LANGUAGES = [
  { label: "English", active: true },
  { label: "Español", active: true },
  { label: "Deutsch", active: true },
  { label: "اردو · in progress", active: false },
  { label: "پښتو · in progress", active: false },
];

function LanguagesSection() {
  return (
    <section className="bg-[var(--color-ink)] py-20 text-[var(--color-paper)] md:py-24">
      <div className="mx-auto w-full max-w-4xl px-5 text-center lg:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit-2)]">
          For every background and nation
        </p>
        <h2 className="reveal mt-6 h-section text-[var(--color-paper)]">
          The same study, translated — so language is never the barrier to
          understanding.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {LANGUAGES.map((l) => (
            <span
              key={l.label}
              className={
                l.active
                  ? "rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-[var(--color-paper)]"
                  : "rounded-full border border-dashed border-white/15 px-5 py-2.5 text-sm font-medium text-[var(--color-paper-2)]/45"
              }
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const CREDENTIALS = [
  "Texas Bible College",
  "JD · McGeorge School of Law",
  "U.S. Army · Combat Medic",
  "Missionary · Poland & Chile",
  "Fluent EN · ES · DE",
  "30+ years teaching",
];

function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[var(--color-ink-2)] py-24 text-[var(--color-paper)] md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-summit-2)]">
          The teacher
        </p>
        <div className="mt-6 h-px w-full bg-white/10" />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-2">
            <figure className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-ink)]">
              <div className="relative aspect-[4/5]">
                <ContourBackdrop
                  className="absolute inset-0 h-full w-full"
                  variant="dark"
                />
                <div className="absolute inset-0 flex items-end p-6">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-paper-2)]/70 backdrop-blur">
                    Portrait of Rev. Fussell · photo coming soon
                  </span>
                </div>
              </div>
            </figure>
          </div>

          {/* Bio */}
          <div className="lg:col-span-3">
            <h2 className="reveal h-section text-[var(--color-paper)]">
              Rev. William Fussell,{" "}
              <span className="text-[var(--color-summit-2)]">JD</span>
            </h2>
            <div className="mt-8 flex flex-col gap-6 text-[16px] leading-relaxed text-[var(--color-paper-2)]/80">
              <p>
                Pastor, missionary, and Bible teacher with 30+ years in
                ministry — and a teacher at heart. After serving as a combat
                medic, planting churches in Poland, and teaching the New
                Testament across Chile, the passion has always been the same:
                helping ordinary people open their Bible and actually
                understand it.
              </p>
              <p>
                A Juris Doctor in business and taxation trained him to read a
                text carefully, weigh the evidence, and separate what's proven
                from what's speculation — the same discipline he brings to
                Scripture. The goal of Elevation is simple: make the Word
                understandable, accessible, and clear for people from every
                background.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-2.5">
              {CREDENTIALS.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-[var(--color-paper-2)]/85"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
