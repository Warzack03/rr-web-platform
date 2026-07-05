# BACKOFFICE_STATS_GUIDELINES.md

## Objetivo

Dejar por escrito como debe funcionar `Estadisticas` en el backoffice para que
la logica real se conecte luego sin rehacer el enfoque del modulo.

## Regla principal

La pantalla de `Estadisticas` trabaja con dos capas al mismo tiempo:

- `partido activo`: donde se carga quien ha jugado y que ha hecho
- `acumulado de temporada`: que se ve siempre en la misma pantalla

El partido no debe entenderse como un filtro de consulta de totales, sino como
el contexto de carga de datos.

## Modelo de trabajo

- Las estadisticas siguen siendo `por partido`.
- El acumulado de temporada se deriva de esos partidos.
- `PJ` no se edita a mano en la pantalla principal.
- `PJ` se calcula contando en cuantos partidos aparece el jugador como
  participante.

## Participacion por partido

Cada jugador necesita, como minimo, una marca binaria para el partido activo:

- `ha jugado`
- `no ha jugado`

Consecuencias:

- si `ha jugado`, ese partido suma `PJ`
- si `no ha jugado`, ese partido no suma `PJ`
- si se desmarca, las stats de ese partido deben quedar a `0`

## Jugadores puntuales / refuerzos

Debe existir una forma de anadir a un partido jugadores que no pertenecen al
roster habitual de ese equipo.

Casos tipicos:

- un jugador del `Senior C` juega puntualmente con el `Senior A`
- un juvenil sube de forma esporadica
- un portero de otro equipo cubre una baja puntual

Reglas:

- se anaden al `partido activo`
- pasan a tener stats dentro del contexto de ese equipo para esa temporada
- su acumulado visible en esta pantalla corresponde a ese equipo, no a su equipo
  habitual
- no deben obligar a cambiar el roster principal del equipo

## Que se edita en la pantalla

### Parte editable

La parte editable corresponde al `partido activo`:

- goles
- asistencias
- MVP
- tarjetas
- goles en propia
- y las stats avanzadas que apliquen segun equipo/jugador

### Parte visible no editable

Cada card o fila debe mantener visible:

- acumulado de temporada del jugador
- `PJ` acumulados
- metricas derivadas / promedios

## Filtros y selectores

- Mantener selector de `Equipo` cuando el rol pueda cambiar de equipo.
- Mantener selector de `Partido activo`.
- No usar `jornada` como filtro independiente dentro de esta pantalla.
- En ese selector solo deben aparecer partidos con estado `jugado`.

La jornada ya esta implicita en el partido seleccionado.

## Visibilidad de campos

- No mostrar `Ver mas estadisticas` ni `Ocultar estadisticas`.
- Todas las stats disponibles para ese perfil deben verse de primeras.
- Cada stat debe llevar un icono reconocible, alineado con la parte publica.

## Metricas derivadas en admin

Tiene sentido mostrarlas tambien en backoffice, pero como lectura secundaria,
nunca como dato editable.

Ejemplos:

- goles por partido
- asistencias por partido
- participaciones por partido
- paradas por partido
- porcentaje de porterias a 0
- precision de tiro

Su funcion principal es ayudar a detectar rapido si el acumulado "cuadra" o no.

## UX esperada

Arriba:

- equipo activo
- partido activo
- contexto del partido

En cada jugador:

- identidad del jugador
- `PJ` acumulados
- control `ha jugado / no ha jugado`
- metricas derivadas
- stats editables del partido activo

## Regla de coherencia

La pantalla no debe obligar al usuario a elegir entre:

- ver el acumulado
- o cargar el partido

Debe permitir ambas cosas a la vez.

## Estado actual mock

El mock actual queda orientado a:

- elegir un `partido activo`
- marcar si cada jugador ha jugado o no
- cargar stats de ese partido
- recalcular el acumulado de temporada en la misma pantalla
- mostrar metricas derivadas visibles desde el inicio
