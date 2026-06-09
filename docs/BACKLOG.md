# BACKLOG.md

## Epic 0 - Preserve technical base

- Confirm Prisma migrations are valid.
- Confirm auth route works.
- Confirm seed can run.
- Confirm `npm run build`, `npm run lint`, `npx prisma validate`.

## Epic 1 - Frontend rebuild foundation

- Create clean `src/app` / `src/components` structure.
- Preserve Prisma, migrations, auth and docs.
- Create design tokens/global CSS.
- Create public layout and navigation.
- Create admin layout and navigation.
- Create base components: cards, stat chips, match cards, section headers, empty states.
- Public home with mocks.
- Admin dashboard with mocks.

## Epic 2 - Public home

- Club hero.
- First Team next match.
- Latest results.
- First Team standings summary.
- Recent news.
- Team access.
- External shop link.

## Epic 3 - First Team public page

- Premium header.
- Coaches.
- Next match/latest results.
- Manual standings.
- Squad.
- Uploaded premium card images.
- Advanced stats.
- Played match videos.
- Related news.

## Epic 4 - Standard teams public pages

- `/equipos` listing.
- `/equipos/[teamSlug]` standard team detail.
- Coaches.
- Next match/latest results.
- Manual standings.
- Squad.
- Generated cards.
- Basic stats.
- Related news.

## Epic 5 - Admin shell

- Login visual preserving auth.
- Dashboard by role.
- Admin nav/sidebar.
- Common table/form shell.
- Empty/loading/error states.

## Epic 6 - Seasons

- CRUD seasons.
- Only one active season.

## Epic 7 - Teams and coaches

- CRUD teams.
- First Team flag.
- Public visibility.
- Visible coaches.
- Coach account assignment.

## Epic 8 - Players and assignments

- CRUD public-safe players.
- Player/team/season assignments.
- No sensitive data.

## Epic 9 - Matches and standings

- Matches CRUD.
- Results/status.
- Manual standings.

## Epic 10 - Stats

- Match stats by player/team/season/match.
- Aggregates/derived metrics.

## Epic 11 - News and media

- News draft/published.
- Related teams.
- Cover image/video links.
- Media metadata/uploads.
- Cards/cromos.

## Epic 12 - rr-management import

- CSV/ZIP validation.
- Preview diff.
- Merge/upsert apply.
- Import history.

## Epic 13 - Deployment beta

- Hostinger Node app.
- MySQL env vars.
- Beta domain.
- Backup checklist.

---

## Public website consolidation status

The public website specification is now considered defined. Public implementation can proceed page-by-page using `docs/PUBLIC_APP_SPEC.md` as source of truth. Remaining public work is mainly:

- connect real DB/services;
- replace mocks with data queries;
- add SEO metadata;
- harden loading/error/empty states;
- final real copy/images/assets;
- responsive QA.

Next recommended phase: backoffice mocks and role UX.
