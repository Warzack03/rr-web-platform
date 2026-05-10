# Database Implementation Notes

## First implementation order

1. Implement enums.
2. Implement `User`, `Season`, `Team`, `SeasonTeam`, `Player`.
3. Implement assignments and coaches.
4. Implement competitions, matches and standings.
5. Implement stats.
6. Implement news and media.
7. Implement import batches.
8. Add seed data.

## Prisma implementation guidance

Use `BigInt` IDs consistently.

In TypeScript, be careful serializing BigInt values to JSON. Convert IDs to strings in API/public DTOs.

Recommended DTO policy:

- Prisma model IDs: `bigint` internally.
- API/page DTO IDs: `string`.

## MySQL connection pool

Hostinger has a 75 simultaneous connection limit. Start with:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name?connection_limit=5"
```

Only raise to 10 if needed.

## Active season enforcement

Because MySQL does not support PostgreSQL-style partial unique indexes, enforce one active season using both:

- `Season.activeKey` nullable unique. Current season has `CURRENT`; all others null.
- service-level transaction when changing current season.

## Import IDs

`sourceExternalId` should store rr-management IDs as strings even if they come as numbers.

Example:

```json
{
  "sourceSystem": "rr-management",
  "sourceExternalId": "123"
}
```

Do not store rr-management NIF or other sensitive identifiers.

## Public DTOs

Public pages must not expose:

- source IDs;
- import metadata;
- audit fields;
- internal user IDs;
- private notes;
- any financial/logistics data.

## Deletion policy

Use soft delete and visibility flags. Hard delete is allowed only for:

- failed import staging records before apply;
- development seed resets;
- records with no historical references, only after confirmation.

## Stats aggregation

Initial implementation can calculate aggregates on request with caching.

Possible future optimization:

- add a `PlayerSeasonStatsSnapshot` table;
- recalculate via cron after match stats update;
- still keep `PlayerMatchStats` as source of truth.
