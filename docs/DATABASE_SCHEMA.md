# Database Schema

Provider: MySQL.
ORM: Prisma.

The detailed accepted model is now documented in:

- `docs/DATABASE_FINAL_MODEL.md`
- `docs/PRISMA_SCHEMA_DRAFT.md`
- `docs/DATABASE_IMPLEMENTATION_NOTES.md`

## Key decisions

- Use MySQL on Hostinger Business.
- Use Prisma.
- Use `BigInt` IDs.
- Keep a low MySQL connection pool, starting with `connection_limit=5`.
- Model stable `Team` separately from `SeasonTeam`.
- Model stable `Player` separately from `PlayerSeasonProfile`.
- Store stats by `player + match + seasonTeam + season`.
- Do not move historical stats if imports change a player assignment.
- Use merge/upsert imports, not destructive replacement.
- Do not store sensitive rr-management fields.
- Do not store binary files in MySQL.
- Store media files in Hostinger filesystem initially and media metadata in DB.
- Use soft delete / archive behavior where historical integrity matters.

## Authoritative implementation files

Codex should use `DATABASE_FINAL_MODEL.md` to understand domain decisions and `PRISMA_SCHEMA_DRAFT.md` as the starting point for `prisma/schema.prisma`.
