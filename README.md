# Elevation Bible Study

A multilingual design prototype with a public ministry website, member learning room, and admin studio. Built with React, Vinext, Tailwind, Shadcn primitives, and Lucide icons.

## Experiences

- `/`: Public site, study approach, membership options, language selection, and teacher biography.
- `/studies`: Searchable library with category filters.
- `/contact`: Multilingual contact form with validation and a message-review preview; no messages are sent.
- `/login`: Clearly labeled member and administrator preview entry points. No credential collection.
- `/member`: Member overview with session progress and recommended studies.
- `/member/studies`: Course library and progress.
- `/member/lesson/[course]`: Curriculum, video placeholder, lesson completion, notes, and resource placeholders.
- `/member/notes`: Session notes and personal reflections.
- `/admin`: Sample activity reporting and content overview.
- `/admin/studies`: Create and edit study previews.
- `/admin/sessions`: Review and edit session titles.
- `/admin/members`: Sample member activity with Troy Johnson’s supplied name and portrait and preview status controls.
- `/admin/languages`: English, Spanish, and German study-title review.
- `/admin/settings`: Preview-only configuration controls and launch readiness.

## State and launch boundary

Language is a device preference in localStorage. Course edits, notes, and lesson completion use shared React state for the current browser session and reset on reload. Member records and settings are demonstration controls. There is no app-owned authentication, payment collection, video hosting, or backend persistence. Connect and authorize those capabilities before a public member launch. The supporter offer remains coming soon.

## Content and imagery

Ministry content and the curriculum themes are based on the user-provided reference at https://elevation-wide-view.lovable.app/. Additional session titles are a sample curriculum, clearly labeled. The original uploaded Elevation logo is preserved, displayed at a larger size with stronger contrast and a light sidebar panel. Troy Johnson’s uploaded photograph supplies the shared preview profile image. Two original generated editorial images depict an alpine summit and an open Bible; they are used as atmosphere, not documentary photographs of the teacher.

## Commands

Install and run locally with `npm install` and `npm run dev`. The GitHub version uses a standard Next.js build for Netlify; `netlify.toml` supplies the build command and publish directory.
