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


## Prisma 7+ MySQL adapter note

If the installed Prisma version requires a runtime driver adapter, use `@prisma/adapter-mariadb` with MySQL/MariaDB.

Keep `DATABASE_URL` for Prisma CLI and migrations.

For runtime client/seed, use separate environment variables when required:

```env
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="password-without-url-escaping"
DB_NAME="rr_web_platform_db"
DB_CONNECTION_LIMIT="5"
```

Do not instantiate Prisma 7 runtime with an empty `new PrismaClient()` if the project requires an adapter.

Do not pass `connectionString` to `PrismaMariaDb`; use `host`, `port`, `user`, `password`, `database`, `connectionLimit`.

Example pattern:

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "3306"),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "rr_web_platform_db",
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? "5"),
});

export const prisma = new PrismaClient({ adapter });
```

Use a singleton global in development to avoid creating multiple pools.
