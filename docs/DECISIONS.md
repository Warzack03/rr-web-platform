# Technical and Functional Decisions

## D001 - Use Hostinger Business for the new platform
Status: accepted

The new web platform should use the existing Hostinger Business Web Hosting plan to avoid additional recurring infrastructure cost.

Consequences:
- Use Node.js apps provided by Hostinger.
- Use MySQL provided by Hostinger.
- Avoid new paid infrastructure such as Render Pro, Supabase Pro or a VPS in the MVP.
- Keep the architecture portable enough to migrate later if Hostinger becomes limiting.

## D002 - Keep rr-management separate
Status: accepted

The existing `rr-management` app should remain focused on internal club management and should not become the live backend of the public website.

Reasons:
- It runs on free Render/Supabase/GitHub Pages tiers.
- It contains sensitive/internal information.
- It should not receive public website traffic.
- It has a different responsibility: internal administration.

Consequences:
- The public web platform will have its own MySQL database.
- `rr-management` can export stable master data once per season.
- No runtime dependency from the public website to `rr-management`.

## D003 - Reuse only sports master data from rr-management
Status: accepted

The new platform may import the following from `rr-management`:
- Seasons.
- Teams.
- Players/persons transformed into public player records.
- Team/player assignments.

The new platform must not import:
- Finance data.
- Clothing/stock/logistics data.
- NIF/DNI.
- Phone numbers.
- Addresses.
- Internal notes.
- Sensitive administrative status.

Consequences:
- Import must filter and transform data into a public-safe format.
- A seasonal snapshot is enough for the first version.

## D004 - Keep WordPress/WooCommerce for ecommerce
Status: accepted

WooCommerce currently solves shop, products, cart, Stripe payments, orders and customer accounts. With low monthly order volume, rebuilding ecommerce is not justified.

Consequences:
- MVP does not include custom ecommerce.
- Public web may link to WooCommerce shop.
- The visual integration can be improved later.

## D005 - Use MySQL, not PostgreSQL, for the new platform
Status: accepted

Hostinger Business provides MySQL. To keep cost at zero additional infrastructure, the new platform should use MySQL.

Consequences:
- Use Prisma with MySQL provider.
- Avoid PostgreSQL-specific features.
- Keep schema portable where possible.

## D006 - Cache public website data
Status: accepted

Public visitors should not cause unnecessary DB load. Public pages should be cached/static/incrementally regenerated wherever possible.

Consequences:
- Admin writes to DB in real time.
- Public pages should use cache/revalidation patterns.
- Use limited DB pool size.

## D007 - Use Excel/CSV/JSON only for import/export
Status: accepted

Excel should not be the main database. However, import/export formats are useful for seasonal snapshots and bulk operations.

Consequences:
- Implement import workflows with validation and confirmation.
- Store validated data in MySQL.

## D008 - Build a sports-publicable platform, not a full club ERP
Status: accepted

The new platform should manage data that appears on the public website or supports public sports content. It should not duplicate all internal management from `rr-management`.

Consequences:
- Do not build finance, clothing stock, delivery management or internal billing in the new platform.
- Keep the product scope focused.


## D009 - Use merge/upsert import, not destructive replacement
Status: accepted

The import from `rr-management` must not blindly delete and recreate imported data. It must load the new snapshot, compare it with existing data, show a diff preview, and apply changes with merge/upsert logic.

Consequences:
- Use external IDs from rr-management for stable matching.
- Inactivate/archive missing records instead of hard deleting.
- Preserve public-web fields and historical relationships.
- Store import batch history and row-level actions.

## D010 - Preserve historical statistics on team changes
Status: accepted

If a player changes team through an import, existing statistics remain associated with the team, season and matches where they were created.

Consequences:
- Do not move stats automatically during import.
- Stats must reference team, player, season and optionally match/competition.
- Assignment changes create/close assignments but do not rewrite historical sports data.

## D011 - Preserve manual exceptional assignments
Status: accepted

Although rr-management enforces one active team assignment per person and season, the new web platform must allow rare exceptions where a player appears in more than one team.

Consequences:
- Imported rr-management assignment is normally the primary assignment.
- Manual exceptional assignments can be created in the web platform.
- Import must not remove manual exceptional assignments unless explicitly confirmed.
