# Small Prompts for Codex

Use these prompts one at a time. The goal is to keep each Codex session focused and reduce token usage.

## Bootstrap
Implement Epic 1 from `docs/BACKLOG.md` following `AGENTS.md` and `docs/MVP_SCOPE.md`. Do not add features outside the MVP. After implementation, run lint/build if available and report any issues.

## Prisma schema
Implement the initial Prisma schema based on `docs/DOMAIN_MODEL.md` and `docs/DATABASE_SCHEMA.md`. Use MySQL provider. Do not add ecommerce, finance or rr-management private fields.

## Auth
Implement admin authentication and role protection for `/admin` based on `docs/SECURITY.md`. Keep it simple and compatible with Hostinger deployment.

## Seasons CRUD
Implement CRUD for seasons only. Follow the domain model and MVP scope. Do not implement teams yet.

## Teams CRUD
Implement CRUD for teams and the public team listing. Use the active season by default. Follow the public visibility rules.

## Players CRUD
Implement CRUD for public-safe players and team assignments. Do not store sensitive personal data.

## Matches CRUD
Implement competitions and matches CRUD. Add public listing of matches and latest results.

## Standings
Implement manual standings management and public standings display.

## Import
Implement `rr-management` snapshot validation and preview only. Do not apply changes yet. Follow `docs/IMPORT_RR_MANAGEMENT.md` strictly.

## Apply import
Implement the apply step for validated `rr-management` snapshot imports. Store import batch history and avoid deleting existing historical data.

## Public polish
Improve public pages responsive design and SEO. Do not change database schema unless necessary.

## Prompt - UI publica inicial

Implementa la primera version visual de la web publica siguiendo `docs/UI_PUBLIC_SITE.md`. Crea tema global, layout, header responsive, home, pagina Primer Equipo, pagina Mis equipos y pagina detalle de equipo usando datos mock. No implementes todavia logica de base de datos si no esta creada. Mantén el estilo profesional/juvenil inspirado en la referencia documentada.

## Prompt - Reglas deportivas

Implementa las reglas deportivas de `docs/SPORTS_RULES.md`: estados de partido, clasificaciones manuales, estadisticas basicas para equipos normales y estadisticas avanzadas para Primer Equipo. No conectes APIs externas. No implementes torneos.

## Prompt - Roles y permisos

Implementa roles y permisos siguiendo `docs/ROLES_PERMISSIONS.md`. Superadmin tiene acceso total; manager gestiona contenido deportivo; entrenador solo puede editar stats/clasificacion/partidos de sus equipos asignados. Valida permisos en servidor y oculta acciones no permitidas en UI.

## Prompt - Importacion CSV

Implementa la importacion CSV siguiendo `docs/IMPORT_FORMAT.md`. Crea validacion, previsualizacion y aplicacion de importacion. No importes campos sensibles. No borres partidos, resultados, clasificaciones ni estadisticas salvo confirmacion explicita.

## Prompt - Cache publico

Implementa estrategia de cache siguiendo `docs/CACHE_STRATEGY.md`. La web publica debe evitar consultar MySQL en cada visita cuando sea posible. El admin puede consultar en tiempo real. Limita pool de conexiones y documenta la configuracion.


## Prompt - Harden rr-management import merge/upsert

Implement the rr-management import using `docs/IMPORT_FORMAT.md`, `docs/IMPORT_RR_MANAGEMENT.md`, `docs/DOMAIN_MODEL.md` and `docs/DATABASE_SCHEMA.md`.

Requirements:
- CSV/ZIP input.
- Match by rr-management external IDs.
- No destructive replacement.
- Calculate a diff preview before applying.
- Preserve web-owned fields.
- Preserve manual exceptional assignments.
- If a player changes team, close/inactivate the previous imported assignment and create/update the new one. Do not move historical stats.
- Store import batch and row-level import actions.
- Reject or ignore sensitive fields.

Do not implement ecommerce or runtime integration with rr-management.


## Team detail page

Implement the public team detail page `/equipos/[teamSlug]` following `docs/PUBLIC_PAGE_SPECS.md`, `docs/STATS_MODEL.md`, `docs/MATCH_MODEL.md`, `docs/STANDINGS_MODEL.md`, `docs/DESIGN_TOKENS.md` and `docs/CODE_CONVENTIONS.md`. Use a premium variant for the First Team and a standard variant for other teams. Hide empty sections.

## Roles update

Implement or update role checks following `docs/ROLES_PERMISSIONS.md`. Only superadmin and manager can create teams and assign coaches. Coaches can only update next match, results, goals/assists/statistics allowed by role and standings for assigned teams.

## News MVP

Implement the news MVP following `docs/CONTENT_MODEL.md`, `docs/PUBLIC_PAGE_SPECS.md`, `docs/ADMIN_PAGE_SPECS.md` and `docs/MEDIA_POLICY.md`. Support cover image and external video links.

## External data guardrail

Do not implement automatic RFFM or municipal sync unless explicitly requested. If adding placeholders, follow `docs/EXTERNAL_COMPETITION_DATA.md`: future imports must be admin-triggered, cached locally and have preview/diff.

## Additional focused prompts

### Permissions matrix

Implement role permission checks according to `docs/PERMISSIONS_MATRIX.md`. Enforce permissions server-side. Do not rely only on hidden UI buttons.

### Team detail page

Implement `/equipos/[teamSlug]` following `docs/TEAM_DETAIL_PAGE.md`, `docs/STATS_MODEL.md`, `docs/MATCH_MODEL.md`, `docs/STANDINGS_MODEL.md`, `docs/IMAGE_AND_CARDS_POLICY.md` and `docs/DESIGN_TOKENS.md`.

### Seed data

Create Prisma seed data following `docs/SEED_DATA.md`. Use fake data only and include first-team and non-first-team examples.

### Publishing workflow

Implement sport-data immediate publishing and news draft/publish workflow following `docs/PUBLISHING_WORKFLOW.md`.

## Implement final Prisma schema

Implement the initial Prisma schema using `docs/DATABASE_FINAL_MODEL.md`, `docs/PRISMA_SCHEMA_DRAFT.md` and `docs/DATABASE_IMPLEMENTATION_NOTES.md`.

Constraints:
- Use MySQL provider.
- Preserve the Team vs SeasonTeam separation.
- Preserve Player vs PlayerSeasonProfile separation.
- Store match stats by player + match + seasonTeam + season.
- Do not introduce destructive import behavior.
- Do not store binary media in the database.
- Add a seed script with demo data from `docs/SEED_DATA.md`.
- Run Prisma format and ensure the schema is syntactically valid.
