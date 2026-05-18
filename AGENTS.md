# AGENTS.md - Rising Raimon Web Platform

## Project goal
Build the new Rising Raimon public sports website and sports backoffice.

The platform is designed for future growth to around 15 teams and multiple managers/coaches. It must provide:

- A public website for club information, First Team, teams, players, matches, standings, statistics, news and media.
- A private sports backoffice for managing only public/sports website data.
- Low operational cost by using the existing Hostinger Business Web Hosting plan.
- Clear separation from the existing internal `rr-management` app and WordPress/WooCommerce shop.

## Current implementation strategy

The current repository may already contain a valid technical base: Prisma, MySQL, migrations, auth, docs and server utilities. If asked to rebuild the UI, do not delete the technical base.

Preserve unless explicitly asked otherwise:

- `prisma/`, including `schema.prisma` and `migrations/`
- `docs/`
- `AGENTS.md`
- auth/session/protection code
- `server/auth/*`
- `server/db/*`
- `server/services/*`
- `server/validators/*`
- `lib/utils.ts`
- `.env.example`
- project config needed by Next.js, Prisma, Tailwind and TypeScript

If the previous frontend is unsatisfactory, rebuild the frontend from scratch over the existing technical base. Prefer a clean `src/app` + `src/components` structure. Do not keep both `app/` and `src/app/` trees active with duplicate routes.

## Closed product decisions

- Hostinger Business Web Hosting is the target infrastructure for the new platform to avoid extra infrastructure cost.
- Use Node.js + MySQL because those are available in Hostinger Business.
- Keep WordPress/WooCommerce for shop, products, cart, Stripe payments, orders and buyer accounts.
- The shop will live at `tienda.risingraimon.es`.
- Do not implement ecommerce, cart, Stripe checkout or buyer accounts in the MVP.
- The new app has internal users only: `superadmin`, `manager`, `entrenador`.
- Buyer/customer users remain in WordPress/WooCommerce.
- Keep the existing `rr-management` only as an internal administrative system.
- Do not use `rr-management` as a live backend/runtime dependency for the public website.
- Reuse only stable sports master data from `rr-management`: seasons, teams, players and assignments.
- Import master data by CSV/ZIP snapshot with intelligent merge/upsert, never destructive replacement.
- Do not use Excel as the main database. CSV/Excel/JSON are import/export formats only.
- Cache public pages/data wherever possible to avoid unnecessary MySQL load.
- Admin/backoffice may read/write MySQL in real time.

## Recommended stack

- Next.js App Router
- TypeScript strict
- MySQL
- Prisma
- Auth.js or equivalent secure admin auth
- Tailwind CSS
- Zod for validation
- shadcn/ui only if it exists or is intentionally introduced; do not depend on it blindly

## Prisma / MySQL runtime notes

If the project uses Prisma 7+ with MySQL, `PrismaClient` may require `@prisma/adapter-mariadb` and `mariadb` at runtime. In that case:

- Keep `DATABASE_URL` for Prisma CLI/migrations.
- Use separate runtime variables for the adapter when needed: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`.
- Do not pass a full `connectionString` to `PrismaMariaDb`; use host/user/password/database/port/connectionLimit config.
- Keep DB pool small, normally 5-10 connections.

## Infrastructure constraints

- Hostinger Business Web Hosting.
- 5 Node.js apps available.
- Node.js versions available: 18.x, 20.x, 22.x, 24.x.
- Prefer Node.js 20 LTS for deployment unless the project is already validated on a newer version.
- MySQL maximum: 75 simultaneous connections.
- Use environment variables for secrets.
- GitHub deployment is available.
- Cron jobs are available for lightweight tasks only.
- Backups exist in Hostinger, but create manual DB backups before migrations or major imports.

## Architecture principles

- Separate public data from private/internal data.
- The public website must never consume private `rr-management` APIs.
- Never expose sensitive data on public endpoints.
- Public pages should be cached/static/incrementally regenerated where possible.
- Keep public web, sports backoffice and ecommerce responsibilities separated.
- Avoid overengineering in the MVP.
- Do not add paid services unless explicitly requested.
- Validate permissions server-side, not only by hiding UI buttons.
- Do not physically delete entities with history; use active/visible/status/deletedAt/endDate patterns.

## Product boundaries

### New Rising Raimon Web Platform owns

- Public sports website.
- Sports backoffice.
- Internal backoffice users and roles.
- Public teams.
- Public players.
- Player cards/cromos.
- Public matches/results.
- Public standings.
- Public player/team statistics.
- News/public posts in the new platform.
- Public media/image metadata.
- Import from `rr-management` season snapshot.

### Existing rr-management owns

- Internal administrative club management.
- Sensitive person records.
- Internal finance/accounting.
- Clothing/stock/logistics/deliveries.
- Internal payments or administrative tracking.
- Master records used for seasonal export.

### Existing WordPress/WooCommerce owns

- Shop.
- Products.
- Cart.
- Stripe payments.
- Orders.
- Buyer/customer accounts.
- Transactional commerce emails.

## Roles and locked permissions

- `superadmin`: full access. Only role that can manage users, roles, coach-team permissions and imports from `rr-management`.
- `manager`: manages sport/public content, teams, players, matches, standings, statistics, news and media. Cannot manage users/roles or imports.
- `entrenador`: can only edit allowed data for assigned teams: next match, match results/status, standings and allowed goals/assists/statistics. Cannot upload media, create teams, manage users, import data or edit unrelated teams.
- Team creation is restricted to `superadmin` and `manager`.
- Managers can assign existing coaches to teams where the user already exists, only if the implemented permission model allows it; user creation remains `superadmin` only.
- A team can show multiple public coaches, but MVP expects one coach account per team named `entrenador_<team_slug>`.

## Sports rules

- Standings are manual in the MVP.
- Not all rival results are registered.
- A team competes in one competition at a time in MVP.
- No public tournaments in MVP.
- Match statuses: scheduled/pending, live, played, postponed.
- The `live` state is mainly relevant to the First Team, but can exist technically for all teams.
- The First Team has advanced stats and premium cards built in the web by layers/components.
- Other teams have reduced stats and generated standard cards.
- Statistics stay attached to the player + team + season + match where they were created. Do not move historical stats if a player changes team.
- Goal participation = goals + assists.
- MVP is manual for municipal/RFFM data. External integrations are future work only.

## Cards, media and videos

- First Team cards are premium cards built in the web by layers/components, not final PNGs.
- The player photo/base image is one layer; dorsal, name, country/flag, position, stats and dominant foot are rendered as UI/text.
- Non-first-team cards are generated by the web using: foot, public name, shirt number, country flag, position, goals and assists.
- Images are stored as files/URLs, not BLOBs in MySQL.
- Videos are external URLs, not uploaded files.
- News can include cover image and external video links.
- Played First Team matches can include associated external video URL.
- Coaches cannot upload photos, cards, logos or news media.

## rr-management import rules

- Use external IDs from `rr-management` as stable import keys: `sourceSeasonId`, `sourceTeamId`, `sourcePersonId`, `sourceAssignmentId` when available.
- Do not import NIF/DNI, address, contact, private notes, document status, finance, clothing, stock, deliveries or payment data.
- Use merge/upsert, never blind delete-and-recreate.
- If an imported record already exists, update only master/import-controlled fields.
- Preserve web-owned fields such as slug, public name override, photo, card design, public visibility, bio, match data, standings and statistics.
- If a player/team disappears from a snapshot, mark the relevant assignment/entity inactive/archived; do not hard delete when history exists.
- If a player changes team, close/inactivate the previous imported primary assignment and create/update the new one. Preserve historical stats with the original team/season/match.
- Manual exceptional assignments may exist and must not be removed automatically unless explicitly confirmed.
- Every import must show a diff preview before applying changes.

## Frontend rebuild rules

When using Stitch/reference ZIPs or generated mockups:

- Treat them as visual/structural references, not as code to paste wholesale.
- Reimplement screens as clean Next.js/React/TypeScript components.
- Do not paste huge static HTML without componentization.
- Use mocks only until real services exist.
- Keep public and admin component trees separated.
- Build in small phases: visual foundation, public home, First Team detail, standard team detail, admin shell, then CRUDs.
- Do not implement all pages in one task.

Recommended frontend structure:

```text
src/app/(public)/
src/app/admin/
src/app/api/auth/[...nextauth]/route.ts
src/components/public/
src/components/admin/
src/components/layout/
src/components/shared/
src/server/
src/lib/
```

If the repo currently has `app/`, migrate carefully to `src/app`. Do not delete old routes until the new equivalents exist and the build passes.

## UI content rule

- Avoid technical, explanatory or overly verbose on-screen copy in public and admin interfaces.
- Prefer visual hierarchy, spacing, labels and layout over paragraphs.
- Keep UI text short, clear and calm.
- When in doubt, reduce copy and let structure communicate the page purpose.

## Coding rules

- Use TypeScript strictly.
- Prefer small, composable components.
- Keep business logic out of presentational components.
- Centralize database access.
- Validate all writes with Zod or equivalent.
- Do not create endpoints that return sensitive/private fields.
- Use pagination for large admin lists.
- Use slugs for public URLs.
- Add indexes for frequently queried fields.
- Use soft delete/active flags where historical integrity matters.

## Expected commands

Adjust if the generated project uses different scripts.

```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma validate
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```


## Public website specification - locked scope

The public website is now considered defined at product/navigation level. Connect real data later; do not reinvent the public IA unless explicitly requested.

Canonical public routes:

```text
/
/primer-equipo
/primer-equipo/plantilla
/primer-equipo/calendario
/primer-equipo/clasificacion
/primer-equipo/partidos/[matchId]
/equipos
/equipos/[teamSlug]
/equipos/[teamSlug]/plantilla
/equipos/[teamSlug]/calendario
/equipos/[teamSlug]/clasificacion
/equipos/[teamSlug]/partidos/[matchId]
/equipos/[teamSlug]/jugadores/[playerSlug]
/jugadores/[playerSlug]
/noticias
/noticias/[slug]
```

Public page rules:

- Home is a summary/entry page, not an infinite page with the whole app.
- Team detail pages are summaries; full squad, full calendar and full standings live in separate pages.
- Calendars and standings are team-specific. Avoid global mixed calendars/standings as the main UX.
- First Team pages use the premium variant. Academy/team pages use the same component family with simpler variants.
- First Team calendar may show `En vivo`; academy calendars do not show `En vivo`.
- In academy calendars, postponed matches are treated as pending in the public UI.
- First Team match detail can show external highlights. Academy match detail never shows highlights.
- Standings are manual and complete standings pages do not show the summary panel; summary panels live on team detail/home.
- News are part of MVP and can include structured content, images, links/references and external video URLs.
- Public content should be rendered from structured blocks where possible; avoid unsafe HTML.

See `docs/PUBLIC_APP_SPEC.md` for the detailed public specification.

## Required docs to read by task type

- Product scope: `docs/MVP_SCOPE.md`, `docs/DECISIONS.md`
- Public website: `docs/PUBLIC_APP_SPEC.md`, `docs/PUBLIC_PAGE_SPECS.md`, `docs/NAVIGATION_AND_ROUTES.md`
- Public UI: `docs/UI_PUBLIC_SITE.md`, `docs/DESIGN_TOKENS.md`, `docs/PUBLIC_PAGE_SPECS.md`, `docs/TEAM_DETAIL_PAGE.md`
- Admin/backoffice: `docs/ADMIN_PAGE_SPECS.md`, `docs/PERMISSIONS_MATRIX.md`, `docs/ROLES_PERMISSIONS.md`
- Sports behavior: `docs/SPORTS_RULES.md`, `docs/MATCH_MODEL.md`, `docs/STANDINGS_MODEL.md`, `docs/STATS_MODEL.md`
- Import: `docs/IMPORT_FORMAT.md`, `docs/IMPORT_RR_MANAGEMENT.md`
- Database: `docs/DATABASE_FINAL_MODEL.md`, `docs/DATABASE_IMPLEMENTATION_NOTES.md`, `docs/PRISMA_SCHEMA_DRAFT.md`
- Media/cards: `docs/IMAGE_AND_CARDS_POLICY.md`, `docs/MEDIA_POLICY.md`
- Frontend rebuild: `docs/FRONTEND_REBUILD_PLAN.md`, `docs/STITCH_UI_REFERENCE.md`
- Prompts: `docs/PROMPTS.md`

## MVP discipline

When implementing tasks, do not add features outside `docs/MVP_SCOPE.md` unless explicitly requested. If a requirement is unclear, choose the simplest implementation compatible with the documented architecture and ask for confirmation in the summary.
