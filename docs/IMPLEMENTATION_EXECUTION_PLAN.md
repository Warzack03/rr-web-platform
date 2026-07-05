# IMPLEMENTATION_EXECUTION_PLAN.md

## Purpose

This document is the working execution plan for replacing mocks with real logic in the Rising Raimon web platform.

It is meant to be reused across multiple days and iterations.

Use it as:

- the source of truth for implementation order;
- the checklist for each iteration;
- the place to record what is done, what is blocked, and what comes next.

It complements, not replaces:

- `docs/MVP_SCOPE.md`
- `docs/PUBLIC_APP_SPEC.md`
- `docs/ADMIN_PAGE_SPECS.md`
- `docs/API_CONTRACT.md`
- `docs/DONE_CRITERIA.md`

## How To Use This File

At the start of each work session:

1. Read `Current Status`.
2. Read `Next Recommended Iteration`.
3. Execute only one small vertical slice or one tightly related group of tasks.
4. Update:
   - phase status;
   - checklist items;
   - session log;
   - next recommended iteration.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked or needs decision

## Non-Negotiable Guardrails

- Do not delete the technical base: Prisma, migrations, auth, docs, server utilities.
- Do not rewrite the DB model unless a task explicitly requires it.
- Do not connect the public site to `rr-management` at runtime.
- Do not add MVP-external features.
- Keep public queries public-safe only.
- Enforce permissions server-side.
- Prefer services/read-models over direct Prisma usage inside route components.
- Replace mocks in thin vertical slices, not with a big bang rewrite.

## Current Status

### Confirmed today

- [x] Public and admin visual direction are sufficiently defined.
- [x] Project builds successfully with `npm run build`.
- [x] Lint currently has warnings only, no blocking errors.
- [x] Prisma/auth/server base already exists.
- [x] Seed data already exists for local functional development.

### Important realities to keep in mind

- [x] Public UI is visually ahead of admin logic integration.
- [x] Public pages already have reusable composition layers that can be fed with real data.
- [x] Several admin modules still depend heavily on in-component mock state.
- [!] Seed dataset and public mock universe are not fully aligned yet.
- [!] Public route usage includes `/estadisticas`, so that route family should now be treated as active implementation scope.

## Global Strategy

Implementation order should optimize for:

1. highest reuse;
2. lowest risk of rework;
3. fastest visible progress;
4. stable domain foundations before write-heavy modules.

Recommended order:

1. data access foundations;
2. public read models;
3. admin dashboard and shared admin context;
4. teams and visible coaches;
5. players and assignments;
6. matches;
7. standings;
8. news;
9. statistics;
10. media persistence;
11. import flow.

## Cross-Phase Definition Of Done

A phase is only considered done when:

- the target slice works with real data or a real service contract;
- mocks for that slice are removed or isolated behind an intentional fallback;
- loading, empty, and error states are present;
- permissions are enforced where relevant;
- `npm run build` passes;
- `npm run lint` passes or only leaves accepted non-blocking warnings;
- docs are updated if behavior or scope changed.

## Phase 0 - Alignment Before Logic

Status: `[~]`

Goal:
Align the real data model, seeded data, and active route scope before broad logic work begins.

Checklist:

- [x] Confirm which public teams must exist in local seed during implementation.
- [x] Decide whether to temporarily reduce public mock breadth or expand seed breadth.
- [x] Confirm `/estadisticas` stays in MVP-active scope for public team pages.
- [x] Define which fields are read from real DB first and which can remain fallback-only.
- [~] Define a standard DTO pattern for public and admin services.

Deliverables:

- one shared decision on seed-vs-mock alignment;
- one agreed service shape pattern for future iterations.

Exit criteria:

- no uncertainty remains about which routes are active;
- no uncertainty remains about which dataset drives local development.

## Phase 1 - Service Layer Foundations

Status: `[~]`

Goal:
Create the server-side service/read-model layer that will feed pages and admin screens.

Checklist:

- [x] Create `server/services/public/*` for public read models.
- [ ] Create `server/services/admin/*` for admin read models.
- [x] Keep route/page components thin.
- [x] Add mapper functions from Prisma records to UI DTOs.
- [x] Standardize season resolution using active season from `SiteSettings`.
- [ ] Standardize team resolution by `publicSlug`.
- [x] Standardize public-safe field selection.
- [x] Add shared fallback handling for missing records.

Suggested first services:

- [x] `public-home-service`
- [ ] `public-teams-service`
- [x] `public-news-service`
- [ ] `admin-dashboard-service`
- [ ] `admin-teams-service`

Exit criteria:

- new services exist and are ready to replace at least one public and one admin mock source.

## Phase 2 - Public Read Integration

Status: `[~]`

Goal:
Move the public site from content mocks to DB-backed read models, page by page.

### Phase 2A - Home

- [x] Replace home hero/first-team/news/academy summary data sources with real services.
- [x] Use active season.
- [x] Use real next match and recent results.
- [x] Use real standings summary.
- [x] Use real featured/latest news.
- [x] Add intentional fallback when some content is still missing.

### Phase 2B - First Team Summary

- [ ] Replace first team summary page with real data.
- [ ] Real coaches.
- [ ] Real summary metrics.
- [ ] Real top scorer.
- [ ] Real related news.

### Phase 2C - Teams Directory And Team Summary

- [ ] Replace `/equipos` data source.
- [ ] Replace academy team detail summary data source.
- [ ] Resolve team by `publicSlug`.
- [ ] Reuse shared team summary DTO.

### Phase 2D - Calendars, Match Detail, Standings, Statistics

- [ ] Replace public calendar sources.
- [ ] Replace public match detail sources.
- [ ] Replace public standings sources.
- [ ] Replace public statistics sources.
- [ ] Keep academy vs first-team feature flags explicit.

### Phase 2E - Players And News Detail

- [ ] Replace first-team squad source.
- [ ] Replace academy squad source.
- [ ] Replace player profile source.
- [x] Replace news list source.
- [x] Replace news detail source.

Exit criteria:

- all active public routes read from real services;
- public mock content only remains where explicitly accepted as temporary fallback.

## Phase 3 - Admin Dashboard And Shared Admin Context

Status: `[ ]`

Goal:
Make the admin shell read real operational data before deep CRUD work starts.

Checklist:

- [ ] Wire dashboard page to `getAdminDashboardData`.
- [ ] Stop using `adminMock*` in dashboard for metrics and alerts.
- [ ] Show active season, teams, upcoming matches, draft news, import summary from DB.
- [ ] Respect role scoping in service results.
- [ ] Add admin empty states for real no-data scenarios.

Nice follow-up inside same phase if time allows:

- [ ] shared admin season/team filter source;
- [ ] shared admin option lists based on DB instead of mock arrays.

Exit criteria:

- dashboard is DB-backed;
- admin no longer depends on fake overview counts.

## Phase 4 - Teams And Visible Coaches

Status: `[ ]`

Goal:
Make `/admin/equipos` the first real editable module because it unlocks both public and admin consistency.

Checklist:

- [ ] Replace team list source with DB-backed team query.
- [ ] Query `SeasonTeam`, `Team`, `Competition`, `TeamCoach`.
- [ ] Keep informative visible coaches separate from permissions.
- [ ] Implement create team flow.
- [ ] Implement edit team flow.
- [ ] Implement visibility toggle.
- [ ] Implement active toggle.
- [ ] Implement visible coach add/edit/remove/reorder flow.
- [ ] Preserve first-team ordering rule.
- [ ] Preserve competition selection from existing competition options.
- [ ] Add Zod validation for writes.
- [ ] Enforce role access server-side.

Exit criteria:

- `/admin/equipos` works end-to-end against DB;
- public team summaries can trust real team metadata and visible coaches.

## Phase 5 - Players And Assignments

Status: `[ ]`

Goal:
Make roster and player profile data real, because this unlocks squad pages, player detail, and later stats.

Checklist:

- [ ] Create admin player read model.
- [ ] Create admin assignment/roster read model.
- [ ] Replace player profile editor mock source.
- [ ] Replace roster source with DB-backed assignments.
- [ ] Implement player create/edit public fields.
- [ ] Implement assignment create/edit/archive flow.
- [ ] Keep shirt number and public position assignment-level.
- [ ] Preserve active/history rules.
- [ ] Preserve slug uniqueness rules.
- [ ] Add player visibility toggle.
- [ ] Add photo/card media references as metadata fields even if upload flow stays later.

Public dependency checks:

- [ ] first-team squad page reads real assignments;
- [ ] academy squad pages read real assignments;
- [ ] player public pages read real player + profile + assignment + stats aggregates.

Exit criteria:

- admin player and roster workflows are DB-backed;
- public squad and player pages can use real data.

## Phase 6 - Matches

Status: `[ ]`

Goal:
Make matches the central source for public calendars, previews, and admin journey operations.

Checklist:

- [ ] Replace admin matches list source.
- [ ] Implement create match flow.
- [ ] Implement edit match flow.
- [ ] Implement quick result/status updates.
- [ ] Support first-team video URL.
- [ ] Preserve coach scope restrictions.
- [ ] Use competition/team defaults where documented.
- [ ] Keep status model aligned with schema and public UI rules.
- [ ] Add pagination or bounded result strategy.

Public dependency checks:

- [ ] home next match reads real match;
- [ ] recent results read real matches;
- [ ] calendar pages read real matches;
- [ ] match detail pages read real matches and related stats.

Exit criteria:

- match lifecycle is DB-backed and reused by public pages.

## Phase 7 - Standings

Status: `[ ]`

Goal:
Make standings fully manual but real, aligned with the MVP rule that they are not auto-derived from matches.

Checklist:

- [ ] Replace admin standings source.
- [ ] Implement standings table selection flow.
- [ ] Implement create-if-missing flow for competition/team context.
- [ ] Implement row edit flow.
- [ ] Support own-team marker.
- [ ] Support multi club-team marker if needed by final model/UI decision.
- [ ] Preserve manual editing model.
- [ ] Expose public summary and full table reads.

Exit criteria:

- `/admin/clasificaciones` is DB-backed;
- public classification pages and summary panels use real standings.

## Phase 8 - News

Status: `[ ]`

Goal:
Replace mock news with real editorial content.

Checklist:

- [ ] Replace admin news source.
- [ ] Implement create/edit draft flow.
- [ ] Implement publish/unpublish flow.
- [ ] Support related teams.
- [ ] Support cover media relation.
- [ ] Support external video URL.
- [ ] Replace public news list source.
- [ ] Replace public news detail source.
- [ ] Keep content rendering structured and safe.

Exit criteria:

- admin and public news work from DB;
- no hardcoded public article lists remain in active routes.

## Phase 9 - Statistics

Status: `[ ]`

Goal:
Make statistics real after players, assignments, and matches are stable.

Checklist:

- [ ] Replace admin stats source.
- [ ] Use match as the edit context.
- [ ] Allow marking who played.
- [ ] Prevent non-playing records from adding `PJ`.
- [ ] Show season aggregates derived from match stats.
- [ ] Preserve first-team advanced stats vs academy basic stats.
- [ ] Replace public statistics pages with real aggregates.
- [ ] Replace player derived metrics with real aggregate inputs.

Exit criteria:

- stats are entered by match and displayed as season aggregates;
- public and admin statistics share the same real base data.

## Phase 10 - Media Persistence

Status: `[ ]`

Goal:
Move media from mock library behavior to real metadata persistence.

Checklist:

- [ ] Define final upload/storage approach compatible with Hostinger constraints.
- [ ] Persist `MediaAsset` metadata.
- [ ] Replace mock media library source.
- [ ] Support selecting stored media for teams, players, opponents, and news.
- [ ] Keep non-upload fallback path if storage implementation is staged.

Exit criteria:

- selected media references are real DB data;
- upload/selection flow is no longer purely mock.

## Phase 11 - Import Flow

Status: `[ ]`

Goal:
Implement the `rr-management` import workflow after base entities already work locally.

Checklist:

- [ ] Upload CSV/ZIP.
- [ ] Validate structure.
- [ ] Preview diff.
- [ ] Show conflicts.
- [ ] Apply merge/upsert.
- [ ] Store batch and item history.
- [ ] Preserve web-owned fields.
- [ ] Archive/inactivate instead of destructive deletion.

Exit criteria:

- import flow supports the documented MVP behavior end-to-end.

## Recommended Iteration Size

Each iteration should aim for one of these shapes:

- one public vertical slice;
- one admin module read integration;
- one admin module write flow;
- one shared service layer improvement.

Avoid mixing more than one heavy write module in the same iteration.

## Iteration Checklist Template

Copy this block into the session log each day:

```md
### Session YYYY-MM-DD

Goal:
- 

Scope:
- 

Tasks:
- [ ] Read relevant docs
- [ ] Implement service layer or screen slice
- [ ] Add or update validation
- [ ] Add loading/empty/error states
- [ ] Verify permissions
- [ ] Run build
- [ ] Run lint
- [ ] Update docs if needed

Results:
- 

Open issues:
- 

Next step:
- 
```

## Session Log

### Session 2026-07-05

Goal:

- Define the execution roadmap for replacing mocks with real logic.

Scope:

- Analyze current readiness.
- Define phases, order, and completion criteria.

Tasks:

- [x] Read relevant docs
- [x] Assess project readiness
- [x] Define phased roadmap
- [x] Define reusable iteration checklist
- [x] Record next recommended iteration

Results:

- Public visual foundation is ready enough to start real data integration.
- Admin should move in staged module-by-module replacement, not all at once.
- Team and player data foundations are the key unlockers for the rest of the product.

Open issues:

- Seed and public mock universe need alignment.
- Dashboard service exists but is not yet wired into the dashboard screen.
- Several admin modules still use local mock state patterns that must be gradually replaced.

Next step:

- Execute Phase 0 and start Phase 1 with the first public read-model services.

### Session 2026-07-05 - Iteration 1

Goal:

- Start the first real public data slice and stop depending on hardcoded home/news content as the primary source.

Scope:

- Phase 0 practical alignment.
- Phase 1 public services.
- Phase 2A home.
- Public news list and detail routes.

Tasks:

- [x] Read relevant docs
- [x] Confirm practical dataset strategy
- [x] Implement public service layer for home/news
- [x] Add fallback handling to preserve build/runtime safety
- [x] Connect `/` to real data for main blocks
- [x] Connect `/noticias` and `/noticias/[slug]` to real data
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- Home now reads real active-season data for first-team summary and academy summary, with fallback to the previous mock composition if the DB-backed service cannot resolve the data.
- News now reads published `NewsPost` data from DB, with fallback to mock articles when needed.
- The local implementation strategy is now explicit: use real active visible seeded entities as the primary dataset and keep fallbacks instead of forcing immediate seed expansion.
- Public pages remain cacheable with `revalidate = 300` on the routes updated in this iteration.

Open issues:

- Team summary pages, squad pages, standings pages and player pages still depend on mock content sources.
- Match detail public routes still use mock IDs/content, so home results/preview intentionally avoid linking to real match detail IDs for now.
- A shared reusable team-by-`publicSlug` DB read model is still pending.

Next step:

- Build the shared `public-teams-service` and connect `/primer-equipo`, `/equipos`, and `/equipos/[teamSlug]`.

## Next Recommended Iteration

Priority: high

Target:

- consolidate the first public read-model layer;
- connect real team summary routes;
- prepare the ground for public squads and admin dashboard.

Suggested exact scope:

- [ ] Create shared active-season visible team service keyed by `publicSlug`.
- [ ] Create first-team summary DB read model.
- [ ] Create academy team summary DB read model.
- [ ] Connect `/primer-equipo` to the new service.
- [ ] Connect `/equipos` to the new service.
- [ ] Connect `/equipos/[teamSlug]` to the new service.
- [ ] Keep explicit fallback handling while match detail/player detail remain mock-backed.

Definition of success for the next iteration:

- team summary routes stop depending on `PUBLIC_TEAM_PAGE_MOCKS`;
- one reusable public team read-model shape exists for both first team and academy pages;
- this document is updated with what changed.
