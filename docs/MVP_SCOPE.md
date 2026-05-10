# MVP Scope

## Goal
Create the first serious version of the Rising Raimon public sports website and sports backoffice using the existing Hostinger Business infrastructure.

## Included in MVP

### Admin/backoffice
- Admin login/logout.
- Basic roles: superadmin, editor/manager.
- Seasons management.
- Teams management.
- Players management.
- Assign players to teams per season.
- Manage player public fields: display name, slug, photo, position, dorsal, visibility.
- Competitions management.
- Matches management.
- Results management.
- Standings management, initially manual.
- Basic player/team statistics.
- Media upload/selection for public images.
- Import seasonal snapshot from `rr-management`.
- Preview or validate import before applying.

### Public website
- Home page.
- Teams list.
- Team detail page.
- Squad/roster page.
- Player public card/profile.
- Matches/results page.
- Standings page.
- Basic statistics display.
- Link to WooCommerce shop.
- Responsive mobile-first design.
- SEO-friendly public URLs.

### Infrastructure
- Deploy on Hostinger Business Node.js app.
- Use Hostinger MySQL.
- Use environment variables for secrets.
- Use caching/revalidation for public pages.

## Excluded from MVP
- Custom ecommerce.
- Custom Stripe checkout.
- Order management.
- Buyer account management.
- Replacing WooCommerce.
- Replacing WordPress entirely.
- Live sync with `rr-management`.
- Public access to `rr-management` APIs.
- RFFM/Municipal Madrid automation.
- Push notifications.
- Mobile app.
- Real-time websockets.
- Advanced analytics dashboards.
- Newsletter system.
- Finance, stock, deliveries or clothing management.
- Private area for fans/players.

## Nice-to-have after MVP
- Import from RFFM/Municipal public sources if technically viable.
- Better shop visual integration.
- Public news/blog module.
- Advanced statistics.
- Coach-specific roles.
- Batch image optimization.
- External backup automation.


## Latest scope additions

Included in MVP:

- Public detail page for every visible team.
- Team coach shown in team detail.
- News module in the new platform.
- Video URL support for First Team played matches.
- Role permissions: only superadmin/manager create teams and assign coach permissions.
- Dark mode first. Light mode after dark design is stable.

Still excluded from MVP:

- Automatic municipal/RFFM sync.
- Ecommerce replacement.
- Public runtime dependency on rr-management.
- Public runtime dependency on external competition websites.
