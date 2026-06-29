# Backoffice Owner Control Model

## Decision

The backoffice is now designed for one internal owner/admin user.

The product no longer needs separate day-to-day roles for `manager` or `entrenador` in the MVP UI. Existing auth and database role fields can remain for compatibility while the frontend and product flow are simplified around a single administrator.

## What the admin must control

To keep the public website healthy, the admin needs control over:

- Seasons and active public context.
- Teams: name, slug, category, competition, visibility, order, logo, banner and public coaches.
- Team rosters: player assignment by season/team, dorsal, position, captain/order and active state.
- Players: public name, slug, photo, position, dominant foot, country/flag, dorsal, visibility and card-ready fields.
- Matches: opponent, home/away, date/time, venue, matchday, status, result and First Team video URL.
- Standings: complete manual table per team/competition.
- Statistics: per-match player stats, with advanced fields for First Team and simpler stats for academy teams.
- Media: player photos, logos, banners, opponent logos, news covers and card base images.
- News: title, slug, excerpt, structured content, cover, related teams, external video and publish state.
- Imports: future rr-management snapshot upload, validation, diff preview and non-destructive merge.

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
