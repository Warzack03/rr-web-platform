# Backlog

## Epic 1 - Project bootstrap
- Create Next.js project with TypeScript.
- Configure Tailwind CSS.
- Configure shadcn/ui.
- Configure ESLint and formatting.
- Configure environment variables.
- Configure Prisma with MySQL.
- Add base layout.
- Add health/status page or endpoint.

## Epic 2 - Database foundation
- Create Prisma schema for MVP tables.
- Add migrations.
- Add seed script for initial admin user and sample season/team.
- Add DB access utility.
- Document local/dev database setup.

## Epic 3 - Admin authentication
- Implement admin login.
- Implement logout.
- Protect `/admin` routes.
- Implement roles: superadmin, manager/editor.
- Add basic admin shell/layout.

## Epic 4 - Seasons and teams
- CRUD seasons.
- Activate season.
- CRUD teams.
- Public visibility toggle.
- Public teams list page.
- Team detail public page skeleton.

## Epic 5 - Players and assignments
- CRUD players.
- Manage public profile fields.
- Assign players to teams per season.
- Manage dorsal/position/captain/order.
- Public player card/profile.
- Team roster public section.

## Epic 6 - Competitions, matches and results
- CRUD competitions.
- CRUD matches.
- Enter results.
- Public match list.
- Home next match/latest results widgets.

## Epic 7 - Standings and statistics
- Manual standings editor.
- Public standings page.
- Player stats editor.
- Public player/team stats display.

## Epic 8 - Media
- Basic image upload or URL-based media management.
- Image selection for players and teams.
- File validation.
- Alt text support.

## Epic 9 - rr-management import
- Define CSV/ZIP import parser.
- Validate snapshot using rr-management DDL mapping.
- Match by external IDs.
- Calculate diff: creates, updates, inactivations, assignment changes and conflicts.
- Show import preview before applying.
- Apply merge/upsert import transactionally where possible.
- Preserve web-owned fields and historical stats.
- Preserve manual exceptional assignments unless explicitly confirmed.
- Store import batch and import batch item history.
- Reject/ignore sensitive fields.

## Epic 10 - Public website polish
- Home page design.
- Mobile-first responsive polish.
- SEO metadata.
- Navigation.
- Link to WooCommerce shop.
- Loading/error states.

## Epic 11 - Deployment hardening
- Hostinger deployment docs.
- Production env checklist.
- DB backup procedure.
- Build verification.
- Basic monitoring/log review steps.

## Epica 12 - Definicion visual publica

- Implementar tema visual basado en `docs/UI_PUBLIC_SITE.md`.
- Crear tokens CSS globales equivalentes a la referencia `inscripciones`.
- Crear componentes base: SiteHeader, HeroSection, SectionHeading, CTAButton, SportCard, TeamCard, PlayerCard, MatchCard, StandingTable.
- Crear layout responsive mobile-first.
- Crear home publica con datos mock.
- Crear pagina Primer Equipo con datos mock.
- Crear pagina Mis equipos con datos mock.
- Crear pagina detalle de equipo con datos mock.

## Epica 13 - Reglas deportivas

- Implementar estados de partido: scheduled, live, played, postponed.
- Implementar clasificaciones editables manualmente.
- Implementar stats basicas para equipos normales.
- Implementar stats avanzadas para Primer Equipo.
- Implementar distincion jugador de campo / portero.
- Calcular metricas derivadas desde stats base.

## Epica 14 - Roles y permisos por equipo

- Implementar rol superadmin.
- Implementar rol manager.
- Implementar rol entrenador.
- Crear asignacion usuario-equipo-temporada.
- Restringir edicion de entrenadores a sus equipos.
- Validar permisos en servidor.

## Epica 15 - Cache y rendimiento publico

- Configurar cache/revalidate en paginas publicas.
- Limitar pool MySQL.
- Evitar N+1 queries en listados publicos.
- Revalidar rutas al publicar cambios desde admin.
- Documentar estrategia de cache en README/deploy.


## Epica 16 - Import merge/upsert hardening

- Implement `import_batches` and `import_batch_items`.
- Add external ID fields to imported entities.
- Implement conflict categories for import preview.
- Implement inactivate/archive behavior for missing imported records.
- Implement assignment change handling without moving historical stats.
- Add tests for player team change, player missing from snapshot, team missing from snapshot and manual exceptional assignment preservation.


## Epic 17 - Public team detail pages

- Implement `/equipos/[teamSlug]`.
- Render team hero with name, category, season, competition and coach.
- Render next match.
- Render latest results.
- Render manual standings.
- Render roster and cards.
- Render team statistics.
- Render related news if available.
- Use premium variant for First Team.
- Show video link/embed for First Team played matches when videoUrl exists.
- Hide sections without data.
- Add SEO metadata per team.

## Epic 18 - News MVP

- Implement news database model.
- Implement admin news list/create/edit/publish.
- Support cover image and video links.
- Implement public `/noticias` and `/noticias/[slug]`.
- Support related team.
- Add SEO metadata.

## Epic 19 - External competition data research placeholder

- Do not implement external sync in MVP.
- Add admin notes/config placeholders only if useful.
- Future work: municipal open-data import with preview/diff.
- Future work: RFFM import if stable documented/acceptable data access exists.

## Epic 20 - Light mode finalization

- Keep design tokens ready for light mode from day one.
- Build/polish dark mode first.
- Implement light mode after public UI is stable.
- Ensure all public components use tokens, not hardcoded colors.
