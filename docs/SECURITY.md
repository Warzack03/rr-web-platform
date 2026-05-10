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
