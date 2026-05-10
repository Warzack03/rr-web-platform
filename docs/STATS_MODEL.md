# STATS_MODEL.md

## Principios

- Las estadisticas pertenecen al contexto donde se crearon: jugador + equipo + temporada + partido cuando sea posible.
- Si un jugador cambia de equipo, no se mueven estadisticas historicas.
- Los agregados de temporada deben calcularse desde datos base cuando sea razonable.
- Las metricas derivadas se calculan en codigo, no se almacenan salvo que haya razon clara.

## Primer Equipo - jugadores de campo

Campos base:

- matchesPlayed.
- goals.
- assists.
- recoveries.
- shots.
- shotsOnTarget.
- yellowCards.
- redCards.
- ownGoals.

Metricas derivadas:

- goalParticipations = goals + assists.
- goalsPerMatch.
- assistsPerMatch.
- goalParticipationsPerMatch.
- shotsPerMatch.
- shotsOnTargetPerMatch.
- shotsOnTargetRate.

## Primer Equipo - porteros

Campos base:

- matchesPlayed.
- goals.
- assists.
- saves.
- goalsAgainst.
- cleanSheets.
- yellowCards.
- redCards.
- shotsOnTargetAgainst.

Metricas derivadas:

- goalParticipations = goals + assists.
- goalsAgainstPerMatch.
- savesPerMatch.
- cleanSheetRate.

## Resto de equipos - jugadores de campo

Campos base:

- matchesPlayed.
- goals.
- assists.

Metricas derivadas:

- goalParticipations = goals + assists.
- goalsPerMatch.
- assistsPerMatch.
- goalParticipationsPerMatch.

## Resto de equipos - porteros

Campos base:

- matchesPlayed.
- goals.
- assists.
- goalsAgainst.
- cleanSheets.

Metricas derivadas:

- goalParticipations = goals + assists.
- goalsAgainstPerMatch.
- cleanSheetRate.

## Permisos de entrenador sobre estadisticas

El entrenador solo puede editar estadisticas de sus equipos asignados.

En MVP, como minimo puede actualizar:

- goles.
- asistencias.
- resultado de partidos.
- proximo partido.
- clasificacion.

Si se implementan campos avanzados del Primer Equipo, restringirlos a usuarios con permiso sobre el Primer Equipo.
