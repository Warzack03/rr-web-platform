# Environments

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

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` or framework-specific public URL
- `PUBLIC_SITE_URL`
- `UPLOAD_DIR`
- `NODE_ENV`
- `ADMIN_INITIAL_EMAIL` for setup only
- `ADMIN_INITIAL_PASSWORD` for setup only/local only

