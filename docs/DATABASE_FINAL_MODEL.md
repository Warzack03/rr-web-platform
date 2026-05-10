# Database Final Model

Status: accepted draft for Codex implementation.
Provider: MySQL.
ORM: Prisma.

This document is the source of truth for the first Prisma schema. It is designed for Hostinger Business Web Hosting, MySQL and a Next.js app.

## Goals

- Support a public sports website and a private sports backoffice.
- Preserve historical sports data across seasons.
- Import the sports master data from `rr-management` without importing sensitive data.
- Keep matches, stats and standings stable even if a player later changes team.
- Avoid destructive imports.
- Avoid storing binary images in MySQL.

## Main modeling decisions

### Team identity vs season team

Use two levels:

- `Team`: stable club team identity, for example `PRIMER_EQUIPO`, `JUVENIL_A`, `CADETE_B`.
- `SeasonTeam`: the participation/profile of that team in a concrete season.

Most public sports data must point to `SeasonTeam`, not just `Team`.

Examples:

- A player assignment belongs to `SeasonTeam`.
- A match belongs to `SeasonTeam`.
- A standings table belongs to `SeasonTeam`.
- A coach visible on the website belongs to `SeasonTeam`.

This avoids losing history when the same team changes name, competition, category or manager in a future season.

### Player identity vs player season profile

Use two levels:

- `Player`: stable person/player identity imported from rr-management.
- `PlayerSeasonProfile`: sporting information of that player in a concrete season.

`Player` must not store sensitive fields from rr-management such as NIF, address, phone, private notes, document status or payment information.

### Stats integrity

Stats must remain linked to the original `player + seasonTeam + match` where they were created.

If a later import moves a player to another team:

- close/inactivate the previous assignment;
- create/update the new assignment;
- do not move existing stats;
- do not rewrite historical matches.

### Import strategy

Use merge/upsert import, not destructive replacement.

rr-management controls:

- season master data;
- team master data;
- player base identity;
- main player/team/season assignment;
- base sporting position data.

The new platform controls:

- public slugs;
- public names;
- photos;
- card images;
- public visibility;
- matches;
- standings;
- stats;
- news;
- videos;
- media;
- manually created exceptional assignments.

## Entity list

### Auth and permissions

- `User`
- `CoachTeamPermission`

### Settings

- `SiteSettings`

### Sports master

- `Season`
- `Team`
- `SeasonTeam`
- `Player`
- `PlayerSeasonProfile`
- `TeamPlayerAssignment`
- `TeamCoach`

### Competition and results

- `Competition`
- `Match`
- `StandingTable`
- `StandingRow`
- `PlayerMatchStats`

### Content and media

- `NewsPost`
- `NewsPostTeam`
- `MediaAsset`

### Import

- `ImportBatch`
- `ImportBatchItem`

## Important enums

### UserRole

- `SUPERADMIN`
- `MANAGER`
- `COACH`

### SeasonStatus

- `DRAFT`
- `CURRENT`
- `ARCHIVED`

Only one season can be `CURRENT`. MySQL cannot enforce this with a partial unique index, so use the `activeKey` nullable unique trick or enforce it in application code. Recommended: `activeKey` is nullable and unique; the current season has `activeKey = 'CURRENT'`, all others have null.

### MatchStatus

- `SCHEDULED`: pending to play.
- `LIVE`: in play/live; mainly for First Team.
- `PLAYED`: completed and result entered.
- `POSTPONED`: postponed, result not required.

### PlayerStatRole

- `FIELD_PLAYER`
- `GOALKEEPER`

### NewsStatus

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

### ImportStatus

- `UPLOADED`
- `VALIDATED`
- `APPLIED`
- `FAILED`
- `CANCELLED`

### ImportAction

- `CREATE`
- `UPDATE`
- `INACTIVATE`
- `SKIP`
- `CONFLICT`
- `ERROR`

## Tables

### User

Purpose: authenticated admin/backoffice accounts.

Fields:

- `id`
- `email` unique
- `username` unique, for coach accounts like `entrenador_juvenil_a`
- `passwordHash`
- `displayName`
- `role`: `SUPERADMIN`, `MANAGER`, `COACH`
- `active`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

Rules:

- Only superadmin manages users and permissions.
- Managers do not create or grant users.
- Coach users only edit data for assigned teams.

### CoachTeamPermission

Purpose: grant a coach account editing permission over one or more `SeasonTeam` records.

Fields:

- `id`
- `userId`
- `seasonTeamId`
- `active`
- `createdById`
- `createdAt`
- `updatedAt`

Rules:

- Usually one coach account per team.
- The account can be named `entrenador_<team_code_or_slug>`.
- Visible coaches on the website are stored separately in `TeamCoach`.

### SiteSettings

Purpose: global site configuration.

Fields:

- `id`
- `activeSeasonId`
- `publicSiteName`
- `shopUrl`
- `createdAt`
- `updatedAt`

Rules:

- Default public website views use `activeSeasonId`.
- Shop URL initially points to `tienda.risingraimon.es`.

### Season

Purpose: sports season.

Fields:

- `id`
- `name` unique, for example `2026/2027`
- `slug` unique
- `startDate`
- `endDate`
- `status`
- `activeKey` nullable unique, set to `CURRENT` only for the active season
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- `createdAt`
- `updatedAt`
- `deletedAt`

Rules:

- Only one active/current season.
- Public website defaults to current season.
- Historical display can be implemented later.

### Team

Purpose: stable club team identity.

Fields:

- `id`
- `code` unique, imported from rr-management when available
- `name`
- `slug` unique
- `branch` optional, from rr-management
- `displayOrder`
- `active`
- `isFirstTeam`
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- `createdAt`
- `updatedAt`
- `deletedAt`

Rules:

- Only superadmin and manager can create/edit teams.
- `isFirstTeam` enables premium public treatment and extended stats.
- Do not hard-delete teams with history.

### SeasonTeam

Purpose: public and sporting configuration of a team in a season.

Fields:

- `id`
- `seasonId`
- `teamId`
- `competitionId` optional
- `publicName`
- `publicSlug`
- `category`
- `competitionName` optional denormalized text
- `description` optional
- `publicVisible`
- `logoMediaId` optional
- `bannerMediaId` optional
- `displayOrder`
- `active`
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Constraints:

- unique `(seasonId, teamId)`
- unique `(seasonId, publicSlug)`

Rules:

- The public team detail page renders `SeasonTeam` for the active season.
- Public route: `/equipos/[publicSlug]`.

### Player

Purpose: stable player identity imported from rr-management.

Fields:

- `id`
- `firstName`
- `lastName`
- `publicName`
- `slug` unique
- `birthDate` optional, not shown publicly by default
- `countryCode` optional, for flag on card
- `preferredFoot` optional, for card
- `active`
- `publicVisible`
- `photoMediaId` optional
- `premiumCardMediaId` optional, mostly First Team
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Rules:

- Do not store NIF, address, phone, private notes, document status or financial data.
- Local public fields should not be overwritten blindly by import.
- Public player pages may be implemented after MVP if needed.

### PlayerSeasonProfile

Purpose: sporting profile of a player in a specific season.

Fields:

- `id`
- `playerId`
- `seasonId`
- `primaryPosition`
- `secondaryPosition`
- `tertiaryPosition`
- `level` optional
- `publicPosition` optional
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- `createdAt`
- `updatedAt`

Constraints:

- unique `(playerId, seasonId)`

Rules:

- Import positions from rr-management.
- Do not import `sports_notes`, `training_preference` or `match_preference` unless explicitly reviewed later.

### TeamPlayerAssignment

Purpose: relation between player and season team.

Fields:

- `id`
- `playerId`
- `seasonTeamId`
- `seasonId` denormalized for efficient filtering
- `shirtNumber` optional
- `position` optional
- `isPrimary`
- `isManualException`
- `isCaptain`
- `displayOrder`
- `active`
- `joinedAt`
- `leftAt`
- import trace fields: `sourceSystem`, `sourceExternalId`, `lastImportBatchId`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Indexes:

- `(playerId, seasonId)`
- `(seasonTeamId, active)`
- `(seasonId, active)`

Rules:

- Imports from rr-management update the primary assignment.
- Manual exceptional assignments can coexist.
- Avoid a hard unique constraint that prevents rare multi-team exceptions.
- App-level rule: normally one active primary assignment per player and season.

### TeamCoach

Purpose: visible coaches/staff for a specific team-season.

Fields:

- `id`
- `seasonTeamId`
- `userId` optional
- `name`
- `roleLabel`, for example `Entrenador`, `Segundo entrenador`, `Delegado`
- `photoMediaId` optional
- `publicVisible`
- `displayOrder`
- `createdAt`
- `updatedAt`

Rules:

- A team may have several visible coaches.
- Only one of them usually has a coach account.
- Managers maintain this information.

### Competition

Purpose: manual competition metadata.

Fields:

- `id`
- `seasonId`
- `name`
- `slug`
- `organizer` optional, e.g. `Liga Municipal`, `RFFM`
- `groupName` optional
- `active`
- `createdAt`
- `updatedAt`

Constraints:

- unique `(seasonId, slug)`

Rules:

- A team normally belongs to one competition at a time.
- External API integrations are future scope, not MVP.

### Match

Purpose: match for one internal `SeasonTeam` against an external opponent.

Fields:

- `id`
- `seasonId`
- `seasonTeamId`
- `competitionId` optional
- `matchday` optional
- `dateTime` optional
- `venue` optional
- `isHome`
- `opponentName`
- `opponentLogoMediaId` optional
- `status`
- `homeScore` optional
- `awayScore` optional
- `summary` optional
- `videoUrl` optional, mainly First Team when `PLAYED`
- `videoLabel` optional
- `liveUrl` optional, future direct/live link
- `publicVisible`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Indexes:

- `(seasonTeamId, status)`
- `(seasonTeamId, dateTime)`
- `(seasonId, dateTime)`

Rules:

- `PLAYED` requires result.
- `POSTPONED` does not require result.
- `LIVE` mainly for First Team.
- Opponent is free text in MVP; no need for opponent team table.

### StandingTable

Purpose: manually edited classification for a team-season/competition.

Fields:

- `id`
- `seasonId`
- `seasonTeamId`
- `competitionId` optional
- `title`
- `sourceLabel` optional
- `updatedLabel` optional
- `publicVisible`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Rules:

- Manual source of truth.
- Do not calculate from matches because not all league matches are entered.

### StandingRow

Purpose: one row in a manual standings table.

Fields:

- `id`
- `standingTableId`
- `position`
- `teamName`
- `played`
- `won`
- `drawn`
- `lost`
- `goalsFor`
- `goalsAgainst`
- `goalDifference`
- `points`
- `isOwnTeam`
- `displayOrder`

Rules:

- `teamName` is text, not necessarily linked to internal teams.
- `goalDifference` can be stored for display consistency and recalculated on save.

### PlayerMatchStats

Purpose: stats for a player in a concrete match/team/season context.

Fields:

- `id`
- `matchId`
- `seasonId`
- `seasonTeamId`
- `playerId`
- `statRole`: `FIELD_PLAYER` or `GOALKEEPER`
- `played` boolean
- shared stats: `goals`, `assists`, `yellowCards`, `redCards`
- First Team field-player stats: `recoveries`, `shots`, `shotsOnTarget`, `ownGoals`
- goalkeeper stats: `saves`, `goalsAgainst`, `cleanSheets`, `shotsOnTargetAgainst`
- audit fields: `createdById`, `updatedById`, `createdAt`, `updatedAt`

Constraints:

- unique `(matchId, playerId)`

Rules:

- Aggregated season/team/player stats are calculated from this table.
- Goal participations = `goals + assists`.
- For non-First-Team, UI only exposes simple stats.
- Existing rows remain tied to their original match/team if player assignment changes.

### NewsPost

Purpose: public news managed in the new platform.

Fields:

- `id`
- `title`
- `slug` unique
- `excerpt`
- `bodyMarkdown`
- `coverMediaId` optional
- `externalVideoUrl` optional
- `status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `featured`
- `publishedAt` optional
- audit fields: `authorId`, `createdById`, `updatedById`, `createdAt`, `updatedAt`, `deletedAt`

Rules:

- News are included in MVP.
- Use Markdown or a simple editor.
- External video URLs are allowed.

### NewsPostTeam

Purpose: optional relation between news and teams.

Fields:

- `newsPostId`
- `seasonTeamId`

Constraint:

- unique `(newsPostId, seasonTeamId)`

### MediaAsset

Purpose: store metadata for uploaded or external images/files.

Fields:

- `id`
- `type`, e.g. `IMAGE`, `VIDEO_LINK`, `DOCUMENT`
- `usage`, e.g. `PLAYER_PHOTO`, `PLAYER_CARD`, `TEAM_LOGO`, `TEAM_BANNER`, `NEWS_COVER`, `OPPONENT_LOGO`
- `storagePath` optional
- `publicUrl`
- `externalUrl` optional
- `altText`
- `mimeType` optional
- `sizeBytes` optional
- `width` optional
- `height` optional
- `uploadedById` optional
- `createdAt`
- `updatedAt`

Rules:

- Do not store binary files in MySQL.
- Store files on Hostinger filesystem initially.
- DB only stores metadata and URLs.
- Videos are external URLs, not uploaded videos.

### ImportBatch

Purpose: one import execution from rr-management.

Fields:

- `id`
- `sourceSystem`, usually `rr-management`
- `seasonId` optional until validated
- `status`
- `fileName`
- `fileHash`
- `summaryJson`
- `createdById`
- `validatedAt`
- `appliedAt`
- `createdAt`
- `updatedAt`

Rules:

- Only superadmin can create/apply imports.
- Import must preview/diff before applying.
- Import must not include sensitive data.

### ImportBatchItem

Purpose: line-level import diff/log.

Fields:

- `id`
- `importBatchId`
- `entityType`
- `sourceExternalId`
- `action`
- `status`
- `message`
- `beforeJson`
- `afterJson`
- `errorJson`
- `createdAt`
- `appliedAt`

Rules:

- Keep enough info to understand what changed.

## Source trace fields

For imported entities, include:

- `sourceSystem`: nullable string, default `rr-management` when imported.
- `sourceExternalId`: nullable string, original ID from rr-management.
- `lastImportBatchId`: nullable foreign key to ImportBatch.

Recommended imported entities:

- Season
- Team
- SeasonTeam
- Player
- PlayerSeasonProfile
- TeamPlayerAssignment

## Audit fields

For entities edited by users, include:

- `createdById`
- `updatedById`
- `createdAt`
- `updatedAt`
- `deletedAt` where historical safety matters.

## Soft delete policy

Use `deletedAt` or inactive flags rather than hard delete for:

- teams;
- season teams;
- players;
- assignments;
- matches;
- standings;
- news;
- media.

Do not hard-delete records with history except in development seed/reset flows.

## Image and file policy

- Store image files in Hostinger filesystem initially.
- Use optimized formats such as WebP where possible.
- Store DB references, not binary blobs.
- Opponent logos are optional media assets.
- First Team premium cards are uploaded images.
- Other team cards are generated by the web using player data.

## Derived stats

Do not store derived stats as authoritative data in MVP.

Calculate from `PlayerMatchStats`:

- goal participations = goals + assists;
- goals per match;
- assists per match;
- shots per match;
- shots on target rate;
- saves per match;
- clean sheet rate.

If caching derived season stats becomes necessary later, add a materialized summary table or scheduled recalculation job.
