# PROMPTS.md

Use these prompts one at a time. Keep each Codex session focused.

## Core rule

Do not ask Codex to build the whole app in one prompt. Use phases and commit after each successful phase.

## Rebuild frontend over existing technical base

```text
Quiero rehacer la capa visual/frontend de la app desde cero, pero manteniendo la base tecnica ya creada.

Contexto:
- El proyecto ya tiene Prisma, MySQL, migraciones y modelo de base de datos.
- No quiero perder prisma/schema.prisma ni prisma/migrations.
- No quiero perder configuracion de auth si ya funciona.
- No quiero perder AGENTS.md ni docs/.
- El frontend generado anteriormente no me gusta, asi que quiero rehacerlo de forma ordenada.

Archivos de referencia visual:
- stitch_rising_raimon_football_hub.zip
- stitch_rising_raimon_football_hub(1).zip

Objetivo:
Rehacer el frontend tomando esos ZIPs como referencia visual y funcional, pero implementandolo correctamente en Next.js/React/TypeScript.

Reglas:
- No modificar prisma/schema.prisma salvo que sea imprescindible.
- No eliminar prisma/migrations.
- No cambiar el modelo de datos sin pedirlo.
- No romper la autenticacion existente.
- No implementar ecommerce.
- No conectar con WordPress.
- No usar rr-management como backend vivo.
- No pegar HTML estatico gigante sin componentizar.
- No meter datos sensibles.
- No usar datos reales de jugadores.
- Usar datos demo o mocks donde todavia no haya backend implementado.
- Mantener separacion entre web publica y backoffice.
- Respetar AGENTS.md y docs/.

Antes de modificar codigo:
1. Revisa la estructura actual del proyecto.
2. Recomienda limpieza selectiva o reconstruccion del frontend.
3. Lista exactamente que archivos eliminarias/reemplazarias y por que.
4. No borres nada hasta que se confirme el plan.
```

## Approve Phase 1 - visual foundation

```text
Adelante con la reconstruccion del frontend, pero solo Fase 1.

Condiciones:
1. No elimines el arbol app/ antiguo hasta haber creado src/app, migrado las rutas necesarias y comprobado que el build funciona.
2. Migra la ruta de NextAuth a src/app/api/auth/[...nextauth]/route.ts sin cambiar la logica de auth existente.
3. No toques prisma/, migrations/, schema.prisma, docs/, AGENTS.md ni el modelo de datos.
4. No cambies server/auth/*, server/db/*, server/services/* ni server/validators/* salvo imports necesarios.
5. Implementa solo la base visual:
   - estructura src/app y src/components
   - tokens globales
   - layout publico
   - layout admin
   - navegacion publica
   - navegacion admin
   - home publica con mocks
   - dashboard admin con mocks
   - login admin conservando auth
6. No implementes CRUDs, detalle de equipos, noticias, partidos, estadisticas ni importaciones.
7. Si necesitas borrar archivos, hazlo solo despues de confirmar que sus equivalentes nuevos existen.
8. Ejecuta npm run lint, npm run build y npx prisma validate.
9. Resume que se elimino, que se movio, que se creo y que queda pendiente.
```

## Phase 2 - public home

```text
Implementa la Fase 2: home publica de Rising Raimon usando como referencia la pantalla home_rising_raimon de los ZIPs Stitch y siguiendo AGENTS.md, docs/PUBLIC_PAGE_SPECS.md, docs/UI_PUBLIC_SITE.md, docs/DESIGN_TOKENS.md y docs/CODE_CONVENTIONS.md.

Debe incluir:
- presentacion general del club
- proximo partido del Primer Equipo
- ultimos resultados
- clasificacion/resumen del Primer Equipo
- noticias recientes
- acceso al Primer Equipo
- acceso al listado de equipos
- enlace a tienda externa tienda.risingraimon.es

Usa datos demo o servicios existentes si ya estan disponibles.
No implementes detalle de equipo ni CRUDs.
Ejecuta lint/build/prisma validate y resume cambios.
```

## Phase 3 - First Team detail

```text
Implementa la Fase 3: pagina publica del Primer Equipo usando como referencia los ZIPs Stitch y siguiendo docs/TEAM_DETAIL_PAGE.md, docs/STATS_MODEL.md, docs/MATCH_MODEL.md, docs/STANDINGS_MODEL.md y docs/IMAGE_AND_CARDS_POLICY.md.

Debe cubrir:
- informacion general
- entrenadores visibles
- proximo partido
- ultimos resultados
- clasificacion manual
- plantilla
- cromos premium subidos como imagen
- estadisticas avanzadas
- videos asociados a partidos jugados
- noticias relacionadas

No implementes todavia detalle estandar de equipos.
Ejecuta lint/build/prisma validate y resume cambios.
```

## Phase 4 - standard teams

```text
Implementa la Fase 4: listado de equipos y detalle publico de equipo estandar usando como referencia los ZIPs Stitch y siguiendo docs/TEAM_DETAIL_PAGE.md.

Debe cubrir:
- /equipos
- /equipos/[teamSlug]
- nombre, categoria, temporada, competicion
- entrenadores visibles
- proximo partido
- ultimos resultados
- clasificacion manual
- plantilla
- cromos generados por la web
- estadisticas basicas
- noticias relacionadas si existen

No conviertas el detalle estandar en una copia del Primer Equipo; debe ser mas simple.
Ejecuta lint/build/prisma validate y resume cambios.
```

## Phase 5 - admin shell

```text
Implementa la Fase 5: shell visual del backoffice usando como referencia login_backoffice, dashboard_backoffice, dashboard_manager, dashboard_entrenador y gestion_de_equipos de los ZIPs Stitch.

Debe cubrir:
- login visual conservando auth
- layout admin
- sidebar/nav
- dashboard segun rol con mocks
- cards/resumenes
- estructura preparada para secciones admin
- estados vacio/carga/error

No implementes CRUDs nuevos todavia si no existen.
No rompas auth.
Ejecuta lint/build/prisma validate y resume cambios.
```

## Prisma schema

```text
Implementa o ajusta el schema Prisma inicial siguiendo docs/DATABASE_FINAL_MODEL.md, docs/PRISMA_SCHEMA_DRAFT.md y docs/DATABASE_IMPLEMENTATION_NOTES.md.
No implementes UI.
No anadas ecommerce, finanzas ni campos privados de rr-management.
Ejecuta npx prisma validate, prisma format y build/lint si aplica.
```

## Prisma 7 MySQL adapter fix

```text
Estamos usando Prisma 7+ con MySQL y @prisma/adapter-mariadb.
Corrige el proyecto para que PrismaClient se construya con adapter en seed y cliente global.

Reglas:
- Mantener DATABASE_URL para Prisma CLI/migraciones.
- Usar DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT para runtime si el adapter lo requiere.
- No pasar connectionString a PrismaMariaDb.
- Usar host, port, user, password, database, connectionLimit.
- Mantener singleton global en desarrollo.
- No cambiar schema ni migraciones.

Ejecuta npx prisma generate, npx prisma validate, npx prisma db seed, npm run lint y npm run build.
```

## Auth

```text
Implementa autenticacion admin y proteccion por rol siguiendo AGENTS.md, docs/PERMISSIONS_MATRIX.md, docs/ROLES_PERMISSIONS.md y docs/CODE_CONVENTIONS.md.
Alcance: login, logout, proteccion de /admin, seed superadmin inicial, layout base admin.
No implementes CRUDs.
Ejecuta lint/build/prisma validate.
```

## Seasons CRUD

```text
Implementa solo CRUD de temporadas siguiendo docs/ADMIN_PAGE_SPECS.md y docs/DATABASE_FINAL_MODEL.md.
Solo puede haber una temporada activa.
No implementes equipos todavia.
Ejecuta lint/build/prisma validate.
```

## Teams CRUD

```text
Implementa CRUD de equipos siguiendo docs/ADMIN_PAGE_SPECS.md, docs/PERMISSIONS_MATRIX.md y docs/TEAM_DETAIL_PAGE.md.
Solo superadmin y manager pueden crear/editar equipos.
No implementes jugadores todavia.
Ejecuta lint/build/prisma validate.
```

## Players and assignments

```text
Implementa jugadores y asignaciones jugador/equipo/temporada siguiendo docs/ADMIN_PAGE_SPECS.md, docs/FIELD_POLICIES.md y docs/DATABASE_FINAL_MODEL.md.
No guardes datos sensibles.
No muevas estadisticas historicas si cambia una asignacion.
Ejecuta lint/build/prisma validate.
```

## Matches

```text
Implementa partidos siguiendo docs/MATCH_MODEL.md y docs/ADMIN_PAGE_SPECS.md.
Rival como texto, logo opcional, estados scheduled/live/played/postponed, video externo para partido jugado del Primer Equipo.
Ejecuta lint/build/prisma validate.
```

## Standings

```text
Implementa clasificaciones manuales siguiendo docs/STANDINGS_MODEL.md.
No las calcules desde partidos.
Entrenador solo puede editar las de sus equipos asignados.
Ejecuta lint/build/prisma validate.
```

## Stats

```text
Implementa estadisticas por partido siguiendo docs/STATS_MODEL.md.
Las stats permanecen asociadas a jugador/equipo/temporada/partido donde se crearon.
Goal participation = goals + assists.
Ejecuta lint/build/prisma validate.
```

## News MVP

```text
Implementa noticias MVP siguiendo docs/CONTENT_MODEL.md y docs/NEWS_AND_VIDEO.md.
Soporta draft/published, portada, links de video externos y equipos relacionados.
Solo superadmin/manager gestionan noticias.
Ejecuta lint/build/prisma validate.
```

## rr-management import preview

```text
Implementa validacion y preview de importacion CSV/ZIP desde rr-management siguiendo docs/IMPORT_FORMAT.md y docs/IMPORT_RR_MANAGEMENT.md.
Solo superadmin.
No apliques cambios todavia.
No importes datos sensibles.
Ejecuta lint/build/prisma validate.
```

## rr-management import apply

```text
Implementa apply de importacion merge/upsert siguiendo docs/IMPORT_FORMAT.md y docs/IMPORT_RR_MANAGEMENT.md.
No borrado destructivo.
Preserva campos web-owned, stats historicas y asignaciones manuales excepcionales.
Guarda ImportBatch e ImportBatchItem.
Ejecuta lint/build/prisma validate.
```
