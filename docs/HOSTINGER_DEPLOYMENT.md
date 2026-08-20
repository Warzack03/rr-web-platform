# Hostinger Deployment Notes

For the full production operating procedure, use `docs/PRODUCTION_OPERATIONS_RUNBOOK.md`.

## Available infrastructure
The existing Hostinger Business Web Hosting plan provides:
- Node.js Web Apps.
- Up to 5 Node.js apps.
- Node.js versions: 18.x, 20.x, 22.x, 24.x.
- MySQL.
- Maximum 75 simultaneous MySQL connections.
- Environment variables.
- GitHub deployment.
- Cron jobs.
- Around 3072 MB RAM.
- 2 CPU cores.
- Daily backups.
- Manual backups every 24h.
- 200 GB storage.
- 600,000 inodes.

## Recommended runtime
Use Node.js 20 LTS. The project declares `engines.node >=20.9.0 <21` and includes `.nvmrc` with `20`.

Recommended Hostinger commands:

```bash
npm install
npm run build
npm run db:predeploy
npm run db:migrate:deploy
npm run start
```

Use `npm run db:migrate:deploy` for production migrations. Do not use `prisma migrate dev` in production.

Use `npm run db:migrate:status` before and after deploy for inspection. A pending-migration result before deploy is acceptable only when those are the migrations you are about to apply; divergent history, failed migrations or connection errors block the deploy.

For the full backup, staging validation and rollback sequence, follow `docs/DATABASE_MIGRATION_RUNBOOK.md`.

## Suggested deployment structure
Start with:
- One production Node.js app for the new web platform.
- Optional second Node.js app for staging/beta.

Possible domains/subdomains:
- `beta.risingraimon.es` for development/staging.
- `www.risingraimon.es` or `risingraimon.es` for final public web.
- `tienda.risingraimon.es` or `/tienda` for WooCommerce if separated.

Preferred deployment source: GitHub integration from hPanel. Hostinger can also deploy ZIP files, but GitHub gives clearer redeploy history and repeatability.

Do not assume free-form SSH command execution. Hostinger documents npm commands as managed through Node.js app build settings/deployment flow.

## Database
Use a dedicated MySQL database for the new platform. Do not mix tables with WordPress.

Recommended connection URL:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name?connection_limit=5"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="user"
DB_PASSWORD="change-me"
DB_NAME="database_name"
DB_CONNECTION_LIMIT="5"
```

Keep `DATABASE_URL` for Prisma CLI/migrations. The app runtime uses the separate `DB_*` variables through the Prisma MariaDB adapter.

Start with `connection_limit=5` and `DB_CONNECTION_LIMIT=5`. Increase to 10 only if needed.

### Temporary database IP diagnostic

If MySQL stops accepting the Node.js app after a redeploy, temporarily add this
Hostinger environment variable and restart/redeploy the app:

```env
DB_IP_DIAGNOSTIC="true"
```

Submit one validly formatted login attempt and search the application logs for
`[node-egress-ip-diagnostic]`. A successful lookup prints `status: "IP_OK"` and
the public `sourceIp` used by Node immediately before Prisma queries MySQL. It
does not log the submitted login, password, database credentials or database
URL. If that IP is missing from the MySQL allowlist, add it and retry.

Set `DB_IP_DIAGNOSTIC="false"` and restart/redeploy after the check. The
diagnostic is disabled by default and must not remain enabled permanently.

## Required production variables

```env
NODE_ENV="production"
AUTH_SECRET="long-random-secret"
NEXTAUTH_URL="https://www.risingraimon.es"
NEXT_PUBLIC_SITE_URL="https://www.risingraimon.es"
UPLOAD_DIR="./public/media"
```

Never commit real secrets or database URLs with production credentials.

## Media persistence

The MVP stores uploaded images on the Hostinger filesystem and keeps metadata in MySQL `MediaAsset` records. Videos remain external URLs.

Default storage:

```env
UPLOAD_DIR="./public/media"
```

If Hostinger redeploy testing shows that runtime uploads inside the app directory are replaced, configure `UPLOAD_DIR` as an absolute persistent directory inside the hosting account, for example:

```env
UPLOAD_DIR="/home/{username}/domains/{domain}/media"
```

The app keeps public URLs under `/media/...`, so changing `UPLOAD_DIR` does not require changing stored `MediaAsset.publicUrl` values.

Before production, run the E.5 smoke test: upload one image, verify `/media/uploads/...`, restart the Node app, redeploy once, and verify the same URL again.

See `docs/MEDIA_PERSISTENCE_DECISION.md` for backup, restore and deletion rules.

## Caching
Public pages should be cached/static/incrementally regenerated. Avoid querying MySQL for every public request.

Recommended public flow:
- Admin writes to DB.
- Public pages/data are revalidated or cached.
- Visitors receive cached content.

## Security checks

Before production:

- Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin.
- Set a long random `AUTH_SECRET`.
- Run `npm audit --omit=dev --audit-level=moderate`.
- Follow `docs/OPERATIONAL_SECURITY_CHECKS.md`.

The app intentionally fails in production if `AUTH_SECRET` is missing or `NEXTAUTH_URL` is not HTTPS.

## Backups
Hostinger backups are useful, but before migrations/imports:
- Create or identify a manual MySQL backup before `npm run db:migrate:deploy`.
- Export MySQL database when possible.
- Download or verify a files backup that includes `UPLOAD_DIR` and `storage/media-trash`.
- Keep migration rollback notes.

Do not run production migrations if the backup cannot be downloaded or clearly identified by date/time.

## Cron jobs
Use cron only for lightweight tasks:
- cache warmup.
- scheduled publication.
- cleanup of temporary files.
- export/backup helpers.

Avoid heavy scraping, large image processing, or long-running jobs on shared hosting.

## Things to avoid on Hostinger Business
- Heavy scraping.
- Long-running CPU-heavy jobs.
- Unbounded image uploads.
- Websocket-heavy real-time features.
- Public endpoints without caching.
- Very high DB connection pools.
- Custom ecommerce/payment system in MVP.
- Runtime dependency on WordPress/WooCommerce for sports data.
- Runtime dependency on `rr-management`.
