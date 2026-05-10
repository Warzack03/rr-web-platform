# API Contract Draft

This file defines expected API or server-action responsibilities. Exact implementation may use Next.js route handlers, server actions, or a combination.

## Public API/data
Public responses must only include public-safe fields.

### GET /api/public/home
Returns data needed by the home page.

Possible response:
- featured teams
- next match
- latest results
- active standings summary
- latest news/posts if implemented

### GET /api/public/teams
Returns public teams for active or requested season.

Query params:
- season optional

### GET /api/public/teams/:slug
Returns public team details.

Includes:
- team metadata
- roster
- recent/next matches
- standings summary
- team stats if available

### GET /api/public/players/:slug
Returns public player profile/card.

Includes:
- publicName
- photo
- team assignment
- position/dorsal
- public stats

### GET /api/public/matches
Returns public matches.

Query params:
- season optional
- team optional
- competition optional
- status optional

### GET /api/public/standings
Returns public standings.

Query params:
- season
- competition
- team optional

## Admin API/data
All admin endpoints require authentication and authorization.

### Seasons
- GET /api/admin/seasons
- POST /api/admin/seasons
- GET /api/admin/seasons/:id
- PATCH /api/admin/seasons/:id
- POST /api/admin/seasons/:id/activate

### Teams
- GET /api/admin/teams
- POST /api/admin/teams
- GET /api/admin/teams/:id
- PATCH /api/admin/teams/:id
- PATCH /api/admin/teams/:id/visibility

### Players
- GET /api/admin/players
- POST /api/admin/players
- GET /api/admin/players/:id
- PATCH /api/admin/players/:id
- PATCH /api/admin/players/:id/visibility

### Team assignments
- GET /api/admin/team-players?teamId=...
- POST /api/admin/team-players
- PATCH /api/admin/team-players/:id
- DELETE or archive /api/admin/team-players/:id

### Competitions
- GET /api/admin/competitions
- POST /api/admin/competitions
- PATCH /api/admin/competitions/:id

### Matches
- GET /api/admin/matches
- POST /api/admin/matches
- GET /api/admin/matches/:id
- PATCH /api/admin/matches/:id
- PATCH /api/admin/matches/:id/result

### Standings
- GET /api/admin/standings
- POST /api/admin/standings/bulk-upsert
- PATCH /api/admin/standings/:id

### Stats
- GET /api/admin/player-stats
- POST /api/admin/player-stats/bulk-upsert
- PATCH /api/admin/player-stats/:id

### Import
- POST /api/admin/import/rr-management/validate
- POST /api/admin/import/rr-management/apply
- GET /api/admin/import/batches
- GET /api/admin/import/batches/:id

## Public caching rule
Public endpoints/pages should be cacheable. Prefer static generation or incremental revalidation for public routes.
