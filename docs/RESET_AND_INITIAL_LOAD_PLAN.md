# RESET_AND_INITIAL_LOAD_PLAN.md

## Purpose

Define the practical approach for:

- purging the current development dataset after manual validation;
- preparing a clean initial sports dataset;
- loading real base data without depending on manual entry screen by screen.

This document separates:

1. development reset;
2. controlled sports purge;
3. initial real-data bootstrap.

It is intentionally aligned with the current project state:

- core sports admin is already DB-backed;
- `news` and `media` are not required to start the real base load;
- UI import flow is still not implemented end-to-end;
- the current `prisma/seed.ts` is a demo seed, not a real bootstrap import.

## Current Reality

Today the repo already has:

- Prisma schema and migrations;
- a deterministic development seed in `prisma/seed.ts`;
- DB-backed admin flows for teams, players, assignments, matches, standings and stats;
- import-oriented schema fields such as `sourceSystem`, `sourceExternalId`, `lastImportBatchId`.

Today the repo does **not** yet have:

- a finished `/admin/importaciones` workflow;
- a real CSV/ZIP import validator/apply pipeline;
- a safe scripted sports-only purge command;
- a dedicated real-data bootstrap script separate from demo seed.

## Recommendation

Do **not** start with a blind full database wipe unless the target is purely local dev.

Use three different modes depending on the environment:

### Mode A - Local development reset

Use when:

- you want to return to the demo dataset;
- you do not care about preserving any current records.

Suggested result:

- full schema reset;
- fresh migrations;
- demo seed reapplied.

### Mode B - Controlled sports purge

Use when:

- manual validation is finished;
- you want to remove current sports/content/demo data;
- you want to preserve admin access and technical setup.

Suggested result:

- preserve `users`;
- preserve auth configuration;
- optionally preserve `site_settings`;
- delete sports/content/import operational data only.

### Mode C - Initial real-data bootstrap

Use when:

- the DB is clean enough for first real data;
- you already have a trusted source snapshot from `rr-management` or equivalent curated CSVs;
- you want to populate the sports master data quickly and safely.

Suggested result:

- load seasons, teams, players, season profiles and assignments from curated files;
- then complete operational web-owned data manually or via smaller follow-up scripts.

## What Should Be Purged

For the initial real-data start, the purge should remove:

- `news_post_teams`
- `news_posts`
- `player_match_stats`
- `standing_rows`
- `standing_tables`
- `matches`
- `team_coaches`
- `coach_team_permissions`
- `team_player_assignments`
- `player_season_profiles`
- `season_teams`
- `competitions`
- `players`
- `teams`
- `seasons`
- `import_batch_items`
- `import_batches`
- optionally `media_assets` if they only contain demo URLs

## What Should Usually Be Preserved

Normally preserve:

- `users`
- passwords / auth access
- app config files
- migrations
- docs

Usually preserve too:

- `site_settings`

But note:

- if you delete all seasons, `site_settings.activeSeasonId` must be reset to `null` first or recreated afterwards.

## Safe Purge Order

When using a sports-only purge, the delete order should respect dependencies.

Recommended order:

1. `newsPostTeam`
2. `playerMatchStats`
3. `standingRow`
4. `standingTable`
5. `match`
6. `teamCoach`
7. `coachTeamPermission`
8. `teamPlayerAssignment`
9. `playerSeasonProfile`
10. `newsPost`
11. `siteSettings` only if intentionally resetting settings too
12. `competition`
13. `seasonTeam`
14. `player`
15. `team`
16. `importBatchItem`
17. `importBatch`
18. `season`
19. `mediaAsset` only if intentionally purging demo media metadata

This is similar to the current seed reset logic, but for real workflow we should split it into dedicated scripts instead of reusing `prisma/seed.ts`.

## Initial Load Scope

The recommended initial real-data load should focus first on the sports base:

### Phase 1 - Master sports data

- seasons
- teams
- competitions if already known
- season teams
- players
- player season profiles
- player assignments

### Phase 2 - Public-operational sports data

- public coaches
- matches
- standings
- match stats

### Phase 3 - Editorial and media

- player photos
- team logos/banners
- news
- news covers

### Bootstrap logo paths

For the initial sports bootstrap, use local public assets under:

- `public/media/teams/logos/escudo-madrid.webp`
- `public/media/teams/logos/escudo-catalunya.webp`

Public URLs resolved by the app:

- `/media/teams/logos/escudo-madrid.webp`
- `/media/teams/logos/escudo-catalunya.webp`

Notes:

- Keep filenames exactly as above if the bootstrap script uses the default convention.
- Prefer `webp`; if needed later, the bootstrap can be extended to accept `png` or `svg`.
- Team banners remain pending and can later live under `public/media/teams/banners/`.

This means `media` and `news` do not block the initial load.

## Recommended First Real Bootstrap Strategy

Because `/admin/importaciones` is not finished yet, the safest next implementation is:

### Step 1

Create a **sports-only purge script** for local/staging use.

Goal:

- remove current demo sports/content data;
- preserve admin users.

### Step 2

Create a **real bootstrap script from curated CSV input**.

Goal:

- read a local folder or ZIP-extracted folder with:
  - `seasons.csv`
  - `teams.csv`
  - `persons.csv`
  - `player_profile_seasons.csv`
  - `team_assignments.csv`
- validate required columns;
- upsert master records;
- preserve web-owned fields;
- register an `ImportBatch`.

### Step 3

Use the existing DB-backed admin to finish or correct:

- public names/slugs if needed;
- visible coaches;
- matches;
- standings;
- stats.

This gives a practical bridge between the current repo and the future full import UI.

## Strong Recommendation About Demo Seed

Do not use `npm run db:seed` as the real initial load.

Reason:

- it is intentionally destructive;
- it inserts fake/demo content;
- it is designed for local validation, not for first real club data.

Keep it only for:

- local UI development;
- automated smoke validation;
- resetting to a known demo state.

## Scripts To Implement Next

Recommended next scripts:

### `db:reset:dev`

Purpose:

- full local reset to demo mode.

Expected behavior:

- reset schema;
- run migrations;
- run demo seed.

### `db:purge:sports`

Purpose:

- purge sports/content/import data;
- preserve admin users and access.

Expected behavior:

- transactional delete in the safe dependency order;
- optionally preserve or reset `site_settings`;
- print summary counts.

### `db:bootstrap:initial`

Purpose:

- import first real sports base from curated CSV files.

Expected behavior:

- validate files and columns;
- create `ImportBatch`;
- upsert seasons, teams, players, season profiles and assignments;
- report summary and conflicts.

## Implemented commands

Current repo scripts now available:

```bash
npm run db:purge:sports
npm run db:bootstrap:initial -- --source="C:\Users\Aaron\Downloads\Rising_Raimon_carga_inicial_2026_27.md"
```

Behavior:

- `db:purge:sports` removes sports/content/import/media data and preserves `users`.
- `db:bootstrap:initial` reads the functional markdown source, validates the pseudo-CSV block, verifies the required logo files, and loads:
  - active season
  - competitions
  - teams
  - season teams
  - players
  - player season profiles
  - team assignments
  - visible coaches
  - initial empty standings

Notes:

- The bootstrap expects the logos to exist first at:
  - `public/media/teams/logos/escudo-madrid.webp`
  - `public/media/teams/logos/escudo-catalunya.webp`
- Current bootstrap target source is the functional markdown document for 2026/27.

## Suggested Data Ownership During Initial Load

During the first real bootstrap:

### Imported from curated source

- season identity
- team identity
- player base identity
- season profile positions
- primary assignments

### Completed manually afterwards in admin

- public coach rows
- public descriptions
- match calendar
- standings
- per-match stats
- photos and media
- news

This keeps the first bootstrap narrow and much less risky.

## Operational Checklist

### Before purge

- [ ] Confirm manual validation is finished
- [ ] Export DB backup
- [ ] Confirm whether `users` must be preserved
- [ ] Confirm whether `site_settings` must be preserved
- [ ] Confirm whether demo `media_assets` should be preserved or deleted
- [ ] Prepare curated CSV source files

### Purge

- [ ] Run sports-only purge
- [ ] Verify admin login still works
- [ ] Verify public site shows honest empty states

### Initial load

- [ ] Import seasons
- [ ] Import teams
- [ ] Import season teams / competition linkage
- [ ] Import players
- [ ] Import player season profiles
- [ ] Import assignments
- [ ] Set active season in `site_settings`

### Post-load manual completion

- [ ] Review slugs and public names
- [ ] Add visible coaches
- [ ] Add matches
- [ ] Add standings
- [ ] Add stats
- [ ] Add media
- [ ] Add news

## Practical Decision

The best next move is **not** to implement `news` or `media` first.

The best next move is:

1. create `db:purge:sports`;
2. create `db:bootstrap:initial`;
3. test the round-trip on local with a small curated CSV snapshot.

## Proposed Next Implementation Slice

If we continue now, the most valuable concrete slice is:

- add a sports-only purge script;
- add a bootstrap script skeleton that reads curated CSVs;
- add npm scripts for both;
- document the expected input folder structure.

That would leave you with a repeatable workflow instead of a one-off manual reset.
