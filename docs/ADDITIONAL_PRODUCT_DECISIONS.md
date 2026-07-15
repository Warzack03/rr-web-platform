# Additional product decisions

## Team coaches

A team can show multiple coaches publicly.

The public coach list is managed as informative team data and does not require linked platform accounts.

## Season visibility

Only one active season is allowed.

The public site shows the active season by default. Historical information may be stored but historical public browsing is not part of MVP unless explicitly implemented later.

## Search and filters

Admin should support:

- filter by season
- filter by team
- search player by name
- filter matches by status
- filter news by status
- filter import batches by status/date

Public MVP should support:

- teams grouped by category/branch
- squad grouped by position

Future useful filters:

- player stats ranking by goals, assists and goal participations
- matches by team and status
- news by team/category

## WordPress/WooCommerce

WordPress remains only for shop, checkout, Stripe payments, orders and buyer accounts.

The shop moves to a subdomain:

- `tienda.risingraimon.es`

The new platform does not implement ecommerce in MVP.
