# STANDINGS_MODEL.md

## Principios

- Las clasificaciones se editan manualmente en MVP.
- No se calculan automaticamente a partir de resultados, porque no se registran todos los partidos de todos los rivales.
- Cada clasificacion esta asociada a equipo propio + temporada + competicion/grupo si aplica.
- La clasificacion del Primer Equipo se puede destacar en home.

## Campos por fila

- position.
- teamName.
- played.
- won.
- drawn.
- lost.
- goalsFor.
- goalsAgainst.
- goalDifference.
- points.

## Permisos

- `superadmin` y `manager`: pueden editar cualquier clasificacion.
- `entrenador`: solo puede editar clasificacion de sus equipos asignados.

## Automatizacion futura

La unica automatizacion prevista a futuro es importar/consultar datos desde fuentes externas oficiales o semioficiales si existe una via estable.

MVP sigue siendo manual.
