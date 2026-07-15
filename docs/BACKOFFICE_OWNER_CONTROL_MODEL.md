# Backoffice Owner Control Model

## Decision

The backoffice is now designed for one internal manager/admin user.

The product no longer needs separate day-to-day roles for `superadmin`, `manager` or `entrenador` in the MVP UI. Existing auth and database role fields can remain temporarily for compatibility while the frontend and product flow are simplified around a single administrator.

The MVP login model is username/password for that manager/admin account. Public team coaches remain informative website data, not login users.

## What the admin must control

To keep the public website healthy, the admin needs control over:

- Seasons and active public context.
- Teams: name, slug, category, competition, visibility, order, logo, banner and informative public coaches.
- Team rosters: player assignment by season/team, dorsal, position, captain and active state.
- Players: public name, slug, photo, position, dominant foot, country/flag, dorsal, visibility and card-ready fields.
- Matches: opponent, home/away, date/time, venue, matchday, status, result and First Team video URL.
- Standings: complete manual table per team/competition.
- Statistics: per-match player stats, with advanced fields for First Team and simpler stats for academy teams.
- Media: player photos, logos, banners, opponent logos, news covers and card base images.
- News: title, slug, excerpt, structured content, cover, related teams, external video and publish state.
- Imports: future rr-management snapshot upload, validation, diff preview and non-destructive merge.
- Internal access: one active manager/admin account.

## Desktop vs mobile priority

Desktop-first:

- Team setup.
- Player profile and card data.
- Media library.
- News/content.
- Imports and season structure.

Mobile-critical:

- Updating match result/status.
- Updating manual standings.
- Loading goals, assists, cards, MVP and quick stats after a match.

## MVP discipline

Continue with mocks until the admin flows and public data shape are stable. Real persistence should follow the same data shape already visible in the mocks.

## Current module split

- `Plantilla` is the operational module for creating and managing a team's
  active roster.
- `Fichas y cromos` is the advanced module for the final public player profile
  and card preview.
- The product should guide the admin from roster work into public profile work,
  not make them feel like two unrelated systems.
