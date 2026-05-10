# Import from rr-management

## Objective

Import stable sports master data from the existing `rr-management` system into the new Rising Raimon Web Platform.

The import is expected to happen once per season, with occasional manual re-imports if needed. It is not a live integration.

## Closed decision

Use an intelligent merge/upsert import strategy. Do not use destructive replacement.

`rr-management` is authoritative for imported master data, but the new platform must preserve local public-web data and historical sports relationships.

## Source data to import

Allowed:

- Seasons.
- Teams.
- Players/persons transformed into public-safe player records.
- Player-team-season assignments.
- Basic sport profile fields if public-safe.

Not allowed:

- DNI/NIF.
- Address.
- Phone numbers.
- Private email unless explicitly needed for admin accounts, not public players.
- Finance/billing data.
- Clothing orders.
- Stock.
- Delivery information.
- Internal notes.
- Document status.
- Payment status.
- Sensitive administrative information.

## Known source DDL

The current rr-management source tables are:

- `seasons`: `id`, `name`, `start_date`, `end_date`, `status`.
- `teams`: `id`, `code`, `name`, `active`, `display_order`, `branch`.
- `persons`: `id`, `first_name`, `last_name`, `nif_type`, `nif_value`, `birth_date`, `address`, `contact`, `active`, `document_status`, `notes`, timestamps.
- `player_profiles`: profile by person.
- `player_profile_seasons`: profile by person and season.
- `team_assignments`: assignment by person, team and season.

The new platform should store `sourceExternalId` fields to map back to rr-management IDs without importing sensitive fields.

## Import philosophy

The new platform stores an independent public-safe copy. It does not keep a runtime dependency on `rr-management`.

Import should adapt relationships without breaking history:

- if a player changes team, old stats remain with the previous team/match/season
- if a team disappears, archive/inactivate it instead of deleting it
- if a player disappears, inactivate the seasonal assignment instead of deleting the player
- manual exceptional assignments created in the web platform must be preserved unless explicitly confirmed

## Suggested flow

1. Export snapshot from `rr-management` as CSV/ZIP.
2. Upload snapshot in the new platform admin.
3. Validate structure and required fields.
4. Normalize names/slugs.
5. Detect existing players/teams/seasons by external IDs.
6. Calculate diff.
7. Show preview:
   - new seasons
   - updated seasons
   - new teams
   - updated teams
   - inactive/archived teams
   - new players
   - updated players
   - inactive players or assignments
   - assignment changes
   - manual assignments preserved
   - validation warnings/errors
8. Admin confirms import.
9. Store import batch record.
10. Apply changes transactionally where possible.

## Suggested CSV files

- `seasons.csv`
- `teams.csv`
- `persons.csv`
- `player_profile_seasons.csv`
- `team_assignments.csv`

See `docs/IMPORT_FORMAT.md` for the exact recommended columns and mapping.

## Validation requirements

- Required fields must exist.
- Names must not be empty.
- External IDs must be stable.
- Assignments must reference existing teams, seasons and players.
- Sensitive fields must be ignored or rejected.
- Import must not delete existing historical public data by default.
- Slug conflicts must be shown in the preview.
- Team changes must not move historical stats automatically.

## Conflict handling

### If external ID matches existing record

Update safe master fields only. Preserve local web-owned fields.

### If slug conflict occurs

Show warning and require admin decision, or generate deterministic fallback slug.

### If player appears in multiple teams in same season

Allow only if the web platform marks one assignment as primary and others as manual/exceptional. Do not remove manual exceptions automatically.

### If player changes team

Close or inactivate the old imported primary assignment and create/update the new one. Keep old stats attached to the old team/season/match.

### If record is missing from a new snapshot

Inactivate or archive. Do not hard delete by default.
