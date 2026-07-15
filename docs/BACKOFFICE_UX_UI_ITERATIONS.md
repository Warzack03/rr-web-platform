# BACKOFFICE_UX_UI_ITERATIONS.md

## Objetivo

Convertir el backoffice actual en una herramienta mas operativa, clara y rapida de usar, tomando como referencia el codigo implementado y no los wireframes historicos.

Este documento sirve para:

- aplicar mejoras por iteraciones pequenas
- marcar que cambios ya estan hechos
- evitar mezclar demasiadas decisiones en una sola tanda
- retomar el trabajo despues diciendole a Codex `siguiente`

## Regla de trabajo

Cuando digas `siguiente`, la siguiente iteracion a abordar sera:

1. la primera iteracion no completada
2. dentro de esa iteracion, el primer bloque no completado

## Como usar este documento

- Marca cada tarea aplicada con `[x]`
- Deja pendientes con `[ ]`
- Si una tarea cambia de alcance, anadela en `Notas de iteracion`
- No pasar a la siguiente iteracion hasta cumplir el bloque `Criterio de cierre`

## Decisiones cerradas para esta fase

- La referencia principal es el codigo actual
- La experiencia movil debe ser impecable
- `entrenador` normalmente llevara un equipo, pero puede llevar varios
- El guardado deseado en modulos deportivos es manual
- Los estados editoriales complejos deben quedarse solo en `Noticias`
- El foco actual esta en lo ya implementado, no en ampliar modulos nuevos

## Punto de partida actual

Base revisada en el codigo:

- shell y layout admin: `src/components/admin/admin-shell.tsx`
- topbar y navegacion: `src/components/admin/admin-topbar.tsx`, `src/components/admin/admin-sidebar.tsx`, `src/components/admin/admin-mobile-nav.tsx`
- dashboard: `src/components/admin/admin-dashboard.tsx`
- equipos: `src/components/admin/admin-teams-workspace.tsx`
- partidos: `src/components/admin/admin-matches-workspace.tsx`
- clasificaciones: `src/components/admin/admin-standings-workspace.tsx`
- estadisticas: `src/components/admin/admin-stats-workspace.tsx`
- base visual global: `src/app/globals.css`

## Estado general

- Iteracion actual: `1`
- Ultima revision UX/UI: `2026-06-10`
- Estado global: `[ ] En curso`

---

## Iteracion 1 - Shell, jerarquia y navegacion

### Objetivo

Reducir peso visual innecesario y mejorar el contexto operativo global del panel antes de tocar flujos internos.

### Impacto

- Todos los roles
- Desktop y movil
- Base para el resto de iteraciones

### Checklist

#### 1.1 Jerarquia de cabecera

- [x] Reducir altura visual del header global
- [x] Hacer que el nombre de la pagina pese mas que el nombre del usuario
- [x] Mostrar mejor el contexto activo: modulo, equipo, temporada, rol
- [x] Reducir texto explicativo largo en cabeceras

#### 1.2 Navegacion lateral y movil

- [x] Simplificar la navegacion de `entrenador`
- [x] Reordenar items por logica operativa y no solo por estructura tecnica
- [x] Mejorar el menu movil para que el equipo activo quede visible arriba
- [x] Si el entrenador tiene un solo equipo, no mostrar selector innecesario
- [x] Si tiene varios, usar un switch compacto y persistente

#### 1.3 Lenguaje visual base

- [x] Reducir exceso de titulares display grandes en admin
- [x] Compactar paddings verticales en shells, headers y panels
- [x] Bajar el dramatismo de sombras y bloques cuando afecte al escaneo
- [x] Mantener identidad Rising Raimon sin perjudicar velocidad de uso

### Criterio de cierre

- [x] El panel se siente mas utilitario y menos promocional
- [x] El usuario entiende mejor donde esta y que puede hacer
- [x] La navegacion movil se usa con menos pasos y menos ruido

### Notas de iteracion

- Aplicado en shell, topbar, sidebar, mobile nav, page header y panel base.
- La navegacion de `entrenador` se ha reducido a `Mi jornada`, `Partidos`, `Clasificacion`, `Estadisticas` y `Mi equipo`.
- Se ha creado un selector compacto reutilizable para coach con persistencia en URL y modo sin selector cuando solo hay un equipo.

---

## Iteracion 2 - Flujo movil del entrenador en Partidos

### Objetivo

Hacer de `Partidos` el centro operativo real del entrenador, con prioridad movil y una accion principal clara por estado.

### Impacto

- Rol `entrenador`
- `src/components/admin/admin-matches-workspace.tsx`
- `src/components/admin/match-list.tsx`
- `src/components/admin/match-form-dialog.tsx`
- `src/components/admin/quick-result-dialog.tsx`

### Checklist

#### 2.1 Orden de pantalla

- [x] Colocar arriba el contexto de equipo y partido mas urgente
- [x] Subir la accion principal antes que las metricas
- [x] Relegar metricas secundarias a una zona menos dominante
- [x] Asegurar que el flujo principal se resuelve bien con una mano en movil

#### 2.2 Lista de partidos

- [x] Dejar una sola CTA principal por card segun estado
- [x] Pasar acciones secundarias a una capa menos ruidosa
- [x] Hacer mas evidente que partido requiere accion inmediata
- [x] Mejorar jerarquia entre `previa`, `resultado` y `ver publico`

#### 2.3 Formularios y dialogos

- [x] Simplificar el formulario de partido para coach
- [x] Priorizar campos de uso real en movil
- [x] Mejorar el dialogo de resultado rapido para cierre de jornada
- [x] Reducir texto de ayuda que no desbloquee accion

### Criterio de cierre

- [x] Un entrenador puede actualizar previa o resultado sin perderse
- [x] El mejor siguiente paso es evidente en cada partido
- [x] La experiencia movil de cierre de jornada queda limpia

### Notas de iteracion

- Se ha anadido un bloque superior de `Siguiente paso` para coach con el partido mas urgente y CTA principal directa.
- En movil, cada card de partido del coach muestra una sola accion primaria visible y relega el resto a `Mas acciones`.
- El formulario de partido para coach se ha compactado y deja fuera controles mas editoriales o secundarios.
- El dialogo de resultado rapido ahora es mas directo y mas legible para cierre desde movil.

---

## Iteracion 3 - Flujo movil del entrenador en Estadisticas

### Objetivo

Convertir `Estadisticas` en una pantalla de captura rapida y lineal, no en una pantalla de lectura con demasiado contexto decorativo.

### Impacto

- Rol `entrenador`
- `src/components/admin/admin-stats-workspace.tsx`

### Checklist

#### 3.1 Contexto y seleccion

- [x] Dejar claro arriba el equipo activo
- [x] Simplificar la seleccion de partido
- [x] Quitar elementos que compitan con la carga de datos
- [x] Mostrar contexto minimo necesario antes de editar

#### 3.2 Captura de stats

- [x] Priorizar goles, asistencias y datos mas usados
- [x] Hacer mas clara la relacion entre partido, resultado y estadisticas
- [x] Optimizar la lista de jugadores para scroll y edicion rapida
- [x] Mejorar la accion de guardado manual y su confirmacion

#### 3.3 Flujo de salida

- [x] Dejar claro cuando hay cambios sin guardar
- [x] Confirmar guardado sin que desaparezca demasiado rapido
- [x] Facilitar volver a `Partidos` o `Clasificacion` sin friccion

### Criterio de cierre

- [x] La pantalla se comporta como una herramienta de carga
- [x] El entrenador puede completar la jornada con pocos pasos
- [x] Guardar y salir resulta claro

### Notas de iteracion

- Se ha anadido un bloque superior de `Siguiente paso` para coach con partido activo, estado y CTA de guardado.
- La seleccion de partido ahora muestra mas contexto dentro del selector y la pantalla reduce copy decorativa.
- Se ha introducido estado de cambios sin guardar, ultimo guardado y una barra inferior de salida con `Volver a partidos` y `Guardar estadisticas`.
- En la captura por jugador se han priorizado `Goles`, `Asist.` y `MVP` al principio de la rejilla.

---

## Iteracion 4 - Simplificacion de Clasificaciones

### Objetivo

Eliminar complejidad editorial innecesaria en `Clasificaciones` y dejar un flujo deportivo manual, claro y seguro.

### Impacto

- `src/components/admin/admin-standings-workspace.tsx`
- `src/components/admin/standing-publish-actions.tsx`
- `src/components/admin/unsaved-changes-bar.tsx`
- `src/components/admin/standings-filters.tsx`
- `src/components/admin/editable-standing-table.tsx`
- `src/components/admin/standing-mobile-card.tsx`

### Checklist

#### 4.1 Modelo mental

- [x] Sustituir estados editoriales complejos por acciones simples
- [x] Dejar el modulo en `Guardar cambios`, `Cancelar`, `Ver publica`
- [x] Alinear mensajes con el guardado manual decidido

#### 4.2 Filtros y acciones

- [x] Eliminar filtros basados en estado editorial si dejan de existir
- [x] Reordenar acciones para que guardar sea la principal
- [x] Reducir ruido visual en el panel lateral o acciones de publicacion

#### 4.3 Edicion desktop y movil

- [x] Hacer la tabla desktop mas clara y mas segura
- [x] Simplificar la card movil para editar filas con menos carga mental
- [x] Hacer mas visibles errores por fila o por tabla
- [x] Mantener visible que equipo es el propio

### Criterio de cierre

- [x] La clasificacion se entiende como modulo deportivo, no editorial
- [x] Un usuario sabe cuando ha guardado y que impacto tiene
- [x] Movil y desktop mantienen un flujo coherente

### Notas de iteracion

- Se ha eliminado el filtro por estado editorial y el panel lateral ahora prioriza `Guardar cambios`, `Cancelar cambios` y `Ver clasificacion publica`.
- Los estados siguen existiendo en mock por compatibilidad tecnica, pero en UX se han reinterpretado como guardado simple: `Sin guardar`, `Guardada` y `Revisar`.
- La tabla desktop muestra mejor los errores y la card movil reduce carga mental, manteniendo muy visible el equipo propio.

---

## Iteracion 5 - Dashboard por rol

### Objetivo

Transformar el dashboard actual en una bandeja de trabajo accionable.

### Impacto

- `src/components/admin/admin-dashboard.tsx`

### Checklist

#### 5.1 Dashboard entrenador

- [x] Convertir el dashboard en `Mi jornada` o equivalente
- [x] Priorizar proximo partido, ultimo resultado pendiente y atajos reales
- [x] Reducir cards informativas que no accionan nada

#### 5.2 Dashboard manager y superadmin

- [x] Mostrar incidencias accionables antes que metricas frias
- [x] Destacar noticias en borrador, partidos sin resultado e importaciones con conflicto
- [x] Mantener resumen operativo sin sobrecargar

#### 5.3 Coherencia de rol

- [x] Hacer que cada rol vea un panel claramente adaptado a su trabajo real
- [x] Evitar que el coach sienta que esta en un panel corporativo o global

### Criterio de cierre

- [x] El dashboard ayuda a empezar a trabajar, no solo a mirar
- [x] La primera accion del usuario aparece sola

### Notas de iteracion

- El dashboard de `entrenador` pasa a leerse como `Mi jornada`, con un bloque principal de siguiente paso, atajos reales y agenda inmediata del equipo.
- `manager` y `superadmin` ven primero una bandeja de incidencias accionables y despues los atajos del rol, dejando las metricas en segundo plano.
- Se han mantenido los datos mock existentes, pero reordenados para que el panel ayude a arrancar trabajo y no solo a consultar estado.

---

## Iteracion 6 - Equipos y formularios

### Objetivo

Pulir `Equipos` para que sea mas claro para manager/superadmin y menos ambiguo para coach.

### Impacto

- `src/components/admin/admin-teams-workspace.tsx`
- `src/components/admin/team-list.tsx`
- `src/components/admin/team-form-dialog.tsx`
- `src/components/admin/team-filters.tsx`

### Checklist

#### 6.1 Vista de lista

- [x] Reforzar visualmente `Visible`, `Oculto`, `Activo`, `Inactivo`
- [x] Reordenar columnas o bloques segun relevancia operativa
- [x] Reducir numero de acciones simultaneas visibles
- [x] En movil, dejar una accion principal mas menu secundario

#### 6.2 Coach en Equipos

- [x] Aclarar que el coach no gestiona estructura global
- [x] Si se mantiene la seccion, que se sienta como consulta de contexto
- [x] Evitar cualquier ambiguedad de permisos

#### 6.3 Formulario de equipo

- [x] Separar mejor identidad, competicion, visibilidad y entrenadores
- [x] Reducir copy innecesaria dentro del dialogo
- [x] Mejorar priorizacion de campos

### Criterio de cierre

- [x] La pantalla comunica mejor el estado publico de cada equipo
- [x] El coach no interpreta que puede editar cosas que no debe

### Notas de iteracion

- La lista de equipos ahora prioriza contexto deportivo, estado publico y entrenadores antes que columnas mas tecnicas.
- En movil y desktop se ha reducido el ruido de acciones: `Editar equipo` queda como accion principal y el resto baja de intensidad visual.
- La vista del coach pasa a sentirse de consulta y apoyo operativo, con metricas propias y sin filtros ni lenguaje de gestion global.
- El formulario queda dividido en bloques de `Identidad`, `Contexto deportivo`, `Estado publico` y `Entrenadores`.
- Se elimina la card superior dedicada a `Primer Equipo` para compactar la pantalla.
- Los entrenadores dejan de modelarse en UI como cuentas vinculadas y pasan a ser datos informativos del equipo.

---

## Iteracion 7 - Limpieza de placeholders y coherencia del producto

### Objetivo

Evitar que el producto muestre rutas o secciones que todavia no estan maduras de cara a UX.

### Impacto

- `src/components/admin/admin-section-overview.tsx`
- navegacion y rutas placeholder

### Checklist

#### 7.1 Navegacion y confianza

- [x] Revisar que modulos deben seguir visibles
- [x] Ocultar o marcar claramente los modulos no operativos
- [x] Evitar que el usuario entre en pantallas que parecen acabadas y no lo estan

#### 7.2 Coherencia del panel

- [x] Unificar tono de estados vacios, errores y placeholders
- [x] Asegurar que el backoffice no promete mas de lo que hoy hace

### Criterio de cierre

- [x] El panel transmite madurez y foco
- [x] Las rutas visibles tienen un nivel de acabado coherente

### Notas de iteracion

- La navegacion de manager y superadmin ahora separa modulos operativos de modulos `Preview`, tanto en desktop como en movil.
- Las rutas que usan `AdminSectionOverview` dejan claro que son vistas previas de alcance y ya no se presentan como modulos cerrados.
- Cada overview sugiere volver a una ruta operativa para mantener foco y reducir falsas expectativas.

---

## Bloque final de control

### Antes de cerrar una iteracion

- [ ] Los cambios respetan permisos por rol
- [ ] La experiencia movil se ha revisado especificamente
- [ ] No se ha introducido complejidad editorial en modulos deportivos
- [ ] La UI usa menos texto y mas jerarquia visual util
- [ ] El siguiente paso para el usuario es mas obvio que antes

### Registro de avances

#### Iteracion 1

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-10`
- Notas: build validada tras cambios de shell, jerarquia, navegacion y selector persistente de equipo para coach.

#### Iteracion 2

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-11`
- Notas: build validada; fue necesario limpiar `.next` por un artefacto corrupto generado por Next antes de revalidar.

#### Iteracion 3

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-11`
- Notas: build validada tras simplificar el flujo de captura y reforzar el guardado manual.

#### Iteracion 4

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-11`
- Notas: build validada tras simplificar `Clasificaciones` a un flujo manual y mas deportivo, sin filtro editorial y con mejor feedback de errores.

#### Iteracion 5

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-11`
- Notas: build validada tras rehacer el dashboard por rol con prioridad para `Mi jornada`, incidencias accionables y accesos directos utiles.

#### Iteracion 6

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-12`
- Notas: build validada tras simplificar `Equipos`, clarificar permisos del coach y reorganizar el formulario por bloques de decision.

#### Iteracion 7

- Estado: `[x] Completada`
- Fecha cierre: `2026-06-12`
- Notas: build validada tras marcar modulos preview en navegacion y redisenar las rutas overview para que no aparenten estar terminadas.

---

## Instruccion para retomar con Codex

Cuando quieras seguir, puedes decir simplemente:

```text
siguiente
```

Y el trabajo continuara desde:

- la primera iteracion pendiente
- el primer bloque sin marcar dentro de esa iteracion
