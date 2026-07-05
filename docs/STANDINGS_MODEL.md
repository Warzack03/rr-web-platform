# STANDINGS_MODEL.md

## Principios

- Las clasificaciones se editan manualmente en MVP.
- No se calculan automaticamente a partir de resultados, porque no se registran todos los partidos de todos los rivales.
- Cada clasificacion esta asociada como minimo a temporada + competicion/grupo y
  puede incluir uno o varios equipos del club marcados dentro de la misma tabla.
- La clasificacion del Primer Equipo se puede destacar en home.
- En backoffice, la tabla activa debe elegirse por equipo o por competicion, no por mezcla de ambos criterios a la vez.
- Una misma competicion puede corresponder a una sola tabla con varios equipos del club dentro si comparten clasificacion real.

## Campos por fila

- position.
- teamName.
- played.
- won.
- drawn.
- lost.
- sanctionPoints.
- goalsFor.
- goalsAgainst.
- goalDifference.
- points.

## Regla de puntos

- Los puntos se calculan como `ganados * 3 + empatados - sanctionPoints`.
- `sanctionPoints` representa sanciones o retirada de puntos impuesta por la liga.
- En UI admin, la columna debe llamarse `PTS SA`.

## Permisos

- `superadmin` y `manager`: pueden editar cualquier clasificacion.
- `entrenador`: solo puede editar clasificacion de sus equipos asignados.

## Multi-equipo en misma competicion

- Si dos equipos del club comparten la misma tabla real, no deben existir dos clasificaciones separadas.
- El modelo debe permitir varias filas del club dentro de una sola clasificacion.
- La UI no debe limitarse a una unica fila marcada como equipo del club.
- El marcador visual de equipo del club debe permitir varias selecciones.

## Automatizacion futura

La unica automatizacion prevista a futuro es importar/consultar datos desde fuentes externas oficiales o semioficiales si existe una via estable.

MVP sigue siendo manual.
