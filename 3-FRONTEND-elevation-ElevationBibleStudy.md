# Frontend Update — Elevation Bible Study (APP = elevation)

> For **Claude Code**. Run this ONLY after 1-CONSOLIDATION-PROMPT.md has finished.
> Drop this file into the **Elevation Bible Study** repo, then tell Claude Code:
> **"Read 3-FRONTEND-elevation-ElevationBibleStudy.md and follow it."**
> Do not commit this file — delete it when done.

---

This app's Supabase backend has been moved into a shared project (ref uxbidrgywshmtrnzaiwg, URL https://uxbidrgywshmtrnzaiwg.supabase.co). Its tables now live in the Postgres schema **`elevation`** instead of `public`. Update this repo to match. Do not change any UI or features.

1. Point the Supabase client at the new URL and anon key (I'll provide the anon key via an environment variable; tell me the variable name this project expects). Create the client with `db: { schema: 'elevation' }` so every .from() call hits this app's tables. Find any raw REST/RPC calls or explicit "public." references and retarget them to `elevation`.
2. Add `options.data.app = 'elevation'` to every supabase.auth.signUp call and any admin user-creation call, so the shared project's triggers know which app the user belongs to.
3. Pass an explicit emailRedirectTo / redirectTo (this site's own domain) on every signUp, magic link, OTP and password-reset call. The shared project's default Site URL belongs to another site.
4. Edge functions: none to rename.
5. Storage: bucket name session-media is unchanged; only the project URL in stored file links changes.
6. Search the whole repo (including .env files, generated Supabase types, config, and hardcoded storage URLs) for the old project refs woisicazwpfgrnbzooxo, wnjxyccatwryeteukvol and mbczwwxkdzmcxgpwjldt, and replace them with uxbidrgywshmtrnzaiwg.
7. If generated TypeScript types exist, regenerate them for schema `elevation`.
8. If this is a Lovable project, do NOT touch Lovable's Supabase integration settings. Set the client config in code only.
9. Show me the full diff before committing, then list anything you couldn't resolve.
