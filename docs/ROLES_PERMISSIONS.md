# ROLES_PERMISSIONS.md

## Roles

### Superadmin

Only owner-level role. Has full access.

Can:

- Manage users.
- Manage roles.
- Manage permissions.
- Import from `rr-management`.
- Manage all sports/public content.
- Manage media.
- Manage settings.

### Manager

Operational content role.

Can:

- Manage seasons, teams, players, assignments, matches, standings, stats, news and media.
- Assign existing coach users to teams if the user already exists.
- Upload images/cards/logos/banners/news media.

Cannot:

- Manage users globally.
- Create/change roles.
- Import from `rr-management`.
- Manage ecommerce.

### Entrenador

Team-limited role.

Can only access assigned teams and edit allowed sports data:

- Next match.
- Match results/status.
- Standings.
- Goals/assists.
- Allowed stats for assigned team players.

Cannot:

- Create/edit teams.
- Create/edit player profile structure.
- Upload images/media/cards.
- Manage news.
- Manage users.
- Import data.
- Edit unrelated teams.

## Coach accounts

A team can show multiple public coaches. MVP expects only one coach account per team.

Naming convention:

```text
entrenador_<team_slug>
```

Visible coaches may exist as plain public names even if they do not have user accounts.

## Team assignment permissions

Coach permissions must be scoped by team and usually by season.

A user with coach role must only see allowed admin data for assigned teams.
