# STITCH_UI_REFERENCE.md

## Purpose

Use the Stitch/reference ZIPs as visual and structural input for rebuilding the frontend. They are references, not production code.

Do not paste the generated HTML as-is. Convert the useful parts into reusable React components and Next.js routes.

## Expected reference screens

The reference ZIPs may include screens like:

- Public home.
- First Team detail.
- First Team squad.
- First Team calendar/results.
- Matchday/player performance detail.
- MVP player card.
- MVP goalkeeper card.
- Team listing.
- Standard/youth team detail.
- Standard team squad.
- Standard team calendar.
- Standard team standings.
- Backoffice login.
- Backoffice dashboard for superadmin/manager/coach.
- Backoffice team management.

## Visual direction extracted from references

Use this as product direction, not strict pixel-perfect implementation:

- Premium football-club look.
- Dark-first interface.
- Deep navy base.
- Gold/yellow accent.
- Secondary dark-blue surfaces.
- Condensed display typography.
- Strong sports hierarchy.
- Technical borders and card framing.
- Compact stats and chips.
- Match cards with clear home/away/result/status.
- Public pages should feel like a club website, not a generic admin dashboard.
- Admin should be practical and calmer, but visually connected to the public brand.

## Token hints

Reference values mentioned during product definition:

- Deep navy: `#0B1B32`.
- Surface blue: `#1E2F47`.
- Gold accent: `#FDCB58`.
- Display font: `Bebas Neue`.
- Body/condensed font: `Barlow Condensed` or Barlow family.

These can coexist with earlier tokens from the inscriptions landing:

- `#071629`.
- `#0c2341`.
- `#f3cb45`.
- `#3470c8`.

## Implementation rules

- Use CSS variables/design tokens from the start.
- Build dark mode first.
- Keep tokens ready for light mode later.
- Avoid hardcoding colors throughout components.
- Prefer reusable components over page-specific markup.
- Use mock data only while real loaders/actions are missing.
- Keep UI copy short.

## Useful component families

Public:

- PublicSiteHeader.
- PublicMobileNav.
- HeroBlock.
- SectionHeader.
- TeamCard.
- PlayerCard.
- GeneratedPlayerCromo.
- PremiumCardImage.
- MatchCard.
- StandingsTable.
- StatsStrip.
- NewsCard.
- EmptyState.

Admin:

- AdminShell.
- AdminSidebar.
- AdminTopbar.
- AdminDashboardCard.
- AdminTable.
- AdminFilters.
- AdminFormSection.
- RoleBadge.
- PermissionGuard.
- ConfirmDialog.
- EmptyState.
