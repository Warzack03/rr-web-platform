# UI_PUBLIC_SITE.md

## Goal

The public website must feel like a premium football club website: professional, youthful, fast and mobile-first.

It must not look like a generic SaaS dashboard. Public pages should prioritize emotion, hierarchy, match context, teams, players, statistics and news.

## Visual references

Use the Stitch/reference ZIPs as visual/structural references when provided. Treat them as design input, not production code.

Expected reference pages may include:

- Public home.
- First Team detail.
- First Team squad and calendar.
- Player/goalkeeper MVP cards.
- Team listing.
- Standard team detail.
- Standard team squad/calendar/standings.
- Backoffice login and dashboards.

## Dark-first design

Design and implement dark mode first. Prepare CSS variables/tokens so light mode can be added later without rewriting components.

## Core visual tokens

Use these as a basis, adapted to Tailwind/CSS variables:

```css
--rr-bg: #0B1B32;
--rr-surface: #1E2F47;
--rr-gold: #FDCB58;
--rr-bg-alt: #071629;
--rr-bg-soft: #0c2341;
--rr-text: #eef4ff;
--rr-muted: #bfd0e8;
--rr-accent-blue: #3470c8;
--rr-danger: #d64045;
--rr-border: rgba(255, 255, 255, 0.12);
--rr-radius-xl: 32px;
--rr-radius-lg: 22px;
--rr-radius-md: 16px;
--rr-font-display: "Bebas Neue", sans-serif;
--rr-font-body: "Barlow Condensed", "Barlow", sans-serif;
--rr-max-width: 1180px;
```

## UI copy rule

Keep on-screen text short and clear. Avoid long explanatory paragraphs, implementation details or process explanations.

## Public routes

- `/` - Home.
- `/primer-equipo` - Premium First Team page.
- `/equipos` - Team listing.
- `/equipos/[teamSlug]` - Team detail.
- `/jugadores/[playerSlug]` - Player detail/card when enabled.
- `/partidos` - Calendar/results.
- `/clasificacion` - First Team standings or classification hub.
- `/noticias` - News listing.
- `/noticias/[slug]` - News detail.
- `/tienda` - Link/redirect to `https://tienda.risingraimon.es`.

## Public home requirements

The home must include:

1. Club hero.
2. First Team next match.
3. Latest results.
4. First Team standings summary.
5. Recent news.
6. Access to First Team page.
7. Access to all teams.
8. External shop link.
9. Social/contact area if available.

## First Team page

The First Team is the most important public sports page. It has a premium variant.

It must include:

- Premium header.
- Team information.
- Visible coaches.
- Next match.
- Latest results.
- Manual standings.
- Squad.
- Uploaded premium card images.
- Advanced statistics.
- Played match video links when available.
- Related news.

## Standard team detail

Every non-first-team page must still be complete and useful, but simpler than the First Team.

It must include:

- Team name.
- Category.
- Active season.
- Competition.
- Visible coaches.
- Next match.
- Latest results.
- Manual standings.
- Squad.
- Web-generated cards.
- Basic stats.
- Related news if any.

## Team listing

The team listing should show all public teams in the active season.

Useful grouping/filtering:

- Category.
- Branch/group if available.
- Active season.

## Public component priorities

- PublicSiteHeader.
- PublicMobileNav.
- HeroBlock.
- SectionHeader.
- TeamCard.
- MatchCard.
- StandingsTable.
- PlayerCard.
- GeneratedPlayerCromo.
- PremiumCardImage.
- StatsStrip.
- NewsCard.
- EmptyState.

## Empty states

- No squad: "Plantilla pendiente de publicar".
- No standings: hide section or "Clasificacion pendiente".
- No next match: show latest result or neutral message.
- No player photo: use placeholder.
- No opponent logo: use generic opponent placeholder.
