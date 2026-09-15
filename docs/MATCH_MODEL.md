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
- venueId, seleccionado del catalogo de la competicion.
- venue.
- isHome.
- opponentId, seleccionado del catalogo de la competicion.
- opponentName.
- homeTeamName.
- awayTeamName.
- homeScore.
- awayScore.
- status.
- videoUrl opcional.
- liveUrl opcional.
- notes opcional.

## Catalogo de rivales

- Cada rival pertenece a una competicion y puede tener un escudo de la biblioteca de media.
- El mismo rival se reutiliza en partidos, calendario, detalle y clasificacion.
- `opponentName` se conserva en cada partido como copia historica y compatibilidad con datos anteriores.
- Un rival inactivo sigue visible en el historico, pero no se puede seleccionar para partidos nuevos.

## Catalogo de campos

- Cada campo o pista pertenece a una competicion.
- El formulario de partido solo muestra campos activos de la competicion del equipo.
- `venue` se conserva como copia historica para que los partidos anteriores no dependan de futuros cambios de nombre.

## Video asociado

En el detalle del Primer Equipo, cuando un partido este `played`, debe poder mostrarse un video asociado si `videoUrl` existe.

El video puede ser un link externo, por ejemplo YouTube, Instagram, Twitch u otra fuente.
