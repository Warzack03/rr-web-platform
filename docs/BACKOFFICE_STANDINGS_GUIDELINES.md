# BACKOFFICE_STANDINGS_GUIDELINES.md

## Objetivo

Recoger el comportamiento final acordado para `Clasificaciones` en el
backoffice antes de conectar datos reales.

Este documento debe servir despues para implementar:

- modelo de datos
- selector de tabla activa
- permisos por rol
- validaciones
- persistencia y edicion manual

## Principio de producto

En `Clasificaciones` no queremos una pantalla de filtros generales que mezcle
muchos criterios al mismo tiempo.

La prioridad es que quede clarisimo que tabla se esta editando en cada momento.

## Regla principal

La seleccion de clasificacion se hace por un unico criterio activo cada vez:

- por equipo
- o por competicion

Nunca por ambos a la vez en el flujo principal.

## Motivo

Esto evita discrepancias y reduce ambiguedad.

Ejemplo:

- si el usuario elige `Cadete A`, debe ver la clasificacion asociada a ese
  equipo
- si el usuario elige `Liga Cadete Municipal`, debe ver la clasificacion
  asociada a esa competicion

No queremos que una combinacion de filtros deje dudas sobre que tabla toca
editar realmente.

## Casuistica especial: dos equipos nuestros en una misma competicion

Puede darse el caso de que dos equipos del club compartan competicion, por
ejemplo `Senior A` y `Senior C`, y compartan tambien la misma tabla real.

En ese caso:

- no debe haber dos clasificaciones separadas
- debe existir una sola tabla de competicion
- esa tabla debe poder contener varias filas de equipos del club

Esto rompe la simplificacion actual de una unica fila `equipo propio`.

## Consecuencia para el modelo

No debemos asumir que una tabla tendra siempre un solo equipo nuestro marcado.

La implementacion real debera permitir:

- una tabla unica compartida por varios equipos del club
- varias filas marcadas como equipos del club dentro de la misma clasificacion

## Comportamiento esperado de la UI

### Selector principal

La pantalla debe mostrar dos vias de entrada:

- `Equipo`
- `Competicion`

Solo una manda cada vez.

Cuando el usuario interactua con una de ellas:

- esa pasa a ser la seleccion activa
- la otra deja de ser el criterio principal
- la tabla mostrada debe actualizarse con esa decision

### Si el criterio devuelve varias tablas

Si en el futuro una misma seleccion devuelve mas de una tabla valida, la UI debe
pedir una segunda eleccion explicita antes de editar.

Ejemplo:

- varias temporadas para un mismo equipo
- varias tablas historicas para una misma competicion

En ese caso, el selector secundario debe servir solo para desempatar, no para
mezclar criterios.

### Marcado de equipos del club

- La estrella o marcador visual de `equipo del club` no debe ser exclusiva.
- Debe permitir varias selecciones dentro de una misma tabla real.
- Esto cubre competiciones donde aparezcan, por ejemplo, `Senior A` y `Senior C`
  en la misma clasificacion.
- La unica validacion minima es que exista al menos un equipo del club marcado
  antes de guardar.

### Acciones de cabecera

- No mostrar acciones como `Guardar de nuevo`, `Duplicar` o `Restaurar` cuando
  no forman parte del flujo real de producto.
- El guardado solo debe aparecer cuando existan cambios sin guardar.
- No queremos botones de soporte mock ocupando la cabecera principal del modulo.

### Creacion desde cero

- Si una competicion todavia no tiene clasificacion creada, la tabla debe poder
  nacer a partir de los equipos dados de alta en esa competicion.
- No deberia obligar a construir todas las filas manualmente desde un lienzo
  vacio.
- Si dos equipos del club comparten la misma tabla real, ambos deben entrar en
  esa tabla inicial.
- Despues de ese scaffold inicial, la clasificacion sigue siendo manualmente
  editable.

## Regla de puntos y sanciones

- Los puntos no deben depender solo de `G` y `E`.
- La liga puede aplicar retirada de puntos por sancion.
- Cada fila debe tener una columna editable adicional llamada `PTS SA`.
- `PTS SA` representa cuantos puntos se restan al equipo.
- El calculo final debe ser:
  `Pts = G * 3 + E - PTS SA`
- La tabla debe ordenarse usando el resultado final ya sancionado.

## Criterios descartados

Para el flujo principal actual quedan fuera como filtros prioritarios:

- busqueda libre
- mezcla simultanea de equipo + competicion
- combinaciones abiertas de varios filtros que compliquen saber que tabla esta
  activa

La temporada puede volver en el futuro si realmente hace falta como capa
explicita de seleccion, no como filtro difuso.

## Roles

### Superadmin / Manager

- Pueden elegir la tabla por equipo o por competicion.
- Pueden editar cualquier clasificacion de su alcance.

### Entrenador

- Solo trabaja con sus equipos asignados.
- El flujo debe mantenerse aun mas simple.
- Si el equipo ya viene acotado por contexto, no hace falta mostrar controles
  redundantes.

## Implicaciones para datos futuros

Cada clasificacion debe seguir estando asociada como minimo a:

- equipo propio
- temporada
- competicion

Si a futuro hay mas de una tabla posible dentro del mismo equipo o competicion,
la UI necesitara una capa de seleccion adicional clara, no mas filtros cruzados.

## Estado actual mock

En mocks, la pantalla ya queda orientada a:

- elegir tabla por equipo o por competicion
- usar un solo criterio principal a la vez
- mostrar un selector secundario solo si hay varias tablas posibles
- editar despues la clasificacion activa resultante
- editar `PTS SA` y recalcular puntos automaticamente
