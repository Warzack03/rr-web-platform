# Hostinger Deployment Notes

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
Use Node.js 20 LTS unless there is a strong reason to choose another version.

## Suggested deployment structure
Start with:
- One production Node.js app for the new web platform.
- Optional second Node.js app for staging/beta.

Possible domains/subdomains:
- `beta.risingraimon.es` for development/staging.
- `www.risingraimon.es` or `risingraimon.es` for final public web.
- `tienda.risingraimon.es` or `/tienda` for WooCommerce if separated.

## Database
Use a dedicated MySQL database for the new platform. Do not mix tables with WordPress.

Recommended connection URL:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name?connection_limit=5"
```

Start with `connection_limit=5`. Increase to 10 only if needed.

## Caching
Public pages should be cached/static/incrementally regenerated. Avoid querying MySQL for every public request.

Recommended public flow:
- Admin writes to DB.
- Public pages/data are revalidated or cached.
- Visitors receive cached content.

## Backups
Hostinger backups are useful, but before migrations/imports:
- Create manual backup.
- Export MySQL database when possible.
- Keep migration rollback notes.

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
