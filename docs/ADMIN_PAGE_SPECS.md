# ADMIN_PAGE_SPECS.md

## Principios

- El admin debe ser practico, no necesariamente tan visual como la web publica.
- Validar permisos en servidor siempre.
- Ocultar acciones no permitidas por rol.
- Usar formularios claros, tablas con filtros y acciones rapidas.

## Dashboard `/admin`

Mostrar:

- temporada activa.
- equipos visibles.
- proximos partidos.
- ultimos resultados pendientes de completar.
- noticias borrador.
- avisos de importacion si aplica.

## Equipos `/admin/equipos`

Solo `superadmin` y `manager` pueden crear equipos.

Campos gestionables:

- nombre.
- slug.
- categoria.
- competicion.
- temporada.
- es Primer Equipo.
- visible publico.
- activo.
- entrenador asignado.
- banner/logo.
- orden visual.

Acciones:

- crear equipo.
- editar equipo.
- activar/desactivar.
- asignar entrenador.
- configurar visibilidad.

El entrenador no puede crear equipos ni asignar permisos.

## Usuarios y permisos `/admin/usuarios`

Solo `superadmin` y `manager` pueden asignar entrenadores a equipos.

Acciones:

- crear usuario interno.
- asignar rol.
- asignar entrenador a equipo/temporada.
- retirar permisos.

`superadmin` es el unico que puede gestionar otros superadmins o configuracion sensible.

## Partidos `/admin/partidos`

Permisos:

- `superadmin` y `manager`: gestion completa.
- `entrenador`: solo partidos de sus equipos asignados.

El entrenador puede:

- actualizar proximo partido de su equipo.
- introducir/editar resultado de partido.
- cambiar estado permitido: scheduled, live, played, postponed.
- asociar video al partido cuando este `played`, si se permite en su rol.

No puede:

- crear competiciones globales.
- editar partidos de otros equipos.

## Clasificaciones `/admin/clasificaciones`

Las clasificaciones son manuales.

Permisos:

- `superadmin` y `manager`: gestion completa.
- `entrenador`: editar clasificacion de sus equipos asignados.

Campos por fila:

- posicion.
- nombre equipo.
- PJ.
- G.
- E.
- P.
- GF.
- GC.
- DG.
- Pts.

## Estadisticas `/admin/estadisticas`

Permisos:

- `superadmin` y `manager`: gestion completa.
- `entrenador`: editar goles/asistencias y estadisticas permitidas de sus equipos asignados.

Regla MVP para entrenador:

- Puede actualizar goles y asistencias.
- Puede actualizar resultado de partidos.
- Puede actualizar proximo partido.
- Puede actualizar clasificacion de su equipo.
- No puede tocar jugadores/equipos fuera de sus permisos.

## Noticias `/admin/noticias`

MVP incluye noticias nuevas en la plataforma.

Permisos recomendados:

- `superadmin` y `manager`: crear, editar, publicar.
- `entrenador`: no crear noticias salvo que se habilite explicitamente en el futuro.

Campos:

- titulo.
- slug.
- extracto.
- cuerpo.
- portada.
- links de video.
- equipo relacionado opcional.
- estado: draft/published.

## Importaciones `/admin/importaciones`

Solo `superadmin` y opcionalmente `manager` si se decide.

Nunca debe haber importacion destructiva sin preview.

Flujo:

1. subir CSV/ZIP.
2. validar.
3. mostrar diff.
4. confirmar.
5. aplicar merge/upsert.
6. registrar batch.
