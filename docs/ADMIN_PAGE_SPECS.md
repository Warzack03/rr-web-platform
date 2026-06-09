# ADMIN_PAGE_SPECS.md

## Goal

The backoffice manages the public sports website data. It does not manage ecommerce, payments, orders or buyer accounts.

The admin should be practical, role-aware and efficient. It should not contain long explanatory text. Use clear labels, filters, tables, forms and action buttons.

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
- Coach account responsible for the team.

Coach cannot create or edit teams.

## Team coaches

A team can display multiple public coaches. Only one coach account is expected for backoffice access in MVP.

Manage:

- Visible coach name.
- Public role label.
- Display order.
- Visible on web.
- Optional linked user account.
- Coach responsible account, usually `entrenador_<team_slug>`.

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

## Assignments

Manage player/team/season assignment:

- Player.
- Team.
- Season.
- Shirt number for that assignment.
- Public position.
- Captain flag.
- Display order.
- Active/end date.
- Imported/manual source.

If player changes team, close/inactivate previous assignment and create/update new one. Do not move historical stats.

## Matches `/admin/partidos`

Manage:

- Team.
- Season.
- Competition.
- Opponent name as text.
- Optional opponent logo.
- Home/away.
- Date/time.
- Venue.
- Matchday.
- Status: scheduled, live, played, postponed.
- Result.
- External video URL for played First Team match when available.

Permissions:

- Superadmin/manager: all matches.
- Coach: assigned teams only.

## Standings `/admin/clasificaciones`

Manual standings only. Do not calculate from matches.

Manage table rows:

- Position.
- Team name.
- Played.
- Won.
- Drawn.
- Lost.
- Goals for.
- Goals against.
- Goal difference.
- Points.
- Own team marker.

Permissions:

- Superadmin/manager: all.
- Coach: assigned teams only.

## Statistics `/admin/estadisticas`

Stats are recorded by match whenever possible and aggregated by code.

General rules:

- Stats stay attached to player + team + season + match where created.
- Do not move stats when player changes team.
- No negative values.
- Goal participation = goals + assists.

Coach can edit allowed stats for assigned teams only.

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
- First Team premium card images.
- News covers.
- General public images.

Images are files/URLs, not DB BLOBs.

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
