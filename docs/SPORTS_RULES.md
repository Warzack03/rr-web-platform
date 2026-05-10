# SPORTS_RULES.md

## Principios

La plataforma deportiva publica se gestiona de forma manual inicialmente. No se debe depender de APIs externas de liga municipal, RFFM u otras fuentes para el MVP.

A futuro se podra estudiar integracion con fuentes externas, pero no forma parte del alcance inicial.

## Competiciones

- Cada equipo estara en una sola competicion a la vez.
- No se reflejaran torneos en la web durante el MVP.
- No se necesita contemplar multiples competiciones simultaneas por equipo en la primera version.

## Partidos

### Estados

Estados iniciales:

- `scheduled`: pendiente de jugar.
- `live`: en vivo / jugando. Principalmente para Primer Equipo.
- `played`: jugado.
- `postponed`: aplazado o pendiente de nueva fecha.

Notas:

- Si un partido se aplaza, queda marcado como pendiente/aplazado.
- El estado `live` debe existir para permitir futura integracion con directos o marcador en vivo del Primer Equipo.
- No implementar logica compleja de directo en el MVP; solo estado y visualizacion.

## Resultados

- Los resultados se introducen manualmente.
- De momento solo se siguen en detalle los resultados del equipo propio.
- No se requiere mantener resultados completos de todos los equipos rivales de la liga.

## Clasificaciones

- Las clasificaciones se editan manualmente.
- No se calculan automaticamente desde todos los resultados de la liga, porque no se registran todos los partidos de rivales.
- Cada equipo puede tener su tabla de clasificacion asociada a temporada/competicion.

Campos recomendados de clasificacion:

- posicion
- nombre equipo
- partidos jugados
- ganados
- empatados
- perdidos
- goles a favor
- goles en contra
- diferencia de goles
- puntos

## Jugadores en varios equipos

Regla general:

- Un jugador no deberia estar en varios equipos en la misma temporada.

Excepcion:

- Puede haber alguna excepcion puntual.
- El modelo debe permitir que un jugador este asignado a mas de un equipo en la misma temporada, pero la UI debe tratarlo como caso poco frecuente.

## Estadisticas del Primer Equipo

El Primer Equipo tiene estadisticas mas detalladas.

### Jugadores de campo

- partidos jugados
- goles
- asistencias
- recuperaciones
- tiros
- tiros a puerta
- tarjetas amarillas
- tarjetas rojas
- goles en propia

### Porteros

- partidos jugados
- goles
- asistencias
- paradas
- goles encajados
- porterias a cero / imbatidos
- tarjetas amarillas
- tarjetas rojas
- tiros a puerta recibidos o asociados segun criterio interno

### Metricicas derivadas

A partir de las stats se podran mostrar metricas derivadas:

- participaciones de gol = goles + asistencias
- participaciones de gol = goles + asistencias
- goles por partido
- asistencias por partido
- participaciones de gol por partido
- participaciones de gol por partido
- tiros por partido
- tiros a puerta por partido
- porcentaje de tiros a puerta
- paradas por partido
- goles encajados por partido
- porterias a cero

Estas metricas deben calcularse en codigo a partir de datos base, no guardarse necesariamente en base de datos salvo que haya una razon clara.

## Estadisticas del resto de equipos

Mas simples que las del Primer Equipo.

### Jugadores de campo

- partidos jugados
- goles
- asistencias

### Porteros

- partidos jugados
- goles
- asistencias
- goles encajados
- imbatidos / porterias a cero

## Posiciones

Debe existir al menos distincion entre:

- portero
- jugador de campo

Opcionalmente se pueden permitir posiciones mas detalladas:

- portero
- defensa
- centrocampista
- delantero

## Criterio de MVP

Implementar primero:

1. Partidos manuales.
2. Resultados manuales.
3. Clasificaciones manuales.
4. Stats basicas por equipo.
5. Stats ampliadas para Primer Equipo.

No implementar en MVP:

- calculo automatico completo de clasificacion desde todos los partidos de liga.
- integracion con RFFM/Municipal.
- torneos.
- minuto a minuto.


## Datos externos investigados

- Liga Municipal / Juegos Deportivos Municipales: existe un dataset publico de competiciones deportivas municipales de deportes colectivos con partidos y clasificaciones de temporada vigente. Puede ser una buena via futura de importacion asistida, pero no debe ser dependencia del MVP.
- RFFM: hay paginas publicas de resultados/jornadas y clasificaciones con filtros por temporada, competicion, grupo y jornada. No se ha confirmado API publica documentada. Cualquier automatizacion RFFM queda como investigacion futura.
- MadridCompite/JDM Madrid/MuniMad pueden servir como referencia funcional o fuente indirecta, pero no como dependencia tecnica MVP.

Regla: no consultar fuentes externas en runtime publico. Si se integra algo, debe ser mediante importador/job admin con preview/diff y datos guardados en nuestra base.
