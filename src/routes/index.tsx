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

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <SiteNav />
      <main className="flex-1">
        <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[var(--color-paper)]">
          <ContourBackdrop
            className="absolute inset-0 h-full w-full"
            variant="light"
          />
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 py-24 text-center lg:px-8">
            <VennMark className="h-24 w-40 text-[var(--color-ink)]" />
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-[var(--color-brand-muted)]">
              The Thousand-Foot View
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-6xl lg:text-7xl">
              Elevation Bible Study
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--color-graphite)]">
              Sections coming next.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
