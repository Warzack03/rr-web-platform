# PERMISSIONS_MATRIX.md

## Current status

Superseded for product-facing MVP UI by `docs/BACKOFFICE_OWNER_CONTROL_MODEL.md`.

The matrix below is retained as technical history in case role-based access is reintroduced later.

## Roles

- `superadmin`
- `manager`
- `entrenador`

## Core decisions

- Only `superadmin` manages users, roles, global permissions and imports.
- `manager` manages sport/public content, but not users and not imports.
- `entrenador` only edits allowed data for assigned teams.
- Coaches cannot upload media.
- Coaches cannot manage news.
- Coaches cannot create teams or players.

## Matrix

| Action | Superadmin | Manager | Entrenador |
|---|---:|---:|---:|
| View admin dashboard | Yes | Yes | Assigned teams only |
| Manage users | Yes | No | No |
| Manage roles | Yes | No | No |
| Manage global permissions | Yes | No | No |
| Import from rr-management | Yes | No | No |
| View import history | Yes | No | No |
| Create/edit seasons | Yes | Yes | No |
| Activate season | Yes | Yes | No |
| Create/edit teams | Yes | Yes | No |
| Set First Team flag | Yes | Yes | No |
| Set team public visibility | Yes | Yes | No |
| Upload team logo/banner | Yes | Yes | No |
| Add visible team coaches | Yes | Yes | No |
| Assign team scope to coach user | Yes | Yes | No |
| Create/edit players | Yes | Yes | No |
| Upload player photos | Yes | Yes | No |
| Create/edit assignments | Yes | Yes | No |
| Create/edit matches | Yes | Yes | Assigned teams only, allowed fields |
| Update next match | Yes | Yes | Assigned teams only |
| Update match status/result | Yes | Yes | Assigned teams only |
| Add played First Team video URL | Yes | Yes | No unless explicitly allowed |
| Manage standings | Yes | Yes | Assigned teams only |
| Edit match stats | Yes | Yes | Assigned teams only, allowed fields |
| Manage news | Yes | Yes | No |
| Upload news media | Yes | Yes | No |
| Manage media library | Yes | Yes | No |
| View public website | Yes | Yes | Yes |

## Coach allowed fields

For assigned teams only, coach may edit:

- Next match date/time/venue/opponent if configured as allowed.
- Match status/result.
- Manual standings.
- Goals and assists.
- Allowed player stats for the team type.

Coach may not edit:

- Team identity/slug/visibility.
- Player identity/profile/fotos/cards.
- Users or permissions.
- Imports.
- News.
- Global settings.
- Data for non-assigned teams.

## Server-side enforcement

All permissions must be checked server-side in actions/API routes/services. Hiding buttons in UI is not enough.
