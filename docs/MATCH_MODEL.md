# MATCH_MODEL.md

## Estados

- `scheduled`: pendiente de jugar.
- `live`: en vivo / jugando.
- `played`: jugado.
- `postponed`: aplazado o pendiente de nueva fecha.

## Reglas

- Los partidos se introducen manualmente en MVP.
- `live` debe existir principalmente para el Primer Equipo, por si se enlaza a directo en el futuro.
- Un partido `played` debe poder tener resultado.
- Un partido `postponed` puede no tener nueva fecha.
- No implementar minuto a minuto en MVP.
- No hay torneos reflejados en la web durante MVP.

## Campos recomendados

- id.
- seasonId.
- teamId.
- competitionId opcional.
- matchday opcional.
- date.
- time.
- venue.
- isHome.
- opponentName.
- homeTeamName.
- awayTeamName.
- homeScore.
- awayScore.
- status.
- videoUrl opcional.
- liveUrl opcional.
- notes opcional.

## Video asociado

En el detalle del Primer Equipo, cuando un partido este `played`, debe poder mostrarse un video asociado si `videoUrl` existe.

El video puede ser un link externo, por ejemplo YouTube, Instagram, Twitch u otra fuente.
