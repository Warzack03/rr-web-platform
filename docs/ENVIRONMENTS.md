# Environments

For the full production deployment, backup, rollback and post-deploy checklist, use `docs/PRODUCTION_OPERATIONS_RUNBOOK.md`.

## Environments

### Local

Used for development.

- URL: `http://localhost:3000`
- Local MySQL or Docker MySQL recommended
- Seed data enabled

### Staging / beta

Used to test before replacing the current WordPress public site.

Recommended URL:

- `beta.risingraimon.es`

Hosted in Hostinger as a separate Node.js app if possible.

### Production

Final public website.

Recommended structure:

- `www.risingraimon.es` or `risingraimon.es`: new public website
- `tienda.risingraimon.es`: WordPress/WooCommerce shop
- admin route under new platform, e.g. `/admin`

## Hostinger app allocation

Hostinger allows up to 5 Node.js apps in the current plan.

Suggested allocation:

- App 1: production platform
- App 2: staging/beta platform
- Remaining apps: free for experiments/import tools if needed

## Environment variables

Use `.env.example` and configure real values in Hostinger hPanel.

Do not commit `.env` files.

Key variables:

- `NODE_ENV`
- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `UPLOAD_DIR`
- `ADMIN_INITIAL_EMAIL` for setup only
- `ADMIN_INITIAL_USERNAME` for setup only
- `ADMIN_INITIAL_DISPLAY_NAME` for setup only
- `ADMIN_INITIAL_PASSWORD` for setup only/local only
- `ENABLE_TEST_MANAGER` for local/test setup only
- `INITIAL_LOAD_DOC_PATH` for one-off bootstrap imports only

Production notes:

- Use Node.js 20 LTS. The project pins this with `engines.node >=20.9.0 <21` and `.nvmrc`.
- Set `NODE_ENV=production` in Hostinger.
- Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin, for example `https://www.risingraimon.es`.
- `AUTH_SECRET` must be a long random secret in production. Do not reuse the example value.
- Keep `DATABASE_URL` for Prisma CLI and migrations.
- Use `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` and `DB_CONNECTION_LIMIT` for runtime through the MariaDB adapter.
- Keep `DB_CONNECTION_LIMIT=5` initially; do not exceed `10` on Hostinger without measuring.
- Keep `UPLOAD_DIR="./public/media"` unless the Hostinger redeploy smoke test proves that runtime uploads need an absolute persistent directory.
- If `UPLOAD_DIR` changes, keep the public URL contract `/media/...`; do not rewrite existing `MediaAsset.publicUrl` values.
- Run production/staging schema changes with `npm run db:predeploy` and `npm run db:migrate:deploy`; never with `prisma migrate dev`.
- Follow `docs/DATABASE_MIGRATION_RUNBOOK.md` before any production migration.
- Follow `docs/PRODUCTION_OPERATIONS_RUNBOOK.md` for the complete go/no-go checklist before production.
