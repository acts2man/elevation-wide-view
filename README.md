# Elevation Bible Study

Create a React + Tailwind website called "Elevation Bible Study" — a membership Bible-study platform. Tagline: "The Thousand-Foot View."

DESIGN TOKENS (add to the Tailwind theme):

colors — ink #111315, ink-2 #17191c, graphite #3c3f44, muted #6f7177, paper #f7f6f2, paper-2 #ecebe4, line #d6d6cd, summit #2f5d62, summit-2 #5e8b8f, summit-ink #214a4e.

fonts (Google Fonts) — display "Bricolage Grotesque" (headlines, 700/800, letter-spacing -0.02em); body/UI "Inter"; "Spectral" italic ONLY for Scripture quotes.

buttons — pill-rounded (rounded-full), always one line (w-fit, whitespace-nowrap). Primary = summit bg + white text. Ghost = transparent + light border (dark sections). Line = outlined ink (light sections).

SECTION RHYTHM — alternate TRUE light and dark surfaces (not shade variation): light sections use paper/paper-2 bg + ink text; dark sections use ink bg + paper text.

TWO REUSABLE COMPONENTS (this is the brand's signature):

1. <VennMark/> — two overlapping outline circles, no fill, thin stroke; left labeled GOD, right labeled MAN; "JESUS" stacked vertically letter-by-letter in the overlap (summit-2 color). Echoes the logo.

2. <ContourBackdrop/> — faint SVG of TWO overlapping sets of concentric circles (a topographic map seen from above), very low opacity; used behind the hero and inside video thumbnails. On dark bg use rgba(247,246,242,0.12) strokes.

GLOBAL SHELL:

- Sticky top nav, light/paper bg, backdrop blur, 1px bottom border. Left: wordmark "Elevation Bible Study" (I'll upload the real logo image to swap in). Links: Studies, Revelation Series, Our Approach, Membership, About. A small EN/ES/DE language pill switcher (active = ink pill). Primary CTA "Begin the study". Mobile: hamburger → off-canvas menu.

- Footer, near-black #0b0c0d. Logo + mission line "A wide-angle view of the Word of God — studied with clarity, context, and a legally trained mind." Columns: Study / Ministry / Stay in the loop (email signup). A line "Merch coming soon — stickers, hats & hoodies." Bottom row: "© 2026 Elevation Bible Study · The Thousand-Foot View" and "An independent teaching ministry — not a 501(c)(3). Support is not tax-deductible."

Build only the shell + an empty homepage now. I'll add sections next.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://elevation-wide-view.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1d76fa7-9104-4336-b7d5-0e251e268dbd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
