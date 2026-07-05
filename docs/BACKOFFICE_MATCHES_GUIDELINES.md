# BACKOFFICE_MATCHES_GUIDELINES.md

## Objetivo

Dejar por escrito el estado final acordado para la pestaña `Partidos` del
backoffice antes de conectar logica real, base de datos y permisos definitivos.

Este documento es la referencia principal para implementar despues:

- modelo de datos
- CRUD real
- validaciones
- permisos por rol
- integracion futura con clasificaciones y estadisticas

## Referencia funcional

La referencia de uso es SportPress en el sentido operativo, no visual ni
tecnico.

Lo que nos interesa conservar:

- agenda de partidos clara
- datos reutilizables y no escritos a mano cada vez
- flujo rapido para crear, editar y cerrar resultados
- estructura preparada para crecer despues

Lo que no queremos copiar:

- sensacion de WordPress generico
- exceso de controles editoriales
- formularios con campos ambiguos o redundantes

## Estado final decidido

### 1. Alta y edicion de partido

Campos esperados en el flujo actual:

- equipo
- temporada
- competicion
- jornada
- rival
- local/visitante
- fecha
- hora
- campo
- estado
- resultado cuando proceda
- highlights solo cuando proceda

### 2. Competicion

- Cada equipo juega una sola competicion activa en MVP.
- Al elegir equipo, la competicion se rellena automaticamente desde ese equipo.
- La competicion no se edita manualmente en el alta normal.
- Visualmente no debe parecer un `select` deshabilitado.
- Debe mostrarse como un campo de solo lectura, mas apagado, sin flecha y con
  apariencia de valor asignado automaticamente.

Implicacion para logica futura:

- la fuente de verdad de `competition` en creacion normal sera el equipo
- solo deberia existir override manual si en el futuro se abre expresamente esa
  capacidad

### 3. Jornada

- Al crear un partido, la jornada sugerida debe ser la ultima jornada existente
  del equipo + 1.
- La jornada sigue siendo editable.
- Mientras sigamos con mocks puede resolverse desde etiquetas tipo
  `Jornada N`.
- En la logica real conviene guardar tambien un `matchdayNumber` numerico.

### 4. Rival

- El rival ya no debe ser texto libre.
- Debe seleccionarse desde un catalogo de rivales dados de alta.
- El catalogo debe filtrarse por competicion cuando sea posible.
- Esto se hace pensando en consistencia futura, logos, clasificaciones y evitar
  duplicados por escritura manual.

Implicacion para datos futuros:

- conviene tener entidad `opponents` o `clubs`
- conviene relacionar rivales con competicion y, si hace falta, temporada/grupo

### 5. Campo

- El campo ya no debe ser texto libre en el flujo normal.
- Debe seleccionarse desde un catalogo de campos.
- Debe cubrir tanto campos propios como campos rivales frecuentes.
- El objetivo es reducir errores de escritura y reutilizar nombres oficiales.

### 6. Previa y ficha publica

- No mostrar checks separados como `Previa lista para publicar` o
  `Ficha publica disponible`.
- Al crear un partido, asumimos que la previa existe por defecto.
- Tambien asumimos que la pagina publica/detalle del partido existe por defecto.
- Si en el futuro hace falta ocultar algo de la web, eso debe resolverse con una
  decision explicita de visibilidad, no con dos checks ambiguos.

### 7. Highlights

- Los highlights siguen siendo un campo aparte.
- Solo aplican a partidos jugados del Primer Equipo.
- Deben funcionar como URL externa.
- En la lista de partidos del admin se mantienen como accion visible solo cuando
  ese contexto aplica.
- En cantera no deben condicionar el flujo normal de partido.

### 8. Estado jugado

- Un partido jugado no debe volver a `pendiente` desde una accion rapida de la
  lista.
- Si el resultado esta mal, la accion correcta es actualizar resultado o editar
  el partido.
- Esto evita incoherencias deportivas y simplifica la botonera.

### 9. Marcador pendiente

- Cuando un partido aun no esta jugado, el marcador administrativo debe mostrar
  `PDTE`.
- No usar `VS` en esta vista del backoffice.
- `PDTE` comunica mejor que el resultado esta pendiente de cargar.

## Listado de partidos

### 10. Paginacion

- El cuadro de partidos debe tener paginacion.
- Valor por defecto: `10` partidos por pagina.
- El usuario debe poder cambiar el tamano de pagina.
- El usuario debe poder cambiar de pagina desde selector y navegacion directa.
- Al cambiar filtros, equipo activo o tamano de pagina, volver a la primera
  pagina.

### 11. Densidad visual

- La tabla desktop debe priorizar la informacion del partido por encima de los
  controles.
- Los botones deben ocupar menos espacio horizontal.
- `Editar` y `Highlights` pueden mostrarse solo con icono si mantienen
  `aria-label` y `title`.
- El boton principal de resultado debe ser mas corto que antes.

### 12. Informacion que no debe repetirse

- En `Equipo` no mostrar el slug debajo.
- En `Resultado` no repetir la jornada debajo del marcador.
- No mantener una columna `Campo` separada si el campo ya aparece bajo la fecha.
- La tabla debe evitar cualquier duplicacion que no aporte contexto nuevo.

### 13. Estado actual de la tabla desktop

La tabla queda conceptualmente asi:

- `Fecha`: fecha/hora y debajo el campo
- `Equipo`: nombre del equipo
- `Rival`: nombre del rival y debajo local/visitante
- `Competicion / jornada`: competicion y debajo jornada
- `Estado`
- `Resultado`: marcador o `PDTE`
- `Acciones`

## Estado actual del formulario

El formulario queda conceptualmente asi:

- `Equipo`: editable segun rol y contexto
- `Temporada`: editable si procede
- `Competicion`: autocompletada y solo lectura visual
- `Jornada`: sugerida automaticamente pero editable
- `Rival`: select desde catalogo
- `Campo`: select desde catalogo
- `Estado`: controlado por selector de estado
- `Resultado`: solo cuando el partido esta jugado
- `Highlights`: solo para jugado de Primer Equipo

## Roles y comportamiento esperado

### Manager / Superadmin

- Pueden crear y editar todos los partidos del alcance disponible.
- Ven la tabla completa con paginacion.
- Pueden gestionar highlights cuando el partido y equipo lo permiten.

### Entrenador

- Trabaja solo con sus equipos asignados.
- Mantiene flujo simplificado.
- No necesita controles editoriales extra.
- La referencia principal sigue siendo resolver previa, resultado,
  clasificacion y estadisticas con el menor roce posible.

## Recomendaciones para la futura logica real

### Modelo de datos

Conviene contemplar:

- `competitions`
- `opponents` o `clubs`
- `venues`
- `matches.matchdayNumber`
- posibles claves externas por temporada/competicion/grupo

### Persistencia

Conviene que `matches` guarde tambien snapshots utiles:

- `opponentName`
- `venue`
- `competitionLabel` si hace falta
- `matchdayLabel` si hace falta

Esto ayuda a preservar el contexto historico aunque cambien los catalogos.

### Validaciones

Reglas recomendadas:

- no permitir crear partido sin equipo
- no permitir rival vacio
- no permitir campo vacio
- exigir marcador valido si estado es `played`
- restringir highlights a `played` + Primer Equipo
- no ofrecer transicion rapida de `played` a `pending`

## Resumen del estado mock actual

Ahora mismo, en mocks, ya queda implementado lo siguiente:

- competicion automatica por equipo
- competicion mostrada como lectura, no como select deshabilitado
- jornada sugerida por ultima jornada + 1
- rival desde catalogo
- campo desde catalogo
- sin checks de previa/ficha publica
- sin accion para devolver un jugado a pendiente
- `Highlights` solo donde aplica
- paginacion con 10 por pagina por defecto
- tabla compactada para dejar mas espacio a la informacion
- `PDTE` para partidos aun no jugados

## Uso de este documento

Cuando retomemos la implementacion real de `Partidos`, este archivo debe leerse
antes de tocar:

- Prisma
- seeds
- acciones server
- validadores Zod
- permisos
- tablas y formularios del admin
