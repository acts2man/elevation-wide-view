import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SiteNav } from "@/components/SiteNav";
import { getLesson } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import type { Lesson } from "@/lib/types";

export const Route = createFileRoute("/watch/$lessonId")({
  component: () => (
    <RequireAuth>
      <WatchPage />
    </RequireAuth>
  ),
});

function WatchPage() {
  const { lessonId } = Route.useParams();
  const user = useCurrentUser();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLesson(lessonId).then((l) => {
      setLesson(l);
      setLoading(false);
    });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
        <SiteNav />
        <p className="px-6 py-20 text-center text-sm text-[var(--color-paper-2)]/60">Loading…</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)]">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-[var(--color-ink)]">Lesson not found</h1>
          <Link to="/library" className="mt-6 inline-block text-sm underline">Back to library</Link>
        </main>
      </div>
    );
  }

  const gated = lesson.is_supporter_only && user?.role !== "supporter" && user?.role !== "admin";

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-5 py-12 lg:px-8">
        <Link to="/library" className="text-xs uppercase tracking-[0.22em] text-[var(--color-paper-2)]/60 hover:text-[var(--color-paper)]">
          ← Library
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{lesson.title}</h1>
        <p className="mt-3 text-[15px] text-[var(--color-paper-2)]/75">
          {lesson.runtime_min} min · Goal: {lesson.goal}
        </p>

        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          {gated ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-summit-2)]">Supporter only</p>
              <h2 className="font-display text-2xl font-bold">This lesson is for supporters.</h2>
              <p className="max-w-md text-sm text-[var(--color-paper-2)]/70">
                The supporter tier is coming soon. Free members can keep watching every other lesson in the library.
              </p>
            </div>
          ) : (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${lesson.youtube_id}`}
              title={lesson.title}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-[var(--color-paper-2)]/80">
          {lesson.description}
        </p>
      </main>
    </div>
  );
}
