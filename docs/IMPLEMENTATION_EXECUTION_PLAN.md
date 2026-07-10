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
- [x] `public-teams-service`
- [x] `public-news-service`
- [ ] `admin-dashboard-service`
- [x] `admin-teams-service`

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

- [x] Replace first team summary page with real data.
- [x] Real coaches.
- [x] Real summary metrics.
- [x] Real top scorer.
- [x] Real related news.

### Phase 2C - Teams Directory And Team Summary

- [x] Replace `/equipos` data source.
- [x] Replace academy team detail summary data source.
- [~] Resolve team by `publicSlug`.
- [x] Reuse shared team summary DTO.

### Phase 2D - Calendars, Match Detail, Standings, Statistics

- [x] Replace public calendar sources.
- [x] Replace public match detail sources.
- [x] Replace public standings sources.
- [x] Replace public statistics sources.
- [x] Keep academy vs first-team feature flags explicit.

### Phase 2E - Players And News Detail

- [x] Replace first-team squad source.
- [x] Replace academy squad source.
- [x] Replace player profile source.
- [x] Replace news list source.
- [x] Replace news detail source.

Exit criteria:

- all active public routes read from real services;
- public mock content only remains where explicitly accepted as temporary fallback.

## Phase 3 - Admin Dashboard And Shared Admin Context

Status: `[~]`

Goal:
Make the admin shell read real operational data before deep CRUD work starts.

Checklist:

- [x] Wire dashboard page to `getAdminDashboardData`.
- [x] Stop using `adminMock*` in dashboard for metrics and alerts.
- [x] Show active season, teams, upcoming matches, draft news, import summary from DB.
- [x] Respect role scoping in service results.
- [x] Add admin empty states for real no-data scenarios.
- [ ] Shared admin season/team filter source.
- [ ] Shared admin option lists based on DB instead of mock arrays.

Nice follow-up inside same phase if time allows:

- [ ] tighten remaining admin module permissions against their final per-role scope;
- [ ] reuse dashboard scope helpers across the next admin services.

Exit criteria:

- dashboard is DB-backed;
- admin no longer depends on fake overview counts.

## Phase 4 - Teams And Visible Coaches

Status: `[~]`

Goal:
Make `/admin/equipos` the first real editable module because it unlocks both public and admin consistency.

Checklist:

- [x] Replace team list source with DB-backed team query.
- [x] Query `SeasonTeam`, `Team`, `Competition`, `TeamCoach`.
- [x] Keep informative visible coaches separate from permissions.
- [x] Implement create team flow.
- [x] Implement edit team flow.
- [x] Implement visibility toggle.
- [x] Implement active toggle.
- [~] Implement visible coach add/edit/remove/reorder flow.
- [x] Preserve first-team ordering rule.
- [x] Preserve competition selection from existing competition options.
- [x] Add Zod validation for writes.
- [x] Enforce role access server-side.

Exit criteria:

- `/admin/equipos` works end-to-end against DB;
- public team summaries can trust real team metadata and visible coaches.

## Phase 5 - Players And Assignments

Status: `[~]`

Goal:
Make roster and player profile data real, because this unlocks squad pages, player detail, and later stats.

Checklist:

- [x] Create admin player read model.
- [x] Create admin assignment/roster read model.
- [x] Replace player profile editor mock source.
- [x] Replace roster source with DB-backed assignments.
- [~] Implement player create/edit public fields.
- [~] Implement assignment create/edit/archive flow.
- [x] Keep shirt number and public position assignment-level.
- [~] Preserve active/history rules.
- [x] Preserve slug uniqueness rules.
- [x] Add player visibility toggle.
- [x] Add photo/card media references as metadata fields even if upload flow stays later.

Public dependency checks:

- [x] first-team squad page reads real assignments;
- [x] academy squad pages read real assignments;
- [x] player public pages read real player + profile + assignment + stats aggregates.

Exit criteria:

- admin player and roster workflows are DB-backed;
- public squad and player pages can use real data.

## Phase 6 - Matches

Status: `[~]`

Goal:
Make matches the central source for public calendars, previews, and admin journey operations.

Checklist:

- [x] Replace admin matches list source.
- [x] Implement create match flow.
- [x] Implement edit match flow.
- [x] Implement quick result/status updates.
- [x] Support first-team video URL.
- [x] Preserve coach scope restrictions.
- [x] Use competition/team defaults where documented.
- [x] Keep status model aligned with schema and public UI rules.
- [x] Add pagination or bounded result strategy.

Public dependency checks:

- [ ] home next match reads real match;
- [ ] recent results read real matches;
- [ ] calendar pages read real matches;
- [ ] match detail pages read real matches and related stats.

Exit criteria:

- match lifecycle is DB-backed and reused by public pages.

## Phase 7 - Standings

Status: `[~]`

Goal:
Make standings fully manual but real, aligned with the MVP rule that they are not auto-derived from matches.

Checklist:

- [x] Replace admin standings source.
- [x] Implement standings table selection flow.
- [x] Implement create-if-missing flow for competition/team context.
- [x] Implement row edit flow.
- [x] Support own-team marker.
- [~] Support multi club-team marker if needed by final model/UI decision.
- [x] Preserve manual editing model.
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

Status: `[x]`

Goal:
Make statistics real after players, assignments, and matches are stable.

Checklist:

- [x] Replace admin stats source.
- [x] Use match as the edit context.
- [x] Allow marking who played.
- [x] Prevent non-playing records from adding `PJ`.
- [x] Show season aggregates derived from match stats.
- [x] Preserve first-team advanced stats vs academy basic stats.
- [x] Replace public statistics pages with real aggregates.
- [x] Replace player derived metrics with real aggregate inputs.

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

### Session 2026-07-05 - Iteration 2

Goal:

- Replace the main public team summary sources with real active-season data.

Scope:

- Shared public team service.
- `/primer-equipo`
- `/equipos`
- `/equipos/[teamSlug]`

Tasks:

- [x] Review current public team summary contract
- [x] Implement shared public team DB read model
- [x] Add explicit fallback to mock content for unresolved teams
- [x] Connect team summary routes to the shared service
- [x] Keep route-level behavior stable
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- A new shared team service now resolves active visible teams from DB and maps them into the existing public summary DTO shape.
- `getPublicTeamPageContent` and `getPublicAcademyTeamPageContent` now prefer DB-backed data and fall back to the previous mock dataset only when the requested team is not present in the active visible season.
- `/equipos` now prefers a DB-backed directory built from active visible teams and falls back to the previous mock directory when needed.
- `/primer-equipo` and academy team summary pages now use real coaches, real summary metrics, real standings summary, real recent results and real related news when the team exists in seed data.

Open issues:

- Public squads, player pages, standings pages, statistics pages and match detail pages still rely fully or partially on older mock layers.
- Team resolution by `publicSlug` is now effectively in place for seeded active teams, but not yet standardized as a single reusable resolver module for all public slices.
- Real player-detail linking is still intentionally incomplete, so top scorer links remain omitted in DB-backed team summaries.

Next step:

- Connect the public squad and player foundations so the public summaries can link into real roster/player data without falling back to mock identities.

### Session 2026-07-05 - Iteration 3

Goal:

- Connect public squad pages to real roster data from active-season assignments.

Scope:

- Public roster read model.
- `/primer-equipo/plantilla`
- `/equipos/[teamSlug]/plantilla`

Tasks:

- [x] Review squad card contract and current roster seed sources
- [x] Implement roster DB read model from assignments, players and aggregated stats
- [x] Preserve mock fallback for unresolved teams
- [x] Connect first-team squad page to real roster data
- [x] Connect academy squad page to real roster data for seeded teams
- [x] Keep player-detail links non-breaking while detail pages remain mixed
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- A new roster service now builds public squad data from active-season assignments, player public fields and aggregated `PlayerMatchStats`.
- `/primer-equipo/plantilla` now prefers DB-backed roster data and falls back to the previous seed-based squad when required.
- `/equipos/[teamSlug]/plantilla` now prefers DB-backed roster data for active visible seeded teams and keeps the existing fallback/placeholder behavior for unresolved cases.
- Team summaries and squad pages now share the same real foundation for seeded active teams.

Open issues:

- Public player detail pages still depend on old mock identity/profile sources.
- Public player links from DB-backed squads are intentionally conservative because the player-detail routes have not yet been migrated to the same real foundation.
- Statistics pages still use older squad/profile content sources rather than the new roster service.

Next step:

- Connect public player detail foundations, or alternatively wire the admin dashboard next if we want to switch focus to the backoffice shell.

### Session 2026-07-05 - Iteration 4

Goal:

- Replace the public player detail routes with real active-season player data.

Scope:

- Public player detail read model.
- `/jugadores/[playerSlug]`
- `/equipos/[teamSlug]/jugadores/[playerSlug]`

Tasks:

- [x] Review player detail route behavior and visual contract
- [x] Implement shared DB-backed public player detail service
- [x] Reuse assignment and aggregated match stats as the real source
- [x] Keep explicit mock fallback for unresolved players
- [x] Connect first-team public player detail route
- [x] Connect academy public player detail route
- [x] Restore stable public player links from squad pages
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- Public player detail now reads active-season players from DB using `player + assignment + playerMatchStats` aggregates and only falls back to the old mock profile sources when the DB cannot resolve the requested player.
- `/jugadores/[playerSlug]` now serves real first-team player pages, and still redirects or disambiguates academy players from the global route when needed.
- `/equipos/[teamSlug]/jugadores/[playerSlug]` now serves real academy player pages for seeded active visible teams.
- Shared player mapping logic was extracted so roster and player-detail slices now use the same public-safe identity and stat conversion rules.
- Build passes and lint remains limited to the two existing non-blocking warnings unrelated to this slice.

Open issues:

- Public statistics routes still read older mock-based squad/profile sources rather than the new roster/player services.
- Public calendars, match detail and standings are still pending DB-backed migration.
- MVP `MVP's` remain fallback-only at `0` for DB-backed players until that metric exists in the real model.

Next step:

- Reuse the new player foundation in the public statistics routes, or switch focus to wiring the admin dashboard if we want the first backoffice screen to become real next.

### Session 2026-07-06 - Iteration 5

Goal:

- Move public statistics pages to the real active-season roster foundation.

Scope:

- Public statistics read model.
- `/primer-equipo/estadisticas`
- `/equipos/[teamSlug]/estadisticas`

Tasks:

- [x] Review statistics page composition and current mock source
- [x] Implement DB-backed public statistics service
- [x] Reuse real team summary plus real roster aggregates
- [x] Keep explicit fallback to existing mock statistics content
- [x] Connect first-team statistics page to the new service
- [x] Connect academy statistics pages to the new service
- [x] Keep first-team advanced vs academy basic behavior explicit
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- Public statistics pages now resolve from real active-season data by composing the existing DB-backed team summary with the DB-backed roster aggregate layer.
- The statistics UI itself did not need to change; only the content source was replaced, which keeps the visual layer stable and reduces rework.
- First Team statistics still expose the advanced stat set, while academy team statistics keep the reduced/basic variant through the same shared player profile contract.
- Route caching is now explicit on both statistics pages with `revalidate = 300`.
- Build passes and lint remains limited to the same two existing project warnings unrelated to this slice.

Open issues:

- Public calendars, public match detail and public standings still depend on older mock-oriented sources.
- Real `MVP's` are still not populated from DB and therefore remain `0` on DB-backed player/stat pages until that metric exists in the real model.
- Team resolution by `publicSlug` still works in practice for the active visible season, but is not yet centralized as one reusable resolver for every public slice.

Next step:

- Continue with public calendars/match detail/standings to close the remaining public read-model gap, or switch to the admin dashboard if we want the first backoffice screen to become real now.

### Session 2026-07-06 - Iteration 6

Goal:

- Move public calendar pages to the real active-season match foundation.

Scope:

- Public calendar read model.
- `/primer-equipo/calendario`
- `/equipos/[teamSlug]/calendario`

Tasks:

- [x] Review calendar routes, UI contract and match schema
- [x] Implement DB-backed public calendar service
- [x] Map real match status/date/score/team data to the existing calendar DTO
- [x] Preserve academy vs first-team behavior differences
- [x] Keep explicit fallback to the existing mock calendars
- [x] Connect first-team public calendar page
- [x] Connect academy public calendar pages
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- Public calendar pages now prefer real active-season `Match` data from DB and fall back to the existing mock calendars only when the team cannot be resolved from the active visible season.
- First Team keeps the real `live` state, while academy calendars normalize `live` away from the public UI and continue treating postponed fixtures as pending in practice.
- The existing calendar UI and filters were preserved intact, which keeps the visual layer stable while replacing only the data source.
- `revalidate = 300` is now explicit on both calendar route families.
- Build passes and lint remains limited to the same two existing project warnings unrelated to this slice.

Open issues:

- Some public pages now truthfully show empty states when DB content is still missing instead of silently inventing mock sports data.
- Some public summary blocks already deep-link to real match detail records, but there are still other pages with mixed DB/mock origin depending on the underlying data coverage.
- Team-by-`publicSlug` resolution still works in practice but is not yet centralized as a single reusable resolver for every public slice.

Next step:

- Pivot to the admin dashboard or admin standings workspace now that the main public read-model gap is effectively closed.

### Session 2026-07-07 - Iteration 7

Goal:

- Make `/admin` the first genuinely DB-backed backoffice screen.

Scope:

- Admin dashboard service wiring.
- Real dashboard metrics, lists and alerts.
- Role-aware dashboard scoping.
- Server-side admin permission fix for section access/navigation.

Tasks:

- [x] Wire `/admin` to `getAdminDashboardData`
- [x] Replace dashboard metrics and alerts fed by `adminMock*`
- [x] Show real active season, scoped teams, players, open matches and upcoming matches
- [x] Add recent results and real no-data states
- [x] Use the authenticated user role instead of forcing the owner preview role
- [x] Fix `canAccessAdminSection` and role-filtered admin navigation
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin` now reads real DB data through `getAdminDashboardData` and no longer depends on `adminMock*` for counts, lists or alert cards.
- The dashboard is now scoped by the authenticated role: coaches only see assigned-team data, while manager/superadmin keep the broader operational view.
- Real empty states are now explicit for upcoming matches, recent results, missing assigned teams and missing manual standings coverage.
- Admin section access and sidebar navigation now respect the role matrix instead of exposing every route by mistake.
- Build passes and lint remains limited to the same two existing project warnings unrelated to this slice.

Open issues:

- The dashboard is real, but most deeper admin modules still rely on local mock state patterns.
- Shared admin option sources and reusable scoped selectors are still pending before the rest of the backoffice migration accelerates.
- `/admin/clasificaciones` now loads real teams and real tables, but save/create still operate only in the local editor layer.

Next step:

- Add real persistence and create-if-missing flow to `/admin/clasificaciones`, or alternatively extract shared admin team/season scope helpers before the next module.

### Session 2026-07-07 - Iteration 8

Goal:

- Move `/admin/clasificaciones` from mock loading to real team/table selection.

Scope:

- DB-backed standings read service for admin.
- Role-aware team/table loading.
- Real initial state for the standings workspace.

Tasks:

- [x] Load real standings tables from DB
- [x] Load real team options from DB
- [x] Scope standings data by authenticated role
- [x] Stop forcing owner preview role in `/admin/clasificaciones`
- [x] Keep the current client editor and validation layer intact
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/clasificaciones` now reads real active-season teams and real standings tables from DB through a dedicated admin service.
- Team and competition selection now operate on real data instead of the previous standings mock catalog.
- The page now respects the authenticated user role and assigned-team scope before hydrating the client editor.
- The existing editor, validation rules and unsaved-changes flow were preserved, which keeps the UX stable while replacing the source layer.
- Build passes and lint remains limited to the same two existing project warnings unrelated to this slice.

Open issues:

- Shared competition tables now work better in the selection flow, but the database model still cannot explicitly link each own-team row to a concrete `SeasonTeam`.
- Multi-club-team persistence is functionally supported through multiple `isOwnTeam` rows, but the current schema still relies on team-name matching when the table is reloaded.
- The next backoffice acceleration point is now a new module, or a deeper hardening pass on standings if we want stronger multi-team semantics.

Next step:

- Move to the next admin module, or harden standings further if we want a stronger shared-table model before continuing.

### Session 2026-07-07 - Iteration 9

Goal:

- Complete the real standings workflow with persistence and scaffold creation.

Scope:

- Server action save flow for standings.
- Server action create-if-missing flow for standings.
- Public/admin revalidation after standings changes.
- Shared-table lookup improvements in the client selector.

Tasks:

- [x] Persist standings edits to MySQL
- [x] Recalculate rows on save using `PTS SA`
- [x] Revalidate admin and public standings routes after save/create
- [x] Create missing standings tables from the current team/competition context
- [x] Seed the created table with own-team rows plus placeholder rivals
- [x] Improve team selection so shared competition tables can still be found
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/clasificaciones` now supports real end-to-end save persistence instead of stopping at local client state.
- Missing standings tables can now be created from the current team or competition context directly from the screen.
- New tables are scaffolded with club-team rows and placeholder rivals so the editor is immediately usable without a blank canvas.
- Saving or creating a standings table now revalidates the related admin and public pages, which keeps summaries and classification routes aligned.
- The team-based selector now also finds shared tables when the selected team appears as one of multiple club rows inside the same competition table.

Open issues:

- The current database model still has no explicit row-to-`SeasonTeam` relation inside a standings table, so multi-club-team recovery depends on matching row names to team names.
- The standings module is now operationally real, but other admin modules still use local mock state patterns.
- If we want deeper robustness here, the next improvement would be a schema-level way to identify multiple club rows explicitly.

Next step:

- Move to the next admin module, or refactor the standings data model if we want stronger multi-team semantics before continuing.

### Session 2026-07-07 - Iteration 10

Goal:

- Convert `/admin/equipos` from local mock state to a real DB-backed admin module.

Scope:

- Admin teams read service.
- Server actions for create/edit/toggles.
- Real role-aware page wiring for `/admin/equipos`.
- Replace fake logo/banner selects with URL-backed fields.

Tasks:

- [x] Load teams from `SeasonTeam`, `Team`, `Competition` and `TeamCoach`
- [x] Scope coach view to assigned teams
- [x] Replace forced owner preview role with authenticated role
- [x] Persist create/edit flows to MySQL
- [x] Persist active/public visibility toggles
- [x] Keep visible coaches as informative team data, not permission links
- [x] Revalidate related admin and public routes after writes
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/equipos` now loads real teams from DB instead of `team-management-mocks`.
- Managers and superadmins can now create teams, edit team metadata, update visible coaches and toggle visibility/active status against MySQL.
- Coaches now see the page in real scoped consultation mode using their assigned teams instead of a forced preview role.
- Team media fields now accept real URLs and persist them through `MediaAsset` metadata records rather than placeholder-only mock options.
- Build passes and lint remains limited to the same two existing non-blocking warnings unrelated to this slice.

Open issues:

- Changing the season of an existing team is intentionally not supported yet to avoid unsafe historical moves.
- Visible coach ordering currently follows the editor list order, but the UI still lacks explicit reorder controls.
- Competition selection depends on the existing competition catalog, so the bootstrap story is still coupled to seeded/imported competition data.

Next step:

- Move to `/admin/partidos` or `/admin/jugadores`, reusing the same DB-backed pattern and role-scoped server actions.

### Session 2026-07-07 - Iteration 11

Goal:

- Convert `/admin/partidos` from mock preview state to a real DB-backed operational module.

Scope:

- Admin matches read service.
- Server actions for create/edit and quick result.
- Real role-aware page wiring for `/admin/partidos`.
- Real opponent/venue catalogs derived from persisted match data.

Tasks:

- [x] Load matches from DB instead of `match-management-mocks`
- [x] Scope teams and matches by authenticated role
- [x] Replace forced owner preview role with authenticated role
- [x] Persist create/edit flow to MySQL
- [x] Persist quick result flow to MySQL
- [x] Revalidate related admin and public routes after writes
- [x] Preserve coach simplified flow and team switcher behavior
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/partidos` now reads real active-season matches from DB and no longer depends on the mock match catalog as its primary source.
- Managers and superadmins can now create and edit matches, while coaches stay scoped to assigned teams and can resolve the quick result flow against real data.
- Match competition continues to resolve automatically from the selected team, and First Team played matches can persist an external highlights URL.
- Opponent and venue selects now use reusable values derived from real persisted matches instead of hardcoded local arrays.
- Build passes and lint remains limited to the same two existing non-blocking warnings unrelated to this slice.

Open issues:

- This first real matches iteration is scoped to the active season to avoid slug/season ambiguity in the existing admin UI.
- Rival and venue catalogs are still derived from existing matches because the schema does not yet have dedicated `opponents` or `venues` entities.
- Quick result preserves the existing match time when only the date changes, but a richer dedicated result workflow could still come later.

Next step:

- Move to `/admin/jugadores` or `/admin/estadisticas`, with matches now ready to act as the real editing context for stats.

### Session 2026-07-09 - Iteration 12

Goal:

- Convert `/admin/jugadores` from local mock editing to a real DB-backed public profile module.

Scope:

- Admin players read service.
- Server action for public profile persistence.
- Real role-aware page wiring for `/admin/jugadores`.
- Keep assignment-owned fields as read-only context from the active roster.

Tasks:

- [x] Load players from DB instead of `adminMockPlayers`
- [x] Scope players by authenticated role
- [x] Replace forced owner preview role with authenticated role
- [x] Persist editable public profile fields to MySQL
- [x] Preserve slug uniqueness and public revalidation after save
- [x] Keep coaches in consultation mode only
- [x] Keep team, dorsal and position as assignment-level read-only fields
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/jugadores` now reads real active-season player profiles from DB and no longer depends on the mock player catalog as its primary source.
- Managers and superadmins can now persist the public player profile fields that belong here: public name, slug, country, dominant foot, photo URL, visibility and active status.
- Coaches keep access to the screen in scoped read-only mode, which matches the product rule that they should not edit player identity/profile structure.
- Team, shirt number and public position now appear as derived roster context from the active assignment instead of being editable in the player profile screen.
- Player photo persistence now creates or reuses `MediaAsset` metadata records, and saves revalidate the affected admin and public player/team routes.
- Build passes and lint remains limited to the two existing unrelated project warnings outside this module.

Open issues:

- `/admin/asignaciones` is still mock-driven, so assignment creation/moves/history are not real yet.
- Player creation is still pending because the current iteration focused on editing the final public profile for already assigned players.
- Card styling remains derived from team type; there is still no separate advanced media workflow for cards beyond the stored base photo URL.

Next step:

- Convert `/admin/asignaciones` to a real DB-backed roster workflow so Phase 5 stops depending on mock assignment state.

### Session 2026-07-09 - Iteration 13

Goal:

- Convert `/admin/asignaciones` from local mock state to the real active-season roster workflow.

Scope:

- Admin assignments read service.
- Server actions for roster edit and alta.
- Real page wiring for `/admin/asignaciones`.
- Keep profile-owned fields separated from assignment-owned fields.

Tasks:

- [x] Load assignments from DB instead of mock roster state
- [x] Load real active-season teams and player options
- [x] Replace local roster editing with server-backed save flow
- [x] Implement alta flow from the roster screen
- [x] Preserve shirt number, public position and captain as assignment-level fields
- [x] Close previous active assignment when moving a player inside the active season
- [x] Keep the link from roster to `/admin/jugadores`
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/asignaciones` now reads real active-season assignments from DB and no longer depends on the mock roster generator.
- Managers and superadmins can now edit dorsal, posicion publica, capitania, alta y cierre de etapa against MySQL from the roster screen itself.
- The roster flow now supports two real alta paths: assign an existing player to the selected team, or create a minimal new player and assign them in one step.
- When an existing player is moved to another team in the active season, the previous active assignment is closed automatically before activating the new one, which keeps history safer without touching historical stats.
- The screen now treats name, slug, foto and visibility as profile-owned data and sends the user to `Fichas y cromos` for that layer instead of duplicating ownership inside `Plantilla`.
- Build passes and lint remains limited to the same two existing unrelated project warnings outside this module.

Open issues:

- The alta nueva path creates a minimal player profile intended to be refined afterwards in `/admin/jugadores`, so richer player creation fields are still pending.
- Assignment editing is scoped to the active season; deeper historical season management is still outside this iteration.
- There is still no dedicated archive/history explorer beyond the inactive assignment rows already shown in the active-season team view.

Next step:

- Close the remaining Phase 5 gaps around richer player-create polish if needed, or pivot to `/admin/estadisticas` now that players, assignments and matches are all real.

### Session 2026-07-09 - Iteration 14

Goal:

- Convert `/admin/estadisticas` from mock state to real match-context stat editing.

Scope:

- Admin stats read service.
- Server action for per-match stat persistence.
- Real role-aware page wiring for `/admin/estadisticas`.
- Team-context player modelling for regular roster players and occasional reinforcements.

Tasks:

- [x] Load real played matches from DB instead of mock match context
- [x] Load real team/player context with role scoping
- [x] Replace mock stat state hydration with DB-backed state
- [x] Persist per-match stat edits to MySQL
- [x] Keep match participation as the source of `PJ`
- [x] Allow occasional players from other club teams in the active match
- [x] Preserve first-team advanced vs academy basic stat sets
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- `/admin/estadisticas` now reads real active-season teams, played matches, team-scoped player contexts and persisted `PlayerMatchStats` rows from DB.
- The screen now works with the authenticated role instead of forcing the owner preview role, so coaches stay limited to their assigned teams while managers and superadmins can move across the broader scope.
- Stat saves now persist per-match participation and stats through a real server action, and revalidate the affected admin, team and player pages afterwards.
- Occasional players from other club teams now enter the active match as a team-specific stats context, which keeps the visible aggregate tied to the selected team instead of leaking totals from their normal squad.
- The existing stats UI was largely preserved, but its data source is now real and aligned with the documented rule that the selected match is the edit context while season totals stay visible.
- `MVP` is now persisted in `PlayerMatchStats`, restored in the admin editor, and fed back into public/admin aggregates and public match detail badges.

Open issues:

- This first real stats iteration is scoped to played matches only, which matches the product rule but still leaves future room for deeper historical review tooling.
- Guest-player support is now real for the active match context, but there is still no separate audit/history surface dedicated to those exceptional appearances.

Next step:

- Move to `/admin/noticias` or the next remaining content slice now that the known MVP persistence gap is closed.

### Session 2026-07-09 - Iteration 15

Goal:

- Close the last real persistence gap in statistics before manual validation.

Scope:

- Prisma schema + migration for `MVP`.
- End-to-end admin/public reads and writes using the real field.
- Local environment alignment so build and manual review run against the updated DB shape.

Tasks:

- [x] Add `mvp` to `PlayerMatchStats`
- [x] Create and apply the migration locally
- [x] Restore the editable MVP control in admin stats
- [x] Persist `MVP` in the server action save flow
- [x] Feed `MVP` into player aggregates for admin/public surfaces
- [x] Feed `MVP` into public match detail performance badges
- [x] Run `prisma generate`
- [x] Run `prisma validate`
- [x] Run build
- [x] Run lint
- [x] Update docs

Results:

- The last known mismatch in `/admin/estadisticas` is closed: `MVP` now exists in Prisma, MySQL, admin saves, season aggregates and public reads.
- Public player summaries and team/player statistics now count real persisted `MVP` values instead of always resolving them to zero.
- Public match detail pages can now show the `MVP` badge from DB-backed `PlayerMatchStats` rows.
- The local database schema has been migrated successfully, which was required for static generation and manual validation to work again.
- Build passes again, and lint remains limited to the same two existing unrelated warnings.

Open issues:

- Manual product validation is still needed before deciding the clean reset/import path for real season data.
- News remains the next major admin content module still pending full DB-backed replacement.

Next step:

- Use the app manually to validate the full sports flow, and then define the reset/bootstrap path for introducing real data with less manual effort.

## Next Recommended Iteration

Priority: high

Target:

- move to the next major DB-backed content slice after closing real stats persistence.

Suggested exact scope:

- Option A - Move to the next admin content slice
- [ ] Replace `/admin/noticias` source with DB-backed editorial data.
- [ ] Implement create/edit draft flow.
- [ ] Implement publish/unpublish flow.
- [ ] Keep related teams, cover media and external video URL aligned with MVP docs.

- Option B - Prepare validation and data bootstrap
- [ ] Run manual validation over teams, players, assignments, matches, standings and stats with the real flows now connected.
- [ ] Define the post-validation reset/import path for introducing real season data without manual re-entry.
- [x] Create a dedicated reset/bootstrap plan in `docs/RESET_AND_INITIAL_LOAD_PLAN.md`.

Definition of success for the next iteration:

- if Option A:
- the next major mock-driven admin content module after stats is replaced with real DB data;
- if Option B:
- the current sports/admin base is manually validated and ready for a clean data reset/import pass;
- this document is updated with what changed.
