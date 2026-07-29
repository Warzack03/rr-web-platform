# Security Guidelines

## Core principles
- Public website must never expose private/internal data.
- Admin endpoints require authentication.
- Admin actions require authorization.
- Public endpoints must return only public-safe fields.
- Do not import or store sensitive fields unless explicitly required.
- Validate all inputs.
- Sanitize rich text content.
- Limit file uploads.
- Keep secrets in environment variables only.

## Sensitive data not allowed in new public platform
- DNI/NIF.
- Full address.
- Phone number.
- Private email for public players.
- Payment status.
- Billing information.
- Clothing/stock/delivery information.
- Internal notes.
- Medical information.
- Any unnecessary personal data.

## Authentication
MVP needs admin authentication only.

Recommended roles:
- superadmin: full access.
- manager/editor: manage sports content.

Future roles:
- coach: manage only assigned teams.
- content-editor: manage news/media only.

## Public data
Public player profile can include:
- publicName.
- photo.
- team.
- dorsal.
- position.
- public stats.
- public bio.

Do not expose fields copied directly from internal person records without filtering.

## File uploads
- Allow only image types needed for public media.
- Enforce size limit.
- Generate safe filenames.
- Store alt text where possible.
- Optimize images where feasible.

## Database
- Use least-privilege database user if Hostinger allows it.
- Backup before migrations.
- Do not log secrets.
- Do not log full import payloads if they may contain private data.

## Admin hardening
- Protect `/admin` routes.
- Rate-limit login if feasible.
- Use secure password hashing.
- Use HTTPS only.
- Do not expose stack traces in production.

## Operational checklist

Use `docs/OPERATIONAL_SECURITY_CHECKS.md` before production deployment.

Current MVP hardening:

- production auth requires `AUTH_SECRET`;
- production `NEXTAUTH_URL` must use `https://`;
- NextAuth uses secure cookies in production;
- admin login callback URLs are restricted to local `/admin` routes;
- admin/API responses use `no-store`;
- global security headers include `nosniff`, `DENY` framing, strict referrer policy and a restrictive permissions policy;
- media uploads are capped by multipart body size, file size, MIME/signature and dimensions;
- `npm audit --omit=dev --audit-level=moderate` must report no runtime vulnerabilities before production.

Known non-runtime note:

- full `npm audit` still reports a dev-only ESLint/minimatch/brace-expansion advisory; do not apply a blind override because it breaks ESLint. Revisit when the ESLint/Next config stack has a compatible non-breaking update.
