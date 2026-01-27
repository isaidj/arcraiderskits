## 2026-01-27 - Data Update Side-effects in Build
**Learning:** Running `pnpm build` triggers `npm run update-data`, which modifies tracked files in `public/data/` and `sitemap-0.xml`. These auto-generated changes clutter PRs for purely UI tasks.
**Action:** Always revert changes to `public/data` and `sitemap-0.xml` after running build verification, unless the task explicitly involves data schema updates.
