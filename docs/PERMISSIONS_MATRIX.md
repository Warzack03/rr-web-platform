# Permissions matrix

## Roles

- `superadmin`: only Aaron initially. Owns platform configuration, imports, users and permissions.
- `manager`: club staff with operational permissions over sport/public content.
- `coach`: one login per team, named `entrenador_<team_code_or_slug>`. A team can show several coaches publicly, but only one coach account is granted editing access for that team.

## Account and permission management

Only `superadmin` can:

- Create, edit, deactivate or delete users.
- Assign roles.
- Assign coach accounts to teams.
- Import data from `rr-management`.
- Run destructive or high-impact admin operations.

Managers cannot manage users or permissions.

## Action matrix

| Action | Superadmin | Manager | Coach |
|---|---:|---:|---:|
| Create teams | Yes | Yes | No |
| Edit team master data | Yes | Yes | No |
| Set team visibility/public slug/banner | Yes | Yes | No |
| Assign public coaches to team | Yes | Yes | No |
| Assign coach account permissions | Yes | No | No |
| Create/edit players | Yes | Yes | No |
| Upload player photos | Yes | Yes | No |
| Upload first-team premium card images | Yes | Yes | No |
| Edit own-team next match | Yes | Yes | Yes, only assigned teams |
| Edit own-team match result/status | Yes | Yes | Yes, only assigned teams |
| Edit goals/assists/statistics | Yes | Yes | Yes, only assigned teams and allowed fields |
| Edit own-team standings | Yes | Yes | Yes, only assigned teams |
| Create/edit news | Yes | Yes | No |
| Publish/unpublish news | Yes | Yes | No |
| Import from rr-management | Yes | No | No |
| Manage users/roles | Yes | No | No |
| Configure environments/platform settings | Yes | No | No |

## Coach restrictions

A coach can only edit teams explicitly assigned to their coach account.

A coach must not:

- Create or delete teams.
- Edit player master data.
- Upload photos or cards.
- Change public slugs or visibility.
- Create users.
- Assign permissions.
- Import from `rr-management`.
- Publish news.

