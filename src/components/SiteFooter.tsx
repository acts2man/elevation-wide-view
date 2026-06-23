import { useState } from "react";
import { VennMark } from "./VennMark";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0b0c0d] text-[var(--color-paper)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <VennMark
                className="h-10 w-16"
                stroke="rgba(247,246,242,0.7)"
                labelColor="rgba(247,246,242,0.55)"
                overlapColor="var(--color-summit-2)"
              />
              <span className="font-display text-lg font-bold">
                Elevation Bible Study
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[rgba(247,246,242,0.7)]">
              A wide-angle view of the Word of God — studied with clarity,
              context, and a legally trained mind.
            </p>
          </div>

          <FooterCol
            title="Study"
            items={["Studies", "Revelation Series", "Our Approach", "Membership"]}
          />
          <FooterCol
            title="Ministry"
            items={["About", "Contact", "Support", "FAQ"]}
          />

          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(247,246,242,0.55)]">
              Stay in the loop
            </h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-[rgba(247,246,242,0.18)] bg-[rgba(247,246,242,0.04)] p-1 pl-4"
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--color-paper)] placeholder:text-[rgba(247,246,242,0.4)] focus:outline-none"
              />
              <button className="w-fit whitespace-nowrap rounded-full bg-[var(--color-summit)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-summit-2)]">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[rgba(247,246,242,0.55)]">
              Merch coming soon — stickers, hats &amp; hoodies.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[rgba(247,246,242,0.12)] pt-6 text-xs text-[rgba(247,246,242,0.55)] md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Elevation Bible Study · The Thousand-Foot View
          </p>
          <p>
            An independent teaching ministry — not a 501(c)(3). Support is not
            tax-deductible.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(247,246,242,0.55)]">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a
              href="#"
              className="text-sm text-[rgba(247,246,242,0.85)] transition-colors hover:text-[var(--color-summit-2)]"
            >
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SiteFooter;
