# BACKOFFICE_TEAMS_GUIDELINES.md

## Objetivo

Definir como debe comportarse `Equipos` en backoffice antes de conectar logica
real.

Este documento recoge las decisiones UX y de producto ya aplicadas en mocks para
que la futura implementacion mantenga el mismo criterio.

## Principios

- La pantalla de equipos debe sentirse operativa, no editorial.
- Los entrenadores visibles del equipo son datos informativos del equipo.
- Un entrenador visible no implica una cuenta de acceso al backoffice.
- La informacion deportiva importante debe tener prioridad sobre campos
  tecnicos redundantes.
- La vista de `entrenador` dentro de `Mi equipo` es de consulta, no de gestion
  estructural.

## Vista principal de equipos

### Cabecera y metricas

- No mostrar una card especial de `Primer Equipo` en la franja superior.
- Mantener una fila de metricas mas compacta:
  - total de equipos
  - visibles en web
  - activos
  - cantera
- En la vista del coach, mostrar solo metricas de contexto utiles para su
  equipo.

### Tabla/lista

La lista de equipos debe priorizar estas piezas:

- nombre del equipo
- competicion
- estado publico
- estado interno
- entrenadores visibles
- numero de jugadores
- acciones

No debe mostrarse como dato principal:

- el slug debajo del nombre
- bloques redundantes de `Primer Equipo`
- informacion duplicada entre varias columnas

### Columnas y contenido esperados

- `Equipo`: solo nombre limpio del equipo.
- `Contexto deportivo`: mostrar la competicion/liga en la que juega.
- `Entrenador`: mostrar nombre o nombres visibles del cuerpo tecnico.
- `Jugadores`: numero total de jugadores asociados al equipo.
- `Estado`: combinar de forma clara visibilidad publica y estado activo.

## Acciones de la lista

- Las acciones de fila deben ir con iconos, mismo tamano y misma altura visual.
- Deben quedar alineadas en una sola linea.
- Acciones esperadas:
  - editar equipo
  - editar entrenadores
  - activar/desactivar equipo
  - mostrar/ocultar en web

No usar botones largos con texto si el icono ya comunica bien la accion.

## Vista de coach en `Mi equipo`

- Debe leerse como una vista de consulta de contexto.
- No mostrar filtros globales ni lenguaje de gestion estructural.
- No sugerir que el coach puede cambiar identidad, visibilidad o estructura del
  equipo desde aqui.
- Los CTA deben mandar a modulos operativos como partidos, clasificacion o
  estadisticas.

## Formulario de equipo

El dialogo debe dividirse en bloques claros:

- `Identidad`
- `Contexto deportivo`
- `Estado publico`
- `Entrenadores`

### Copy y densidad

- El formulario debe evitar textos de ayuda largos si no desbloquean una
  decision real.
- Bajo el titulo principal no hace falta un parrafo explicativo persistente.
- El bloque de entrenadores no necesita textos introductorios si los campos ya
  son autoexplicativos.
- El pie del formulario no necesita mensajes tipo `guardado local de prueba`.

### Orden

- El campo `Orden` debe sugerirse automaticamente a partir de los equipos ya
  existentes.
- Si el equipo se marca como `Primer Equipo`, debe ocupar la posicion 1.
- Si se crea un nuevo equipo dentro de una familia ya existente, debe colocarse
  detras de los equipos de esa misma familia deportiva siempre que sea posible.
- El orden sigue siendo editable, pero no debe empezar vacio ni con un numero
  arbitrario que el usuario tenga que adivinar.

### Contexto deportivo

- `Rama` no se edita manualmente en el formulario.
- Si el equipo es `Primer Equipo`, su bloque es `Primer equipo`.
- Si no lo es, su bloque es `Cantera`.
- `Competicion` debe resolverse desde un catalogo/select de competiciones ya
  dadas de alta, no como texto libre.

### Entrenadores

- Un equipo puede tener varios entrenadores visibles.
- Se guardan como nombres y roles informativos del equipo.
- No hay selector de cuenta vinculada.
- No hay `usuario responsable`.
- No hay relacion obligatoria entre entrenador visible y usuario del sistema.

Campos esperados por entrenador:

- nombre visible
- rol visible
- visible en web

## Implicaciones para la logica futura

- `TeamCoach` o entidad equivalente debe tratarse como informacion publica del
  equipo/temporada, no como permiso.
- Los permisos de un posible usuario con rol `entrenador` deben resolverse por
  asignacion de alcance a equipo, no por el listado de entrenadores visibles del
  equipo.
- La UI no debe intentar inferir usuarios internos desde el bloque de
  entrenadores visibles.
- El orden de lista y los contadores deben poder salir de datos reales sin
  depender de mock copy.

## Decisiones cerradas

- Los entrenadores del equipo ya no se modelan en UI como cuentas vinculadas.
- La tarjeta superior dedicada al `Primer Equipo` se elimina de esta pantalla.
- La tabla de equipos gana peso informativo en competicion, entrenadores y
  jugadores.
