# AGENTS.md - Rising Raimon Web Platform

## Project goal
Build a public sports website and a sports backoffice for Rising Raimon, designed for future growth to around 15 teams and multiple content managers.

The platform must provide:
- A modern, responsive, sophisticated public website.
- A private sports backoffice for managing public sports data.
- Low operational cost by using the existing Hostinger Business Web Hosting plan.
- Clear separation from the existing internal `rr-management` application and WordPress/WooCommerce store.

## Closed decisions
- Use Hostinger Business Web Hosting for the new platform to avoid additional infrastructure cost.
- Use Node.js + MySQL because those are available in Hostinger Business.
- Use the existing `rr-management` only as an internal administrative system.
- Do not use `rr-management` as a live backend for the public website.
- Reuse only stable sports master data from `rr-management`: seasons, teams, players and assignments.
- Import that master data by CSV/ZIP snapshot with an intelligent merge/upsert strategy, not by destructive replacement.
- Keep WordPress/WooCommerce for shop, orders, Stripe payments and buyer accounts.
- Do not build custom ecommerce or Stripe checkout in the MVP.
- Do not use Excel as the main database.
- Excel/CSV/JSON may be used only as import/export formats.
- Cache public pages/data wherever possible to avoid unnecessary MySQL load.
- Admin/backoffice may read/write MySQL in real time.

## Recommended stack
- Next.js
- TypeScript
- MySQL
- Prisma
- Auth.js or a simple secure admin-auth implementation
- Tailwind CSS
- shadcn/ui
- Zod for validation

## Infrastructure constraints
- Hostinger Business Web Hosting.
- 5 Node.js apps available.
- Node.js versions available: 18.x, 20.x, 22.x, 24.x.
- Use Node.js 20 LTS unless there is a strong reason not to.
- MySQL has a maximum of 75 simultaneous connections.
- Limit DB pool size, starting with 5-10 connections.
- Use environment variables for secrets.
- GitHub deployment is available.
- Cron jobs are available for lightweight tasks only.
- Backups are available in Hostinger, but manual DB backups are required before migrations or major imports.

## Architecture principles
- Separate public data from internal/private data.
- The public website must never consume private `rr-management` APIs.
- Never expose sensitive data on public endpoints.
- Public pages should be cached/static/incrementally regenerated where possible.
- Keep the public web, sports backoffice and ecommerce responsibilities clearly separated.
- Avoid overengineering in the MVP.
- Do not add paid services unless explicitly requested.

## Product boundaries

### New Rising Raimon Web Platform owns
- Public sports website.
- Sports backoffice.
- Public teams.
- Public players.
- Player cards/cromos.
- Public matches/results.
- Public standings.
- Public player/team statistics.
- News or public posts if included in scope.
- Public media/images.
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


## rr-management import rules

- Use external IDs from rr-management as stable import keys: sourceSeasonId, sourceTeamId, sourcePersonId, sourceAssignmentId when available.
- Do not import NIF/DNI, address, contact, private notes, document status, finance, clothing, stock, deliveries or payment data.
- Use merge/upsert, never blind delete-and-recreate.
- If an imported record already exists, update only master/import-controlled fields.
- Preserve web-owned fields such as slug, publicName override, photo, card design, publicVisible, bio, match data, standings and statistics.
- If a player/team disappears from a new snapshot, mark the relevant assignment/entity inactive or archived; do not hard delete if there is history.
- If a player changes team, close/inactivate the previous imported primary assignment and create/update the new one. Preserve historical stats with the original team/season/match.
- Manual exceptional assignments may exist in the web platform and must not be removed automatically by import unless explicitly confirmed.
- Every import must show a diff preview before applying changes.

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
- Use soft delete where historical integrity matters.
- Do not physically delete players/teams if they have historical data.

## Expected commands
Adjust if the generated project uses different scripts.

```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma migrate dev
npx prisma generate
```

## MVP discipline
When implementing tasks, do not add features outside `docs/MVP_SCOPE.md` unless explicitly requested. If a requirement is unclear, choose the simplest implementation compatible with the documented architecture.

## Documentos adicionales obligatorios

Cuando una tarea toque estas areas, leer tambien:

- Diseno publico: `docs/UI_PUBLIC_SITE.md`
- Reglas deportivas: `docs/SPORTS_RULES.md`
- Roles/permisos: `docs/ROLES_PERMISSIONS.md`
- Importacion CSV desde rr-management: `docs/IMPORT_FORMAT.md`
- Cache/rendimiento publico: `docs/CACHE_STRATEGY.md`
- Dudas abiertas: `docs/OPEN_QUESTIONS.md`

## Reglas nuevas cerradas

- Las clasificaciones son manuales en el MVP.
- No se registran todos los resultados de rivales.
- Un equipo compite en una sola competicion a la vez.
- No hay torneos publicos en MVP.
- El Primer Equipo tiene stats avanzadas y cromos especiales.
- El resto de equipos tiene stats reducidas y cromos normales.
- Roles iniciales: superadmin, manager, entrenador.
- El entrenador solo edita sus equipos asignados.
- Importacion desde rr-management inicialmente por CSV/ZIP snapshot.
- La importacion debe ser merge/upsert inteligente; no borrado destructivo.
- rr-management manda para campos maestros importados, pero se conservan relaciones y datos publicos ya creados en la nueva plataforma.
- Las estadisticas se quedan asociadas al equipo/temporada/partidos donde fueron creadas. No mover estadisticas automaticamente si un jugador cambia de equipo.
- No usar rr-management como backend runtime.


## Additional latest decisions

- Team creation is restricted to `superadmin` and `manager`.
- `superadmin` and `manager` assign coach permissions over specific teams.
- A coach can only edit allowed data for assigned teams: next match, match results, standings and goals/assists/statistics permitted by role.
- Public team detail pages are mandatory MVP functionality.
- MVP includes news created in the new platform.
- First Team played matches may include an associated video URL.
- Teams should store/display their coach; club-level staff is separate from team coach.
- Build the visual design in dark mode first. Keep tokens ready for light mode, but implement/polish light mode after dark mode is stable.
- External competition data integrations are future work only. MVP remains manual.

## Latest locked decisions

- Only `superadmin` can import from rr-management.
- Only `superadmin` can manage users, roles and coach-team permissions.
- Managers can manage sport/public content but not users or imports.
- Coaches can only edit assigned-team match/result/standings/goals/assists/stat fields allowed for their role.
- Coaches cannot upload photos, cards, logos or news media.
- A team can show multiple public coaches, but MVP expects one coach account per team named `entrenador_<team_slug>`.
- First-team card images are uploaded premium images.
- Non-first-team cards are generated by the web using foot, public name, shirt number, country flag, position, goals and assists.
- Images are stored as files/URLs, not BLOBs in MySQL.
- Videos are external URLs, not uploaded files.
- News are part of MVP in the new platform, with draft/published workflow.
- Sport-data saves publish immediately and revalidate/cache affected public pages.
- WordPress/WooCommerce moves/remains on `tienda.risingraimon.es` and is not replaced in MVP.

## UI content rule

- Avoid technical, explanatory or overly verbose on-screen copy in both public and admin interfaces.
- Prefer visual hierarchy, spacing, labels and layout over explanatory paragraphs.
- Keep UI text short, clear and calm; do not saturate screens with implementation details or process explanations.
- When in doubt, reduce copy and let structure communicate the page purpose.
