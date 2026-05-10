# Public team detail page

Route: `/equipos/[teamSlug]`

## Goal

Show a complete public page for each team. The first team has a premium variant with richer visuals, uploaded premium cards, extended statistics and match video support. All other teams use the standard variant.

## Sections

1. Team hero
   - Team name
   - Category/branch
   - Season
   - Competition name
   - Public coach names
   - Banner/logo if available
   - Premium styling for first team

2. Quick summary cards
   - Next match
   - Latest result
   - Standing position if available
   - Squad count
   - Goals/assists summary if available

3. Next match
   - Opponent name
   - Optional opponent logo
   - Home/away
   - Date/time
   - Venue
   - Status

4. Latest results
   - Last 3 to 5 played matches for the team
   - Opponent, date, home/away, score and status

5. Standings
   - Manual standings table linked to team + season + competition
   - Not calculated from matches, because not all league results are tracked

6. Squad
   - Grouped by position if possible
   - Player photo or placeholder
   - Public name
   - Shirt number
   - Position
   - Link to player/card detail when available

7. Cards
   - First team: uploaded premium card images
   - Other teams: generated standard cards
   - Standard card fields: foot, public name, shirt number, country flag, position, goals, assists

8. Statistics
   - First team: extended stats and derived metrics
   - Other teams: simplified stats
   - Goal participation = goals + assists

9. Related news
   - Optional news tagged with this team
   - Hide section if no news exists

## First-team played match video

For first-team matches with status `PLAYED`, the detail can show an external video URL.

Fields:

- `videoUrl`
- `videoLabel`
- `videoProvider` optional

Videos are external URLs, not uploaded to Hostinger.

## Visibility fallback rules

- If no squad: show a friendly "Plantilla pendiente de publicar" state.
- If no standings: hide section or show "Clasificacion pendiente".
- If no next match: show latest result instead.
- If no player photo: use placeholder.
- If no opponent logo: use generic crest/opponent placeholder.

