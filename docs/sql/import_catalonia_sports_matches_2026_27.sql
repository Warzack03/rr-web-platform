-- Catalonia Sports / Senior Barcelona / Temporada 2026/27
-- Requiere haber aplicado antes la migracion 20260915170000_add_venue_catalog.
-- Las fechas se almacenan en UTC para que la web las muestre en Europe/Madrid.

START TRANSACTION;

SET @competition_id := (
  SELECT c.id
  FROM competitions c
  INNER JOIN site_settings ss ON ss.activeSeasonId = c.seasonId
  WHERE c.name = 'Catalonia Sports'
    AND c.active = TRUE
  ORDER BY c.id DESC
  LIMIT 1
);

SET @season_id := (
  SELECT c.seasonId
  FROM competitions c
  WHERE c.id = @competition_id
  LIMIT 1
);

SET @season_team_id := (
  SELECT st.id
  FROM season_teams st
  WHERE st.seasonId = @season_id
    AND st.competitionId = @competition_id
    AND st.active = TRUE
    AND st.deletedAt IS NULL
    AND (st.publicSlug = 'senior-barcelona' OR st.publicName = 'Senior Barcelona')
  ORDER BY (st.publicSlug = 'senior-barcelona') DESC, st.id DESC
  LIMIT 1
);

INSERT INTO venues (
  competitionId,
  name,
  slug,
  address,
  active,
  createdAt,
  updatedAt,
  deletedAt
)
SELECT @competition_id, venue_data.name, venue_data.slug, NULL, TRUE, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), NULL
FROM (
  SELECT 'Sant Ignasi Sarrià · Pista 1' AS name, 'sant-ignasi-sarria-pista-1' AS slug
  UNION ALL SELECT 'Sant Ignasi Sarrià · Pista 2', 'sant-ignasi-sarria-pista-2'
  UNION ALL SELECT 'Sant Ignasi Sarrià · Pista 3', 'sant-ignasi-sarria-pista-3'
  UNION ALL SELECT 'Sant Ignasi Sarrià · Pista 4', 'sant-ignasi-sarria-pista-4'
) AS venue_data
WHERE @competition_id IS NOT NULL
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  active = TRUE,
  deletedAt = NULL,
  updatedAt = CURRENT_TIMESTAMP(3);

DROP TEMPORARY TABLE IF EXISTS rr_tmp_catalonia_schedule;

CREATE TEMPORARY TABLE rr_tmp_catalonia_schedule (
  matchday INT NOT NULL,
  dateTimeUtc DATETIME(3) NOT NULL,
  isHome BOOLEAN NOT NULL,
  opponentName VARCHAR(150) NOT NULL,
  venueSlug VARCHAR(190) NOT NULL,
  PRIMARY KEY (matchday)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO rr_tmp_catalonia_schedule (
  matchday,
  dateTimeUtc,
  isHome,
  opponentName,
  venueSlug
) VALUES
  (1,  '2026-09-14 19:10:00.000', FALSE, 'Catalonia Warriors',    'sant-ignasi-sarria-pista-1'),
  (2,  '2026-09-21 21:00:00.000', TRUE,  'Bakugans FC',           'sant-ignasi-sarria-pista-4'),
  (3,  '2026-10-05 21:00:00.000', FALSE, 'Papagordas',            'sant-ignasi-sarria-pista-1'),
  (4,  '2026-10-19 20:05:00.000', TRUE,  'Pirris FC',             'sant-ignasi-sarria-pista-4'),
  (5,  '2026-10-26 19:15:00.000', FALSE, 'Dammchester United',    'sant-ignasi-sarria-pista-3'),
  (6,  '2026-11-03 21:05:00.000', TRUE,  'Corbs',                 'sant-ignasi-sarria-pista-4'),
  (7,  '2026-11-09 20:10:00.000', FALSE, 'Els Campions',          'sant-ignasi-sarria-pista-1'),
  (8,  '2026-11-16 21:05:00.000', TRUE,  'La Famiglia',           'sant-ignasi-sarria-pista-2'),
  (9,  '2026-11-23 20:10:00.000', FALSE, 'Catalonia Warriors',    'sant-ignasi-sarria-pista-2'),
  (10, '2026-12-01 19:15:00.000', TRUE,  'Bakugans FC',           'sant-ignasi-sarria-pista-4'),
  (11, '2026-12-21 21:05:00.000', FALSE, 'Papagordas',            'sant-ignasi-sarria-pista-3'),
  (12, '2027-01-11 22:00:00.000', TRUE,  'Pirris FC',             'sant-ignasi-sarria-pista-2'),
  (13, '2027-01-18 22:00:00.000', FALSE, 'Dammchester United',    'sant-ignasi-sarria-pista-4'),
  (14, '2027-01-25 20:10:00.000', TRUE,  'Corbs',                 'sant-ignasi-sarria-pista-1'),
  (15, '2027-02-01 22:00:00.000', FALSE, 'Els Campions',          'sant-ignasi-sarria-pista-2'),
  (16, '2027-02-08 20:10:00.000', TRUE,  'La Famiglia',           'sant-ignasi-sarria-pista-2');

INSERT INTO matches (
  seasonId,
  seasonTeamId,
  competitionId,
  matchday,
  dateTime,
  venueId,
  venue,
  isHome,
  opponentId,
  opponentName,
  status,
  publicVisible,
  createdAt,
  updatedAt
)
SELECT
  @season_id,
  @season_team_id,
  @competition_id,
  schedule.matchday,
  schedule.dateTimeUtc,
  venue.id,
  venue.name,
  schedule.isHome,
  opponent.id,
  opponent.name,
  'SCHEDULED',
  TRUE,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
FROM rr_tmp_catalonia_schedule AS schedule
INNER JOIN opponents AS opponent
  ON opponent.competitionId = @competition_id
 AND opponent.name = schedule.opponentName
 AND opponent.active = TRUE
 AND opponent.deletedAt IS NULL
INNER JOIN venues AS venue
  ON venue.competitionId = @competition_id
 AND venue.slug = schedule.venueSlug
 AND venue.active = TRUE
 AND venue.deletedAt IS NULL
WHERE @season_id IS NOT NULL
  AND @season_team_id IS NOT NULL
  AND @competition_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM matches existing_match
    WHERE existing_match.seasonTeamId = @season_team_id
      AND existing_match.competitionId = @competition_id
      AND existing_match.matchday = schedule.matchday
      AND existing_match.deletedAt IS NULL
  );

SET @matches_inserted := ROW_COUNT();

COMMIT;

SELECT
  @competition_id AS competitionId,
  @season_id AS seasonId,
  @season_team_id AS seasonTeamId,
  @matches_inserted AS partidosInsertados,
  (
    SELECT COUNT(*)
    FROM matches m
    WHERE m.seasonTeamId = @season_team_id
      AND m.competitionId = @competition_id
      AND m.matchday BETWEEN 1 AND 16
      AND m.deletedAt IS NULL
  ) AS jornadasEncontradas;

SELECT
  schedule.matchday AS jornadaNoImportada,
  schedule.opponentName AS rivalEsperado,
  schedule.venueSlug AS campoEsperado,
  CASE
    WHEN opponent.id IS NULL THEN 'Falta el rival activo en Catalonia Sports'
    WHEN venue.id IS NULL THEN 'Falta el campo activo en Catalonia Sports'
    ELSE 'Revisar temporada/equipo o jornada ya existente'
  END AS motivo
FROM rr_tmp_catalonia_schedule AS schedule
LEFT JOIN opponents AS opponent
  ON opponent.competitionId = @competition_id
 AND opponent.name = schedule.opponentName
 AND opponent.active = TRUE
 AND opponent.deletedAt IS NULL
LEFT JOIN venues AS venue
  ON venue.competitionId = @competition_id
 AND venue.slug = schedule.venueSlug
 AND venue.active = TRUE
 AND venue.deletedAt IS NULL
LEFT JOIN matches AS imported_match
  ON imported_match.seasonTeamId = @season_team_id
 AND imported_match.competitionId = @competition_id
 AND imported_match.matchday = schedule.matchday
 AND imported_match.deletedAt IS NULL
WHERE imported_match.id IS NULL
ORDER BY schedule.matchday;

DROP TEMPORARY TABLE IF EXISTS rr_tmp_catalonia_schedule;
