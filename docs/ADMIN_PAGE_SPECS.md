# ADMIN_PAGE_SPECS.md

## Goal

The backoffice manages the public sports website data. It does not manage ecommerce, payments, orders or buyer accounts.

The admin should be practical, owner-focused and efficient. It should not contain long explanatory text. Use clear labels, filters, tables, forms and action buttons.

## Current direction

The MVP backoffice is now focused on one manager/admin user. Existing role documentation below remains useful as technical history only; product-facing admin UI and runtime behavior should behave as a single administrator panel.

See `docs/BACKOFFICE_OWNER_CONTROL_MODEL.md` for the current control model.

Runtime access:

- One active internal manager/admin account.
- Username/password login.
- No role selector, coach scope or role-specific navigation in the MVP.
- Visible team coaches are public metadata, not login accounts.

## Roles

- `superadmin`
- `manager`
- `entrenador`

## Permissions summary

- Only `superadmin` manages users, roles and global permissions.
- Only `superadmin` imports from `rr-management`.
- `manager` manages sport/public content but not users and not imports.
- `entrenador` only edits allowed data for assigned teams.
- Coaches cannot upload images/media/news/cards/logos.

## Dashboard `/admin`

Show operational summary:

- Active season.
- Public teams.
- Active players.
- Upcoming matches.
- Recent results.
- Draft news.
- Import history/alerts for superadmin.
- Quick actions based on role.

Role behavior:

- Superadmin/manager: global view.
- Coach: only assigned teams.

## Users `/admin/usuarios`

Only `superadmin` can create, edit, deactivate users and change roles.

Fields/actions:

- Name.
- Email/username.
- Role.
- Active status.
- Assigned coach teams.
- Reset/change password flow if implemented.

Managers do not create users. If allowed by implementation, they can only assign an existing coach user to a team, never create or edit global users.

## Seasons `/admin/temporadas`

- Create season.
- Edit season.
- Activate season.
- Close/deactivate season.
- Only one active season.
- Do not hard delete seasons with related data.

Fields:

- Name.
- Slug if used.
- Start date.
- End date.
- Status/active.

Permissions:

- Superadmin/manager: manage.
- Coach: no access or read-only if needed.

## Teams `/admin/equipos`

See `docs/BACKOFFICE_TEAMS_GUIDELINES.md` for the current product/UX decision
on list density, coach-facing context mode and informative coach handling.

Only `superadmin` and `manager` can create/edit teams.

Manage:

- Name.
- Slug.
- Category.
- Competition.
- Season.
- First Team flag.
- Public visibility.
- Active status.
- Display order.
- Logo.
- Banner.
- Visible coaches.
- Informative coach list for the team.

Coach cannot create or edit teams.

Current UX/product rules:

- The top summary should stay compact and should not reserve a dedicated metric
  card for `First Team`.
- The desktop list should prioritize competition, visible coaches and player
  count over technical metadata.
- Do not show the team slug under the team name in the main list.
- Team row actions should be compact and icon-based when possible.
- The coach-facing version of this screen is a context/consultation view only.
- Visible coaches are informative team data and must not be edited as linked
  backoffice users.
- Team form copy should stay very short and avoid explanatory helper paragraphs
  when the fields are already clear.
- `Display order` should be suggested automatically from the current team
  structure and stay editable.
- The team marked as `First Team` should take the highest priority order.
- `Branch` should not be a manual business choice in the team form; it should
  resolve to `First Team` or `Academy/Cantera` from the main flag.
- Competition should be selected from existing competition options, not entered
  as free text.

## Team coaches

A team can display multiple public coaches. They are managed as informative team data, not as linked backoffice accounts.

Manage:

- Visible coach name.
- Public role label.
- Display order.
- Visible on web.

Current rule:

- The future logic must keep visible coaches separated from role/account
  permissions.

## Players `/admin/jugadores`

Manage public-safe player data only:

- Public name.
- Slug.
- Shirt number.
- Position.
- Goalkeeper/outfield flag.
- Dominant foot.
- Country/flag.
- Public visibility.
- Active status.
- Photo managed by superadmin/manager.

Do not store/import sensitive data such as NIF, address, contact, notes, finance or documents.

Coach cannot edit player identity/profile structure. Coach can edit allowed stats only.

Current UX/product rules:

- `Plantilla` is the operational entry point for day-to-day roster work.
- `Fichas y cromos` is the advanced editor for the final public player profile.
- This screen should focus on public profile data: name, slug, photo, country,
  dominant foot, visibility and cromo preview.
- It should be possible to open a player profile from the roster flow.

## Assignments

Manage player/team/season assignment:

- Player.
- Team.
- Season.
- Shirt number for that assignment.
- Public position.
- Captain flag.
- Active/end date.
- Imported/manual source.

If player changes team, close/inactivate previous assignment and create/update new one. Do not move historical stats.

Current UX/product rules:

- This module is user-facing as `Plantilla`, even if the technical model still
  maps to assignments.
- The roster screen must allow adding a player/assignment from the team roster flow.
- The public roster order should follow shirt number by default.
- Do not require manual up/down ordering controls in normal roster management.
- Public/admin position catalogs must include `Banda`.
- The roster flow should connect naturally with the advanced player profile
  editor (`Fichas y cromos`).

## Matches `/admin/partidos`

See `docs/BACKOFFICE_MATCHES_GUIDELINES.md` for current product/UX decisions
about SportPress-like match creation, opponent catalogs, venue catalogs and
automatic matchday suggestions.

Manage:

- Team.
- Season.
- Competition.
- Opponent from catalog.
- Optional opponent logo.
- Home/away.
- Date/time.
- Venue from catalog.
- Matchday.
- Status: scheduled, live, played, postponed.
- Result.
- External video URL for played First Team match when available.

Current UX/product rules:

- Competition is filled automatically from the team in normal match creation.
- Matchday is suggested as last existing matchday + 1, but remains editable.
- Pending matches show `PDTE` instead of `VS` in admin result cells.
- Match list uses pagination and a compact desktop table to avoid redundant data.

Permissions:

- Superadmin/manager: all matches.
- Coach: assigned teams only.

## Standings `/admin/clasificaciones`

See `docs/BACKOFFICE_STANDINGS_GUIDELINES.md` for the current product decision
on choosing the active table by team or by competition, using only one
selection criterion at a time.

Manual standings only. Do not calculate from matches.

Manage table rows:

- Position.
- Team name.
- Played.
- Won.
- Drawn.
- Lost.
- Points sanctions.
- Goals for.
- Goals against.
- Goal difference.
- Points.
- Own team marker.
- Club team marker when more than one club team appears in the same real table.

Permissions:

- Superadmin/manager: all.
- Coach: assigned teams only.

Current UX/product rules:

- The active standings table should be chosen either by team or by competition.
- Team and competition should not act as simultaneous main filters in the edit
  flow.
- If one criterion returns multiple tables, the UI should ask for an explicit
  second selection before editing.
- Points should consider editable sanctions: `Pts = G * 3 + E - PTS SA`.
- If two club teams share the same real standings table, the model/UI must allow
  more than one club-team row inside that single table.
- The club-team marker must be multi-select inside the table, not exclusive.
- If a competition has no standings table yet, creation should scaffold the
  table from the teams already registered in that competition.
- Do not show support actions like duplicate, restore or save-without-changes unless they are real MVP behavior.
  as part of the normal header flow.

## Statistics `/admin/estadisticas`

See `docs/BACKOFFICE_STATS_GUIDELINES.md` for the current product decision on
using a match as the edit context while keeping season aggregates visible in the
same screen.

Stats are recorded by match whenever possible and aggregated by code.

General rules:

- Stats stay attached to player + team + season + match where created.
- Do not move stats when player changes team.
- No negative values.
- Goal participation = goals + assists.
- Matches played should be derived from player participation in matches, not
  edited manually in the main screen.

Coach can edit allowed stats for assigned teams only.

Current UX/product rules:

- Team totals stay visible while editing the active match.
- The match selector acts as the loading context, not as a totals filter.
- Only played matches should be selectable in the stats screen.
- The screen should let the user mark who has played in the selected match.
- If a player did not play, that match must not add `PJ` or stats for that
  player.
- The screen should also allow adding occasional players from other club teams
  into the active match without changing the normal roster.
- Do not show progressive hide/show controls for more stats; all available stats
  for that profile should be visible from the start.
- Stats labels should include icons aligned with the public site language.
- Derived metrics and averages can be shown in admin as read-only support data.

## News `/admin/noticias`

News are part of MVP.

Manage:

- Title.
- Slug.
- Excerpt.
- Content.
- Cover image.
- External video links.
- Related teams.
- Author.
- Draft/published status.
- Published date.
- Featured flag.

Only superadmin/manager can manage news.

## Media `/admin/media`

Manage image metadata and uploads for:

- Team logos.
- Team banners.
- Opponent logos.
- Player photos.
- First Team player/base card images.
- News covers.
- General public images.

Images are files/URLs, not DB BLOBs.

Current UX/product rules:

- Do not show secondary summary boxes like `Conecta con` if they do not unlock
  a real workflow.
- The upload CTA should do something useful with real persistence.
- Until final media storage is decided, local development uploads may be used to validate the
  selection and preview flow, but they should communicate clearly that they are
  not yet saved in the database.

## Imports `/admin/importaciones`

Only `superadmin`.

Flow:

1. Upload CSV/ZIP.
2. Validate.
3. Preview diff.
4. Show conflicts.
5. Confirm.
6. Apply merge/upsert.
7. Store import batch and item history.

Never import sensitive fields.
Never destructive replace.

## Filters

Use filters/search in admin lists:

- By season.
- By team.
- By category.
- By status.
- By visibility.
- By role.
- By date.
- Search by player/team/news title.

## Audit

Important entities should have created/updated metadata and actor when feasible.
