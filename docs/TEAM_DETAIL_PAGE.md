# TEAM_DETAIL_PAGE.md

## Route

```text
/equipos/[teamSlug]
```

Public team detail is mandatory MVP functionality.

By default, show the active season.

## Shared page sections

All public team detail pages include:

1. Team header.
2. Category, season and competition.
3. Visible coaches.
4. Next match.
5. Latest results.
6. Manual standings.
7. Squad.
8. Cards/cromos.
9. Statistics.
10. Related news if any.

Only show public/visible data. Never show internal/private data.

## First Team variant

The First Team uses a premium version of the page.

Include:

- Premium header.
- More complete match/result area.
- Manual standings.
- Squad.
- Uploaded premium card images.
- Advanced outfield and goalkeeper stats.
- Derived metrics.
- External video links for played matches.
- Related news.

## Standard team variant

Non-first-team pages are simpler but complete.

Include:

- Name.
- Category.
- Active season.
- Competition.
- Visible coaches.
- Next match.
- Latest results.
- Manual standings.
- Squad.
- Generated standard cards.
- Basic stats.
- Related news if any.

## Squad/player display

Each player should display:

- Public name.
- Shirt number.
- Position.
- Photo or placeholder.
- Country/flag.
- Dominant foot.
- Link to player/card detail when available.

## Generated standard card fields

For non-first-team players, generated cards use:

- Foot.
- Public name.
- Shirt number.
- Country flag.
- Position.
- Goals.
- Assists.

## First Team premium cards

First Team cards are uploaded images. The system stores image metadata/URL and associates each card to player/team/season.

## Match data

Each match displayed can show:

- Opponent.
- Optional opponent logo.
- Home/away.
- Date.
- Time.
- Venue.
- Matchday.
- Competition.
- Status.
- Result if played.
- External video URL if First Team and played.

## Standings

Manual standings only. If no standings exist, hide the section or show a neutral empty state.

## Empty states

- No squad: "Plantilla pendiente de publicar".
- No standings: hide or "Clasificacion pendiente".
- No next match: show latest result or neutral state.
- No photo/logo: use placeholder.
- No related news: hide section.

## Historical integrity

If a player changes team, do not move historical stats. Stats stay associated with the team/season/match where they were created.
