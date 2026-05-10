# Domain Model

## Season
Represents a sports season.

Suggested fields:
- id
- name, e.g. `2026/2027`
- slug, e.g. `2026-2027`
- startsAt
- endsAt
- isActive
- createdAt
- updatedAt

Rules:
- Only one season should normally be active.
- Public data should usually be scoped by season.

## Team
Represents a Rising Raimon team in a season/category.

Suggested fields:
- id
- seasonId
- name
- slug
- category
- shortName
- description
- coverImageUrl
- badgeImageUrl
- publicVisible
- displayOrder
- sourceExternalId optional, for imported rr-management assignment id
- sourceSystem optional
- isPrimary boolean, for main imported assignment
- isManualException boolean, for exceptional manual extra assignments
- createdAt
- updatedAt

Rules:
- Slug should be unique per season.
- Teams may be hidden from public website.

## Player
Represents a public-safe player record.

Suggested fields:
- id
- publicName
- slug
- photoUrl
- birthYear optional
- preferredFoot optional
- heightCm optional
- publicBio optional
- publicVisible
- sourceExternalId optional, for import mapping from `rr-management` person id
- sourceSystem optional, e.g. `rr-management`
- importControlled boolean optional
- createdAt
- updatedAt

Rules:
- Do not store DNI/NIF, address, phone or private email in this platform.
- Slug should be unique.
- The system may store only public-safe identity fields.

## TeamPlayer
Represents a player assignment to a team in a season.

Suggested fields:
- id
- teamId
- playerId
- seasonId
- dorsal
- position
- isCaptain
- active
- joinedAt optional
- leftAt optional
- displayOrder
- sourceExternalId optional, for imported rr-management assignment id
- sourceSystem optional
- isPrimary boolean, for main imported assignment
- isManualException boolean, for exceptional manual extra assignments
- createdAt
- updatedAt

Rules:
- A player can belong to different teams across seasons.
- A player may exceptionally belong to more than one team in the same season.
- Imported rr-management assignment is usually primary. Manual exceptional assignments must be preserved by import.
- Do not model player ownership as a direct permanent `player.teamId`.

## Competition
Represents a league, tournament or friendly competition.

Suggested fields:
- id
- seasonId
- name
- slug
- provider optional, e.g. `manual`, `rffm`, `municipal`
- groupName optional
- publicVisible
- createdAt
- updatedAt

## Match
Represents a match involving one Rising Raimon team.

Suggested fields:
- id
- seasonId
- competitionId optional
- teamId
- matchday optional
- dateTime
- venue optional
- homeTeamName
- awayTeamName
- homeScore optional
- awayScore optional
- isHome boolean
- status: scheduled, played, postponed, cancelled
- notes optional
- publicVisible
- createdAt
- updatedAt

Rules:
- Store opponent names as text initially; external opponent entity is optional later.
- Results can be manually entered.

## StandingRow
Represents one row in a classification/standings table.

Suggested fields:
- id
- seasonId
- competitionId
- teamId optional
- teamName
- position
- played
- won
- drawn
- lost
- goalsFor
- goalsAgainst
- goalDifference
- points
- createdAt
- updatedAt

Rules:
- Manual standings are acceptable for MVP.
- Recalculation automation can come later.

## PlayerStat
Represents public player statistics for a season/team/competition.

Suggested fields:
- id
- seasonId
- teamId
- playerId
- competitionId optional
- matchesPlayed
- goals
- assists
- yellowCards
- redCards
- ownGoals optional
- recoveries optional
- shots optional
- shotsOnTarget optional
- saves optional
- goalsConceded optional
- cleanSheets optional
- mvpCount
- minutes optional
- createdAt
- updatedAt

## NewsPost
Optional in MVP depending on priority.

Suggested fields:
- id
- title
- slug
- excerpt
- content
- coverImageUrl
- status: draft, published
- publishedAt
- authorId
- createdAt
- updatedAt

## MediaAsset
Represents public media files.

Suggested fields:
- id
- url
- fileName
- mimeType
- sizeBytes
- width optional
- height optional
- altText optional
- uploadedById
- createdAt

## ImportBatch
Represents an import from `rr-management` CSV/ZIP snapshot. Import uses merge/upsert, not destructive replacement.

Suggested fields:
- id
- source
- status: pending, validated, applied, failed
- seasonId optional
- summaryJson
- errorJson optional
- createdById
- createdAt
- appliedAt optional


## ImportBatchItem
Represents one row-level diff/action in an import batch.

Suggested fields:
- id
- importBatchId
- entityType: season, team, player, profile, assignment
- sourceExternalId
- action: create, update, inactivate, archive, skip, conflict
- status: pending, applied, failed
- beforeJson optional
- afterJson optional
- errorJson optional
- createdAt

## Import ownership rules

Fields from rr-management are import-controlled only for master data. Web-owned fields must not be overwritten automatically.

Import-controlled examples:
- base name
- active status
- primary imported assignment
- primary position
- team code/name/order/branch

Web-owned examples:
- public slug once published
- public name override
- photos/card images
- public visibility
- bio
- matches
- standings
- statistics
- manual exceptional assignments

## Historical stats rule

Statistics always remain attached to the team, season and matches where they were created. If an import moves a player to another team, do not move or recalculate old stats automatically.
