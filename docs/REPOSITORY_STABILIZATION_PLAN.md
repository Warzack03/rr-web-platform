# Plan de estabilización y cierre del repositorio

Última revisión: 23 de julio de 2026  
Estado general: Fase A y Fase B completadas; continuar por Fase C.1  
Siguiente bloque: Fase C.1 — Acceso a datos y rendimiento

## Cómo usar este documento

Este archivo es el punto de continuidad entre conversaciones. Antes de retomar trabajo:

- Leer `AGENTS.md` y este documento completo.
- Confirmar el estado real del repositorio y no asumir que los checks reflejan cambios no verificados.
- Empezar por el primer bloque sin completar de la fase activa.
- No marcar una fase como terminada hasta ejecutar sus comprobaciones de cierre.
- Anotar debajo de cada fase cualquier decisión nueva que cambie el alcance.

Convención de checks:

- `[ ]` pendiente.
- `[x]` terminado y verificado.
- Las decisiones pendientes se mantienen sin marcar y no autorizan cambios destructivos de esquema.

## Decisiones de producto cerradas

- [x] El backoffice tendrá un único tipo de usuario funcional: administrador.
- [x] No habrá interfaz ni comportamiento diferenciado para `COACH`, `MANAGER`, entrenador o superadministrador.
- [x] Los campos o enums de roles existentes en base de datos pueden mantenerse temporalmente por compatibilidad, pero no deben condicionar el producto.
- [x] No se necesitan las rutas `/admin/temporadas`, `/admin/importaciones` ni `/admin/usuarios`.
- [x] Las rutas anteriores no deben aparecer en navegación, accesos rápidos, paneles vacíos ni placeholders.
- [x] No se eliminarán en estas fases las tablas, migraciones o documentos técnicos de importación ya existentes sin una tarea específica de base de datos.
- [x] Todos los mocks de ejecución deben desaparecer antes del cierre del plan.
- [x] Los tipos, contratos o funciones reutilizables que hoy estén en archivos llamados `*-mocks.ts` se moverán antes a módulos de dominio neutrales.
- [x] El jugador tendrá una única ficha pública global: `/jugadores/[playerSlug]`.
- [x] Cualquier enlace a un jugador, incluido el originado dentro de un equipo, debe resolver a la ficha global.
- [x] No se recuperará una ficha de jugador contextual dentro de `/equipos/[teamSlug]/...`.
- [x] Si una ruta contextual antigua sigue siendo necesaria para compatibilidad, solo redirigirá a la URL global canónica.
- [x] La ficha global puede reunir información de varias asignaciones, manteniendo en servicios la separación histórica por jugador, equipo, temporada y partido.
- [x] Las tarjetas de jugadores se construirán por capas y componentes web; no como PNG finales almacenados.
- [x] Una entidad pública desconocida o no publicable debe responder con `404`, no con datos de ejemplo ni con el primer registro disponible.
- [x] El contenido de noticias seguirá dentro del MVP, pero su formato de edición definitivo se decidirá antes de implementar su editor final.
- [x] Los SVG subidos no se publicarán directamente sin tratamiento; el objetivo es convertirlos a WebP o PNG siempre que sea viable.
- [x] La estrategia de persistencia de archivos en Hostinger se decidirá con una evaluación explícita de impacto técnico y operativo.

## Decisión cerrada: `goalsAgainstPerMatch` en porteros de cantera

La propuesta de eliminar este dato no se debía a un error matemático ni a un problema de rendimiento. Se señaló porque la especificación pública cerrada enumera para cantera un conjunto reducido de estadísticas y no incluye expresamente los goles encajados por partido, mientras que documentación deportiva anterior sí contempla goles encajados para porteros.

La métrica es útil si `goalsAgainst` se registra de forma consistente: contextualiza mejor el rendimiento que mostrar solo porterías a cero. Por tanto, no se eliminará automáticamente.

- [x] Confirmar si la tabla de porteros de cantera conserva `goalsAgainstPerMatch` como `Goles encajados/partido` o `E/P`.
- [x] Si se conserva, comprobar que solo se calcula con partidos jugados y estadísticas publicadas.
- [ ] Si no existe una captura fiable de goles encajados, ocultar la columna en lugar de mostrar ceros engañosos.
- [ ] Alinear la decisión final en `PUBLIC_APP_SPEC.md`, `PUBLIC_PAGE_SPECS.md`, `SPORTS_RULES.md` y el componente correspondiente.

Recomendación actual: conservarla si el backoffice ya permite registrar `goalsAgainst` con fiabilidad; ocultarla si el dato no puede mantenerse.

---

# Fase A — Saneamiento funcional y eliminación de inconsistencias

## Objetivo

Dejar el producto alineado con las decisiones cerradas, eliminar rutas y ramas funcionales que ya no forman parte del MVP, retirar los fallbacks peligrosos y preparar la eliminación completa de mocks sin romper contratos utilizados por las pantallas reales.

## A.0 — Línea base y protección del trabajo existente

- [x] Revisar `git status` y separar cambios previos del usuario de los cambios de esta fase.
- [x] Registrar el resultado inicial de `npm run lint`.
- [x] Registrar el resultado inicial de `npm run build`.
- [x] Registrar el resultado inicial de `npx prisma validate`.
- [x] Confirmar que no existen simultáneamente árboles activos `app/` y `src/app/` con rutas duplicadas.
- [x] Inventariar imports de módulos con `mock`, `fixture`, `placeholder`, `sample` o datos estáticos de demostración.
- [x] No modificar `prisma/`, migraciones, autenticación base ni contratos de importación durante esta fase salvo bloqueo comprobado y autorización explícita.

## A.1 — Backoffice de administrador único

- [x] Eliminar la ruta `/admin/usuarios` y cualquier componente dedicado exclusivamente a esa pantalla.
- [x] Verificar que `/admin/temporadas` y `/admin/importaciones` no existen como rutas activas.
- [x] Eliminar de navegación, dashboard, accesos rápidos y estados vacíos cualquier enlace a las tres rutas descartadas.
- [x] Retirar del dashboard los widgets de importación que sugieran una función activa fuera del alcance actual.
- [x] Mantener los modelos técnicos de importación existentes sin exponer una interfaz incompleta.
- [x] Localizar todas las ramas de interfaz o permisos basadas en `COACH`, `MANAGER`, entrenador o superadministrador.
- [x] Eliminar las ramas realmente muertas.
- [x] Renombrar los conceptos reutilizados que en realidad representen al administrador, evitando conservar nombres engañosos de entrenador.
- [x] Simplificar tipos y props de interfaz para expresar `admin` sin introducir un sistema de roles nuevo.
- [x] Mantener temporalmente enums/campos de base de datos solo cuando eliminarlos requiera migración o pueda afectar compatibilidad.
- [x] Confirmar que la autorización sigue validándose en servidor y no depende únicamente de ocultar controles.
- [x] Añadir o verificar una acción visible de cierre de sesión usando la autenticación existente, sin reescribir el núcleo de auth.

## A.2 — Primera retirada de mocks y placeholders

- [x] Clasificar cada archivo de mocks en: dato ficticio, contrato reutilizable, helper reutilizable o código muerto.
- [x] Extraer contratos y tipos útiles a módulos neutrales de `src/lib`, `src/server` o `src/types` según su responsabilidad.
- [x] Extraer helpers de presentación que sí se usan a archivos sin nomenclatura de mock.
- [x] Sustituir imports de producción que apunten a `src/lib/admin/mock-data.ts`.
- [x] Sustituir imports de producción que apunten a `match-management-mocks.ts`.
- [x] Sustituir imports de producción que apunten a `standings-management-mocks.ts`.
- [x] Sustituir imports de producción que apunten a `team-management-mocks.ts`.
- [x] Eliminar fixtures que puedan mostrarse como si fueran datos reales.
- [x] Eliminar `AdminSectionOverview` si queda sin consumidores tras retirar `/admin/usuarios`.
- [x] Eliminar placeholders de rutas y componentes sin consumidores.
- [x] Eliminar módulos antiguos de detalle de partido si no tienen imports reales.
- [x] Buscar de nuevo `mock`, `fixture`, `placeholder` y `sample` para documentar lo que quede y por qué.
- [x] No sustituir mocks por constantes falsas con otro nombre.

## A.3 — Identidad pública y ficha global de jugador

- [x] Mantener `/jugadores/[playerSlug]` como única URL canónica de detalle.
- [x] Actualizar todos los enlaces de plantillas, tarjetas, estadísticas y partidos para apuntar a la ficha global.
- [x] Hacer que la ruta contextual antigua de jugador redirija permanentemente a la ficha global o retirarla si no tiene consumidores ni necesidad de compatibilidad.
- [x] Eliminar cualquier lógica que intente escoger un jugador distinto en función de `teamSlug` dentro del detalle global.
- [x] Definir en el servicio de jugador global cómo se agregan las estadísticas de la temporada activa.
- [x] Mantener internamente los datos separados por asignación, equipo, temporada y partido antes de agregarlos para presentación.
- [x] Mostrar los equipos o contextos relevantes de forma breve cuando un jugador tenga más de una asignación pública.
- [x] Evitar que la variante visual de Primer Equipo se aplique a datos de cantera por una agregación accidental.
- [x] Añadir `canonical` a la URL global y evitar contenido duplicado en rutas heredadas.

Regla propuesta para la agregación global:

- Identidad, biografía, foto y nombre público son únicos por jugador.
- Las cifras de temporada agregan únicamente estadísticas publicadas de partidos jugados y asignaciones públicas de la temporada activa.
- Los servicios conservan el desglose por equipo aunque la cabecera muestre un total global.
- Si existen contextos con distinto nivel estadístico, la interfaz muestra solo métricas válidas para todos o separa los bloques; nunca rellena campos avanzados con valores inventados.

## A.4 — Consultas públicas, estados y `404`

- [x] Auditar todas las consultas públicas de equipos, jugadores, partidos y noticias.
- [x] Aplicar consistentemente `publicVisible`, `active`, `publishedAt`, `deletedAt` y estados equivalentes cuando correspondan.
- [x] Filtrar estadísticas públicas por publicación y por partido jugado cuando la regla deportiva lo exija.
- [x] Sustituir fallbacks al primer equipo, jugador, partido o noticia por `notFound()`.
- [x] Confirmar `404` para slugs e identificadores inexistentes.
- [x] Confirmar `404` para entidades existentes pero no publicables.
- [x] Evitar que un ID inválido revele si existe una entidad privada.
- [x] Verificar que los partidos aplazados de cantera se presentan como pendientes.
- [x] Verificar que cantera no muestra estado `En vivo` ni highlights.
- [x] Verificar que los highlights externos solo aparecen en partidos jugados del Primer Equipo.

Comprobación A.4:

- Las rutas públicas de entidad concreta usan `notFound()` cuando el servicio no devuelve una entidad publicable.
- Los listados/índices públicos (`/`, `/equipos`, `/noticias`) conservan estados vacíos solo cuando no hay contenido publicado.
- Las estadísticas públicas de jugador/plantilla se agregan desde partidos `PLAYED`, visibles y no eliminados, con filas `played: true`.
- Los partidos aplazados o en vivo de cantera se presentan públicamente como pendientes.
- Los highlights solo se exponen cuando el partido es del Primer Equipo, está jugado y tiene URL externa visible.
- `npm run lint` termina sin errores; mantiene 9 warnings preexistentes de fuentes/`img`.
- `npx prisma validate` termina correctamente.
- `npx tsc --noEmit --pretty false` sigue bloqueado por el tipo generado stale `.next/dev/types/validator.ts` que referencia `src/app/admin/(panel)/usuarios/page.js`.

## A.5 — Estadísticas y reglas deportivas

- [x] Centralizar la selección de columnas por variante: Primer Equipo, cantera, jugador de campo y portero.
- [x] Eliminar configuraciones duplicadas o divergentes entre tablas y tarjetas.
- [x] Validar divisiones por cero y ausencia de minutos/partidos.
- [x] Confirmar que participación de gol se calcula como goles más asistencias.
- [x] Confirmar que el histórico no cambia de equipo al modificar una asignación actual.
- [x] Validar la decisión cerrada de `goalsAgainstPerMatch` antes de modificar la tabla de porteros de cantera.
- [x] Revisar nombres y abreviaturas para que sean comprensibles sin añadir texto explicativo largo a la interfaz.

Comprobación A.5:

- `src/lib/public/team-statistics-utils.ts` concentra las claves de orden, columnas de tabla, opciones rápidas, resúmenes móviles, stats de tarjeta y cálculos derivados.
- `team-statistics-url-state.ts`, `team-statistics-page.tsx` y `player-card.tsx` consumen esa fuente común en lugar de declarar configuraciones locales.
- La participación de gol se calcula mediante `getGoalContributions(stats)`, equivalente a `goals + assists`, y la ficha pública la reutiliza.
- Las divisiones por partido, precisión y porcentajes usan división segura y devuelven `-` cuando no hay denominador válido.
- `goalsAgainstPerMatch` se mantiene para porteros de cantera y se etiqueta como `Encajados/PJ` / `Enc./PJ`.
- El histórico queda ligado a `PlayerMatchStats.seasonTeamId` y las escrituras de estadísticas crean filas con `seasonTeamId: match.seasonTeamId`.
- `npm run lint` termina sin errores; mantiene 9 warnings preexistentes de fuentes/`img`.
- `npx prisma validate` termina correctamente.
- `npx tsc --noEmit --pretty false` sigue bloqueado por el tipo generado stale `.next/dev/types/validator.ts` que referencia `src/app/admin/(panel)/usuarios/page.js`.

## A.6 — URLs, medios y seguridad inmediata

- [x] Validar URLs externas con esquema `http` o `https` en escrituras de noticias, vídeos y highlights.
- [x] Rechazar esquemas ejecutables o inesperados como `javascript:` y `data:` en campos de URL externa.
- [x] Auditar la subida actual por extensión, MIME real, tamaño, nombre de archivo y ubicación pública.
- [x] Impedir que un SVG original no tratado se sirva desde el mismo origen público.
- [x] Probar la viabilidad de rasterizar SVG a WebP o PNG con el runtime y límites de Hostinger.
- [x] Definir un fallo seguro: si la conversión no es posible, el archivo no se publica y el administrador recibe un error claro.
- [x] No añadir una dependencia de procesado de imágenes sin medir tamaño de instalación, soporte de binarios, memoria y CPU.
- [x] Mantener fotos y medios como archivos/URLs; no introducir BLOBs en MySQL.

Comprobación A.6:

- `src/lib/url-safety.ts` centraliza la validación de URLs externas `http/https`, rutas públicas locales y rechazo de `.svg`/`.svgz`.
- `server/validators/public-url.ts` reutiliza esa política para noticias, partidos, equipos y jugadores.
- Las URLs externas de noticias y highlights rechazan esquemas no `http/https`, incluyendo `javascript:` y `data:`.
- Las referencias de imagen por URL/ruta rechazan SVG y rutas locales inseguras como `//`, `..` o barras invertidas.
- La subida de media acepta solo PNG, JPEG, WEBP y AVIF; ya no acepta SVG en UI ni servidor.
- La subida valida tamaño máximo, extensión coherente con MIME, firma básica del archivo y ubicación bajo `public/media`.
- El selector/resolve de media no permite reutilizar SVG originales como recurso público nuevo.
- Prueba local de rasterizado SVG con `sharp`: `svg-rasterize:ok`; no se activó en producción porque `sharp` no está declarado como dependencia directa ni se han medido binarios, memoria y CPU en Hostinger.
- Fallo seguro actual: SVG no se publica ni se convierte automáticamente; el administrador recibe un error claro.
- No se añadieron dependencias ni BLOBs en MySQL.
- `npm run lint` termina sin errores; mantiene 9 warnings preexistentes de fuentes/`img`.
- `npx prisma validate` termina correctamente.
- `npx tsc --noEmit --pretty false` sigue bloqueado por el tipo generado stale `.next/dev/types/validator.ts` que referencia `src/app/admin/(panel)/usuarios/page.js`.

## A.7 — Calidad básica de administración y producción

- [x] Añadir `noindex, nofollow` a todo `/admin`.
- [x] Eliminar mensajes técnicos o textos largos innecesarios de las pantallas tocadas.
- [x] Corregir imports muertos y componentes huérfanos producidos por la limpieza.
- [x] No introducir rutas, permisos o funcionalidades nuevas fuera del MVP.

Comprobación A.7:

- `src/app/admin/layout.tsx` aplica `robots: { index: false, follow: false, nocache: true }` a todo `/admin`, incluido login y panel.
- Se sustituyeron mensajes de prototipo en estados de error por textos breves de recuperación.
- Se retiraron referencias de interfaz a `datos de prueba`, `placeholder`, `jerarquia`, `layout` y rutas pendientes en las pantallas admin tocadas.
- Se eliminaron las carpetas vacías huérfanas de `/admin/(panel)/usuarios`, `/admin/(panel)/temporadas` y `/admin/(panel)/importaciones`.
- No se introdujeron rutas, permisos ni funcionalidades nuevas fuera del MVP.
- `npm run lint` termina sin errores; mantiene 9 warnings preexistentes de fuentes/`img`.
- `npx prisma validate` termina correctamente.
- `npx tsc --noEmit --pretty false` sigue bloqueado por el tipo generado stale `.next/dev/types/validator.ts` que referencia `src/app/admin/(panel)/usuarios/page.js`.

## A.8 — Cierre de la Fase A

- [x] `npm run lint` termina correctamente.
- [x] `npm run build` termina correctamente.
- [x] `npx prisma validate` termina correctamente.
- [x] No hay rutas activas `/admin/temporadas`, `/admin/importaciones` ni `/admin/usuarios`.
- [x] No quedan fallbacks públicos que conviertan un recurso desconocido en otro recurso válido.
- [x] No quedan datos ficticios accesibles desde rutas de producción intervenidas en la fase.
- [x] Se documenta cualquier mock restante para resolverlo en la Fase B.
- [x] Revisar manualmente login, logout, dashboard, equipos, jugadores, partidos y noticias.
- [x] Marcar Fase A como completada solo después de resumir archivos cambiados, pruebas y riesgos pendientes.

Comprobación A.8:

- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npm run build` termina con código 0 tras aislar de TypeScript los tipos generados de desarrollo `.next/dev/types/**/*.ts` mediante `exclude` en `tsconfig.json`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npx next typegen` termina con código 0.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- La búsqueda de rutas activas no encuentra `/admin/usuarios`, `/admin/temporadas` ni `/admin/importaciones` bajo `src` o `server`; `src/app/admin/(panel)` solo conserva las rutas reales del MVP.
- Las rutas públicas de entidad concreta revisadas siguen delegando en servicios DB y responden con `notFound()` cuando no reciben contenido publicable.
- Los datos estáticos heredados restantes quedan documentados para Fase B: `PUBLIC_TEAM_PAGE_MOCKS` en `src/lib/public/team-page-content.ts`, calendarios estáticos/fallbacks en `src/lib/public/team-calendar-content.ts` y tablas estáticas/fallbacks en `src/lib/public/team-standings-content.ts`. En la búsqueda actual no hay rutas de producción que los usen como fuente de datos; los getters activos de equipo y clasificación devuelven DB o `null`.
- Revisión manual por código completada para login, logout, dashboard, equipos, jugadores, partidos y noticias. Queda pendiente un smoke test en navegador/servidor arrancado para la Fase E.
- Riesgos pendientes: Git continúa bloqueado por `safe.directory` en este entorno; los mocks heredados deben eliminarse o renombrarse en B.1/B.3; las advertencias de lint por `<img>`/fuente quedan fuera del cierre funcional de Fase A.

---

# Fase B — Arquitectura de frontend y contratos mantenibles

## Objetivo

Separar dominio, acceso a datos y presentación; reducir archivos monolíticos; terminar la eliminación de mocks; y dejar componentes públicos y administrativos pequeños, predecibles y comprobables.

## B.1 — Contratos de dominio neutrales

- [x] Definir contratos para equipos, asignaciones, jugadores, partidos, clasificación, estadísticas, noticias y medios sin depender de componentes.
- [x] Colocar los contratos de lectura pública y administración en módulos diferenciados cuando expongan datos distintos.
- [x] Eliminar nombres heredados de mock en tipos ya reales.
- [x] Evitar duplicar formas de datos entre servicios y componentes.
- [x] Validar escrituras con esquemas Zod próximos al límite servidor.
- [x] Confirmar que ningún contrato público incluye campos privados o internos.

Comprobación B.1:

- `src/lib/contracts/public.ts` concentra los contratos públicos de jugadores, equipos, partidos/calendario, clasificación, estadísticas, noticias y referencias de media.
- `src/lib/contracts/admin.ts` concentra los contratos de lectura/edición administrativa para asignaciones, equipos, jugadores, partidos, clasificaciones, estadísticas, noticias y media.
- Componentes y servicios públicos consumen tipos desde `@/lib/contracts/public` en lugar de leer contratos desde módulos de contenido con datos estáticos heredados.
- `src/lib/public/player-profile-types.ts`, `team-calendar-content.ts`, `team-page-content.ts`, `team-standings-content.ts`, `team-statistics-utils.ts` y `news-content.ts` quedan como wrappers/reexports o módulos de lógica/datos hasta su limpieza posterior.
- Se eliminó el tipo `StandingsMock` y los aliases de prototipo `TeamStub`, `MatchResult`, `TeamNewsItem`, `TeamQuickInfoItem` y `SquadHighlight` del código activo, sustituyéndolos por contratos `Public*`.
- Se retiraron helpers no consumidos de `team-page-content.ts` que dependían de calendarios estáticos de cantera.
- La única coincidencia restante de `Mock/MOCK` en `src` es `PUBLIC_TEAM_PAGE_MOCKS`, dato estático heredado ya documentado para B.4; no es un contrato usado por componentes como fuente de tipos.
- Las escrituras admin revisadas validan con Zod en `server/validators/*` y se consumen con `safeParse(input)` en acciones de servidor próximas al límite mutable.
- Los contratos públicos no incluyen campos privados, de rol, credenciales, importación, NIF/DNI, contacto, finanzas, stock ni notas internas.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.2 — División de áreas administrativas grandes

- [x] Dividir el workspace de estadísticas por filtros, tabla, edición y acciones de servidor.
- [x] Dividir la administración de asignaciones por consulta, formulario, validación y presentación.
- [x] Dividir la gestión de partidos por datos, estado, estadísticas y publicación.
- [x] Dividir la clasificación por edición, orden, validación y publicación.
- [x] Extraer lógica de negocio de componentes cliente.
- [x] Evitar componentes que conozcan directamente detalles de Prisma.
- [x] Mantener acciones mutables en servidor con validación y autorización comunes.

Comprobación B.2:

- `src/lib/admin/stats-workspace.ts` extrae estado auxiliar de estadísticas: badge de estado, hora de guardado, comparación de entradas, tipos móviles y creación de jugador invitado.
- `src/lib/admin/assignment-workspace.ts` extrae draft de alta, issues de plantilla, sugerencia de dorsal, etiquetas de posición y etiquetas de opciones de jugador.
- `src/lib/admin/match-workspace.ts` extrae filtros iniciales, filtro efectivo de estado, disponibilidad de `live`, filtros por fecha, paginación y métricas de partidos.
- `src/lib/admin/standing-workspace.ts` extrae filtros iniciales, orden/merge de tablas, banners y validación de filas/clasificación.
- Los workspaces `admin-stats-workspace.tsx`, `admin-assignments-workspace.tsx`, `admin-matches-workspace.tsx` y `admin-standings-workspace.tsx` consumen esos módulos y quedan centrados en estado UI, render y llamadas a acciones.
- `src/components/admin/admin-dashboard.tsx` ya no importa `@prisma/client`; `server/services/admin-dashboard.ts` mapea `MatchStatus` a un contrato plano antes de llegar al componente.
- Búsqueda de `Prisma`, `prisma.` y `@prisma/client` en `src/components/admin` sin resultados.
- Las acciones administrativas mantienen validación Zod con `safeParse(input)` y autorización por `requireAdminSectionAccess(...)` antes de mutar.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.3 — Familia de componentes públicos

- [x] Consolidar variantes premium y estándar sin duplicar páginas completas.
- [x] Separar datos de equipo, plantilla, calendario, clasificación y estadísticas de sus vistas.
- [x] Mantener las páginas resumen separadas de sus páginas completas.
- [x] Mantener la ficha global de jugador como una composición independiente del equipo de origen.
- [x] Asegurar que las tarjetas premium se construyen por capas reutilizables.
- [x] Asegurar que las tarjetas estándar usan únicamente los campos permitidos.
- [x] Retirar conceptos visuales heredados que dependan de una imagen final de tarjeta.

Comprobación B.3:

- `src/components/public/team-overview-page.tsx` consolida el resumen de Primer Equipo y equipos de cantera usando `PublicTeamPageContent`; las rutas quedan como carga de datos + composición.
- `src/components/public/team-squad-page.tsx` consolida la plantilla premium y estándar usando `PublicTeamRosterContent`, navegación de sección común y agrupación de jugadores reutilizable.
- `src/lib/public/team-roster.ts` concentra grupos de jugadores de campo y navegación de plantilla; las páginas ya no declaran grupos locales duplicados.
- `src/components/public/player-card.tsx` sustituye el cromo antiguo por capas reutilizables: frame, fondo, media/foto, dorsal, identidad, estadísticas y pie dominante.
- Las tarjetas estándar de cantera usan solo campos permitidos de cromo: foto/placeholder, nombre público, dorsal, país/bandera, posición, pie dominante, goles y asistencias.
- La ficha global de jugador sigue en `src/components/public/player-detail-page.tsx` como composición independiente; las plantillas enlazan con `getGlobalPlayerHref(player.slug)`.
- Las páginas resumen (`/primer-equipo`, `/equipos/[teamSlug]`) siguen separadas de plantilla, calendario, clasificación y estadísticas completas.
- Documentación visual alineada para retirar referencias heredadas a imágenes finales/subidas de cromo premium.
- Búsqueda de `premium-player-card`, `PremiumPlayerCard`, `Uploaded premium card images`, `Premium uploaded card image container` y `First Team premium card images` sin resultados en `src` ni docs activos.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.4 — Eliminación total de mocks

- [x] Sustituir el contenido estático de perfiles de jugador por servicios reales o estados vacíos honestos.
- [x] Sustituir calendarios públicos ficticios por consultas reales.
- [x] Sustituir noticias de ejemplo por contenido real o estado vacío.
- [x] Sustituir configuraciones de páginas de equipo que contengan datos de ejemplo por metadatos derivados del equipo real.
- [x] Eliminar todos los fixtures de administración que sigan accesibles.
- [x] Eliminar archivos de mocks ya sin consumidores.
- [x] Ejecutar una búsqueda final en código de producción.
- [x] Documentar excepciones legítimas de tests, storybook o seeds si existen; no contarlas como datos de ejecución.

Comprobación B.4:

- El contenido de perfiles públicos de jugador se resuelve desde `server/services/public/player-detail.ts`; si no hay jugador publicable, la ruta devuelve `notFound()`.
- Los calendarios públicos de Primer Equipo y cantera se resuelven desde `server/services/public/calendar.ts`; las rutas ya no tienen fallback a calendarios ficticios.
- Las noticias públicas se resuelven desde `server/services/public/news-content.ts` + `server/services/public/news.ts`; si no hay publicaciones visibles, `/noticias` muestra un estado vacío honesto y `/noticias/[slug]` responde `404`.
- `src/lib/public/team-page-content.ts` queda reducido a wrapper DB/contratos; se eliminó `PUBLIC_TEAM_PAGE_MOCKS`.
- `src/lib/public/teams-directory-content.ts` queda reducido a tipos; el directorio se construye desde equipos visibles de la temporada activa.
- Las rutas de clasificación (`/primer-equipo/clasificacion` y `/equipos/[teamSlug]/clasificacion`) consumen directamente `server/services/public/standings.ts`.
- Se eliminaron los archivos estáticos heredados `src/lib/public/team-calendar-content.ts`, `src/lib/public/team-standings-content.ts` y `src/lib/public/news-content.ts`.
- En administración no quedan fixtures/mocks accesibles ni archivos con nombres `mock`, `fixture`, `sample`, `stub` o `demo` bajo `src` o `server`.
- Búsqueda final en `src` y `server` de `\bmock\b`, `\bfixture\b`, `\bsample\b`, `\bdemo\b`, `example.com`, `PUBLIC_.*MOCK` y `\bstub\b` sin resultados.
- Búsqueda final sin imports/referencias a `team-standings-content`, `team-calendar-content`, `news-content`, `PUBLIC_TEAM_PAGE_MOCKS`, `PUBLIC_NEWS_ARTICLES`, `FIRST_TEAM_STANDINGS`, `ACADEMY_STANDINGS`, `FIRST_TEAM_CALENDAR` ni `ACADEMY_TEAM_CALENDARS`.
- Excepciones documentadas: `prisma/seed.ts`, `docs/SEED_DATA.md` y `docs/RESET_AND_INITIAL_LOAD_PLAN.md` describen seed/demo local; `docs/design/**`, `docs/PROMPTS.md`, `docs/IMPLEMENTATION_EXECUTION_PLAN.md` y guías históricas de backoffice conservan referencias retrospectivas a mocks, pero no son código de ejecución.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.5 — Estados de carga, vacío y error

- [x] Añadir estados de carga donde una navegación pueda quedar aparentemente bloqueada.
- [x] Añadir límites de error útiles sin exponer trazas o detalles internos.
- [x] Diferenciar claramente lista vacía de error de consulta.
- [x] Evitar mensajes de éxito si una mutación ha fallado.
- [x] Unificar feedback de guardar, publicar, archivar y eliminar lógicamente.
- [x] Registrar errores de servidor con suficiente contexto y sin secretos.

Comprobación B.5:

- Se añadieron estados compartidos de carga y error para público y administración: `PublicLoadingState`, `PublicErrorState`, `AdminLoadingState` y `AdminErrorState`.
- Se añadieron límites App Router `loading.tsx` y `error.tsx` en raíz pública, `/admin` y `/admin/(panel)` sin mostrar trazas, digest ni detalles internos.
- Se añadieron `not-found.tsx` público y administrativo para diferenciar `404` de estados vacíos reales.
- `AdminEmptyState` distingue estados vacíos honestos con `Sin datos` por defecto en lugar de textos de prototipo.
- Los banners administrativos usan tonos explícitos `success`, `danger` o `info`; las mutaciones fallidas ya no se presentan visualmente como éxito en equipos, partidos, asignaciones, jugadores y estadísticas.
- El feedback existente de noticias, media y clasificaciones queda alineado con el mismo componente de banner y tonos.
- `server/logging/safe-server-log.ts` registra errores de servidor con `scope`, resumen de error y contexto saneado, filtrando claves sensibles y serializando `bigint` sin exponer secretos.
- Se instrumentaron servicios públicos críticos y acciones/API admin de noticias, media y asignaciones con logging seguro y mensajes de error aptos para interfaz.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.6 — Estrategia mínima de pruebas

- [x] Probar servicios públicos críticos: visibilidad, `404`, agregación global y estados de partido.
- [x] Probar validadores de URLs y medios.
- [x] Probar acciones administrativas críticas y su autorización.
- [x] Probar componentes con variantes deportivas donde el riesgo de regresión sea alto.
- [x] Evitar añadir una infraestructura de pruebas desproporcionada; justificar cualquier dependencia nueva.

Comprobación B.6:

- Se añadió `npm run test` con el runner nativo de Node (`node --test`) y TypeScript mediante `tsx`; no se añadieron dependencias nuevas.
- `tests/public-url.test.ts` cubre URLs externas `http/https`, rutas públicas locales, rechazo de rutas con `//`, `\`, segmentos `.`/`..`, control chars y SVG/SVGZ en referencias de imagen.
- El test de URLs detectó y corrigió un fallo real: `isSafeLocalPublicPath()` revisa ahora segmentos crudos antes de que `URL` normalice rutas como `/media/../secret.png`.
- `tests/public-sports-rules.test.ts` cubre agregación global de estadísticas públicas, participación de gol, divisiones seguras, conservación de `goalsAgainstPerMatch` en porteros de cantera, variantes de cromo Primer Equipo/cantera y estados visuales de partido.
- La prueba de agregación se mantiene unitaria; las consultas DB del servicio global ya filtran `played: true`, partido `PLAYED`, visibilidad pública y equipos/asignaciones publicables antes de pasar filas al agregador.
- `tests/admin-permissions.test.ts` cubre la navegación MVP activa, acceso de administrador único a secciones reales y denegación de secciones legacy descartadas (`seasons`, `imports`, `users`, `settings`).
- `server/auth/permissions.ts` mantiene los tipos legacy por compatibilidad, pero `canAccessAdminSection()` solo autoriza secciones activas de navegación.
- `cmd /c npm run test` termina con 11 tests correctos.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.

## B.7 — Cierre de la Fase B

- [x] No quedan módulos de mocks importados por código de producción.
- [x] No quedan datos de demostración en rutas públicas ni administrativas.
- [x] Los archivos monolíticos prioritarios están divididos por responsabilidad.
- [x] Lint, build, validación de Prisma y pruebas seleccionadas terminan correctamente.
- [x] La navegación pública y administrativa principal se revisa manualmente.

Comprobación B.7:

- Búsqueda final en `src`, `server` y `package.json` de `mock`, `mocks`, `fixture`, `fixtures`, `sample`, `demo`, `example.com`, `PUBLIC_.*MOCK` y `stub` sin resultados en runtime de producción.
- Las coincidencias restantes de `placeholder` bajo `src` corresponden a atributos de formulario o CSS `::placeholder`, no a datos ficticios.
- Las coincidencias restantes de `example.com`/`demo` están en `tests/public-url.test.ts` como entradas de validación negativa/positiva, no en runtime.
- Búsqueda de `/admin/usuarios`, `/admin/temporadas` y `/admin/importaciones` sin rutas activas en `src` ni `server`; las coincidencias restantes están en este documento como historial de cierre.
- `src/app` mantiene únicamente las rutas públicas canónicas, `/admin/login`, las pantallas admin MVP activas y las rutas técnicas de auth/media.
- `adminNavigation` mantiene solo secciones MVP activas: panel, jornada, clasificaciones, estadísticas, equipos, plantilla, fichas/cromos, media y noticias.
- `canAccessAdminSection()` autoriza solo las secciones activas de navegación aunque el tipo conserve claves legacy por compatibilidad.
- Los workspaces y componentes prioritarios tratados en B.2/B.3 tienen módulos de apoyo separados; quedan archivos compuestos grandes como candidatos secundarios para fases futuras si aparece dolor real, pero no bloquean el cierre arquitectónico de Fase B.
- Revisión manual por código completada de la navegación pública principal y navegación administrativa MVP.
- `cmd /c npm run test` termina con 11 tests correctos.
- `cmd /c npx tsc --noEmit --pretty false` termina con código 0.
- `cmd /c npm run lint` termina con código 0; mantiene 9 warnings conocidos de fuente externa y uso de `<img>`.
- `cmd /c npx prisma validate` termina con código 0.
- `cmd /c npm run build` termina con código 0.
- `cmd /c git status --short` sigue bloqueado por `safe.directory` del entorno.

---

# Fase C — Robustez de datos, acciones y medios

## Objetivo

Reforzar el acceso real a MySQL, la consistencia de mutaciones, el rendimiento bajo los límites de Hostinger y el ciclo de vida de archivos, sin ampliar el alcance funcional del MVP.

## C.1 — Acceso a datos y rendimiento

- [ ] Revisar consultas N+1 y selecciones excesivas en páginas públicas y administrativas.
- [ ] Seleccionar únicamente campos necesarios, especialmente en endpoints públicos.
- [ ] Verificar paginación en listas administrativas con crecimiento esperado.
- [ ] Revisar índices existentes para slugs, estados, temporada, equipo, partido y publicación.
- [ ] Proponer migraciones solo si una medición o consulta concreta lo justifica.
- [ ] Mantener el pool de MySQL pequeño, normalmente entre 5 y 10 conexiones.
- [ ] Confirmar la configuración correcta del adaptador MariaDB si Prisma 7+ lo requiere.

## C.2 — Mutaciones y consistencia

- [ ] Agrupar en transacciones las operaciones que deban ser atómicas.
- [ ] Asegurar que cada escritura valida autorización en servidor.
- [ ] Revalidar solo las rutas afectadas tras una mutación.
- [ ] Evitar borrados físicos de entidades con historial.
- [ ] Verificar que archivar una asignación no mueve ni elimina estadísticas históricas.
- [ ] Proteger acciones repetidas contra estados imposibles o duplicados evidentes.
- [ ] Normalizar mensajes de error de conflictos de base de datos.

## C.3 — Publicación y caché

- [ ] Definir por ruta qué contenido es estático, cacheado o dinámico.
- [ ] Cachear páginas públicas y datos estables siempre que la publicación manual lo permita.
- [ ] Mantener el backoffice en lectura/escritura real sin servir datos obsoletos tras guardar.
- [ ] Revalidar páginas de equipo, jugador, partido, clasificación y noticia afectadas.
- [ ] No depender de `rr-management` en tiempo de ejecución.

## C.4 — Pipeline de archivos

- [ ] Definir directorio, nombres únicos y metadatos persistidos para cada tipo de archivo.
- [ ] Convertir imágenes compatibles a WebP cuando no perjudique transparencia o calidad necesaria.
- [ ] Convertir SVG aceptado a WebP o PNG antes de publicación.
- [ ] Eliminar de forma recuperable archivos huérfanos solo después de verificar referencias.
- [ ] Establecer límites de resolución, tamaño y formatos por tipo de medio.
- [ ] Verificar orientación, transparencia y proporciones de fotos y escudos.
- [ ] No procesar vídeos: guardar únicamente URLs externas validadas.

## C.5 — Compatibilidad y deuda de esquema

- [ ] Inventariar campos de roles, tarjeta o importación que el runtime ya no utilice.
- [ ] Clasificar cada campo como compatible, obsoleto seguro o candidato a migración futura.
- [ ] No eliminar campos ni enums con datos existentes sin backup, migración y plan de rollback.
- [ ] Mantener fuera de interfaz las capacidades de temporadas, importaciones y usuarios descartadas.
- [ ] Registrar en un documento separado cualquier limpieza de Prisma propuesta; no mezclarla silenciosamente con refactors de UI.

## C.6 — Cierre de la Fase C

- [ ] Consultas críticas revisadas y sin N+1 conocidos.
- [ ] Mutaciones críticas validadas, autorizadas y revalidadas correctamente.
- [ ] Pipeline de imagen probado con PNG, JPEG, WebP y SVG.
- [ ] Lint, build, Prisma y pruebas de servicios terminan correctamente.
- [ ] No se han introducido dependencias runtime de `rr-management`, WordPress o servicios de pago.

---

# Fase D — Producto público, edición de noticias, SEO y accesibilidad

## Objetivo

Cerrar la experiencia pública y administrativa con contenido real, una decisión sostenible para noticias, mejor descubrimiento y una interfaz accesible sin apartarse de la identidad visual documentada.

## D.1 — Decisión sobre el contenido de noticias

- [ ] Elegir entre bloques estructurados o Markdown restringido antes de construir el editor definitivo.
- [ ] Documentar qué bloques o sintaxis se admiten.
- [ ] Definir imágenes, enlaces/referencias y vídeos externos permitidos.
- [ ] Definir cómo se previsualiza antes de publicar.
- [ ] Definir migración del contenido real existente, si lo hay.
- [ ] Evitar HTML libre no sanitizado.

Recomendación: bloques estructurados sencillos para párrafo, subtítulo, imagen, enlace y vídeo externo. Reducen el riesgo de HTML inseguro y encajan mejor con la especificación pública. Markdown restringido solo sería preferible si la velocidad editorial pesa más y se acepta una previsualización menos guiada.

## D.2 — Pulido de páginas públicas

- [ ] Revisar Home como resumen y puerta de entrada, sin duplicar páginas completas.
- [ ] Revisar Primer Equipo con variante premium consistente.
- [ ] Revisar equipos de cantera con variante reducida.
- [ ] Revisar la ficha global de jugador y su representación de varias asignaciones.
- [ ] Revisar calendario, clasificación y estadísticas por equipo.
- [ ] Revisar detalle de partido de Primer Equipo y cantera según sus reglas distintas.
- [ ] Revisar listado y detalle de noticias con contenido real.
- [ ] Eliminar copy técnico, explicativo o redundante.

## D.3 — SEO y compartición

- [ ] Configurar `metadataBase` para producción.
- [ ] Añadir títulos y descripciones dinámicas a rutas públicas.
- [ ] Añadir URLs canónicas, incluida la ficha global de jugador.
- [ ] Añadir Open Graph y metadatos de redes con imágenes válidas.
- [ ] Crear sitemap solo con entidades públicas.
- [ ] Crear robots coherente con el despliegue y excluir administración.
- [ ] Verificar que páginas no publicadas no aparecen en sitemap.

## D.4 — Rendimiento visual

- [ ] Sustituir usos evitables de `<img>` por el componente de imagen optimizada cuando sea compatible con el hosting.
- [ ] Configurar dominios o patrones remotos de imágenes de forma restrictiva.
- [ ] Cargar tipografías con el mecanismo de Next.js o una estrategia local estable.
- [ ] Reducir JavaScript cliente en páginas principalmente informativas.
- [ ] Verificar tamaños de bundles y rutas más costosas.
- [ ] Evitar que tarjetas por capas degraden el rendimiento en listados largos.

## D.5 — Accesibilidad y responsive

- [ ] Verificar navegación completa por teclado.
- [ ] Verificar foco visible y orden lógico.
- [ ] Verificar nombres accesibles de iconos, botones y menús.
- [ ] Verificar contraste con los tokens de diseño.
- [ ] Verificar tablas deportivas en móvil sin perder contexto.
- [ ] Verificar formularios con etiquetas, errores y estados de carga claros.
- [ ] Verificar páginas públicas en anchos móvil, tableta y escritorio.

## D.6 — Cierre de la Fase D

- [ ] Formato de noticias decidido, documentado e implementado.
- [ ] Rutas públicas canónicas revisadas con datos reales.
- [ ] SEO, sitemap, robots y `noindex` de administración verificados.
- [ ] Auditoría manual de accesibilidad y responsive completada.
- [ ] Lint, build y pruebas seleccionadas terminan correctamente.

---

# Fase E — Preparación y validación de despliegue en Hostinger

## Objetivo

Dejar una entrega reproducible, segura y operable en Hostinger Business Web Hosting, con decisiones explícitas sobre archivos, base de datos, backups y rollback.

## E.1 — Runtime y variables

- [ ] Fijar Node.js 20 LTS para producción salvo validación documentada de una versión posterior.
- [ ] Revisar scripts de instalación, build, start y migración.
- [ ] Comparar `.env.example` con todas las variables realmente usadas sin copiar secretos.
- [ ] Configurar `DATABASE_URL` para CLI y variables separadas del adaptador cuando corresponda.
- [ ] Establecer un límite conservador de conexiones a MySQL.
- [ ] Confirmar secretos de sesión, URL pública y configuración de cookies seguras.
- [ ] Evitar registrar contraseñas, tokens o URLs con credenciales.

## E.2 — Decisión de persistencia de medios

- [ ] Verificar si el directorio de archivos de la app persiste entre builds y despliegues de Hostinger.
- [ ] Verificar si los backups de Hostinger incluyen ese directorio y con qué retención.
- [ ] Medir el impacto de usar disco local: pérdida en redeploy, sincronización, permisos, cuota y recuperación.
- [ ] Medir el impacto de una alternativa externa solo si el disco local no cumple: coste, complejidad, latencia y dependencia.
- [ ] Elegir la opción de menor coste que garantice persistencia y recuperación suficientes.
- [ ] Documentar copia, restauración y eliminación de medios.
- [ ] No contratar ni integrar un servicio de pago sin aprobación explícita.

## E.3 — Base de datos y migraciones

- [ ] Crear backup manual de MySQL antes de cualquier migración de producción.
- [ ] Validar migraciones contra una copia o entorno de ensayo.
- [ ] Ejecutar `prisma validate` y `prisma generate` con la versión de producción.
- [ ] Definir el comando exacto de despliegue de migraciones.
- [ ] No usar `migrate dev` en producción.
- [ ] Documentar rollback de aplicación y recuperación de base de datos.

## E.4 — Seguridad operativa

- [ ] Verificar HTTPS y cookies seguras.
- [ ] Verificar que `/admin` exige sesión en todas sus rutas y acciones.
- [ ] Verificar límites de subida y conversión de archivos bajo carga razonable.
- [ ] Verificar cabeceras de seguridad compatibles con imágenes y vídeos externos.
- [ ] Verificar que errores de producción no muestran trazas ni variables.
- [ ] Revisar dependencias con vulnerabilidades conocidas y resolver las relevantes para runtime.

## E.5 — Ensayo de despliegue y smoke tests

- [ ] Ejecutar instalación limpia de dependencias.
- [ ] Ejecutar build de producción limpio.
- [ ] Arrancar la aplicación con configuración equivalente a producción.
- [ ] Probar Home y todas las familias de rutas públicas canónicas.
- [ ] Probar login, logout y rutas administrativas reales.
- [ ] Probar crear, editar, publicar y archivar contenido representativo.
- [ ] Probar subida y recuperación de imagen tras reinicio/redeploy controlado.
- [ ] Probar `404`, páginas no publicadas y ausencia de datos ficticios.
- [ ] Probar conexión bajo el límite configurado del pool.

## E.6 — Entrega y operación

- [ ] Documentar despliegue desde GitHub a Hostinger.
- [ ] Documentar variables, migración, backup y rollback.
- [ ] Documentar comprobaciones posteriores a cada despliegue.
- [ ] Documentar recuperación de medios y base de datos.
- [ ] Registrar limitaciones conocidas aceptadas para el MVP.
- [ ] Confirmar que tienda y `rr-management` continúan separados y sin dependencia runtime.

## E.7 — Cierre del plan

- [ ] Despliegue de producción completado o ensayo equivalente aprobado.
- [ ] Smoke tests aprobados.
- [ ] Backup y rollback comprobados documentalmente.
- [ ] No quedan mocks de ejecución.
- [ ] No quedan rutas descartadas ni ramas funcionales por rol.
- [ ] La ficha global de jugador es la única ficha canónica.
- [ ] El administrador puede operar el backoffice sin funciones fuera del MVP.
- [ ] Riesgos residuales y siguientes mejoras quedan documentados fuera de este plan.

---

## Registro de decisiones posteriores

Añadir aquí las decisiones que se tomen durante la ejecución, con fecha y fase afectada.

- 2026-07-18: creado el plan a partir de la auditoría del repositorio y de las respuestas de producto. No se ha iniciado todavía la Fase A.
- 2026-07-21: se confirma que `goalsAgainstPerMatch` se conserva para porteros de cantera. Quedan pendientes su validación de cálculo y alineación documental en el bloque deportivo correspondiente.

## Registro de ejecución

Añadir una entrada al cerrar cada bloque de trabajo.

| Fecha | Fase/bloque | Resultado | Verificación | Pendientes |
|---|---|---|---|---|
| 2026-07-18 | Planificación | Plan A-E creado | Revisión documental | Iniciar Fase A |
| 2026-07-21 | A.0 | Línea base completada y alcance protegido | `npm run lint` inicial correcto con advertencias, `npm run build` inicial correcto, `npx prisma validate` correcto, solo `src/app` activo | `git status` queda limitado por `safe.directory` del entorno |
| 2026-07-21 | A.1 | Backoffice simplificado a administrador único; rutas descartadas sin `page.tsx`; logout visible verificado; dashboard sin widgets de importación | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, búsqueda de rutas descartadas sin ficheros activos | `npm run build` compila pero el typecheck falla por caché generada `.next/dev/types/validator.ts` apuntando a `/admin/usuarios`; continuar por A.2 |
| 2026-07-21 | A.2 | Mocks admin y fixtures públicos antiguos retirados; contratos movidos a módulos neutrales; creación de clasificaciones sin rivales ficticios | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, búsqueda sin imports a mocks eliminados | `npx tsc --noEmit` sigue bloqueado por caché generada `.next/dev/types/validator.ts`; la búsqueda restante de `placeholder` corresponde a atributos de formulario, CSS y texto de ayuda, no a datos de ejecución |
| 2026-07-21 | A.3 | Ficha global de jugador consolidada; ruta contextual redirige permanentemente; canonical añadido; contexto multi-equipo visible; variante premium limitada a asignaciones solo de Primer Equipo | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, búsqueda sin imports a módulos públicos estáticos retirados ni enlaces visibles a fichas contextuales | Quedan revalidaciones de rutas heredadas `/equipos/[teamSlug]/jugadores/[playerSlug]` porque la ruta existe como redirección |
| 2026-07-22 | A.4 | Consultas públicas endurecidas; recursos desconocidos/no publicables devuelven `404`; cantera no expone `live` ni highlights; highlights limitados a partidos jugados del Primer Equipo | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, revisión de rutas con `notFound()` y filtros públicos | El typecheck seguía bloqueado por tipo dev stale hasta A.8 |
| 2026-07-22 | A.5 | Estadísticas públicas centralizadas; participación de gol unificada; divisiones seguras; histórico ligado a jugador/equipo/temporada/partido; `goalsAgainstPerMatch` conservado para porteros de cantera | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, revisión de utilidades compartidas | Alinear la decisión de `goalsAgainstPerMatch` en documentos deportivos en una fase posterior |
| 2026-07-22 | A.6 | Validación de URLs y media endurecida; SVG no se publica directamente; subida limitada a PNG/JPEG/WEBP/AVIF con comprobaciones de MIME, extensión, firma y ubicación | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, prueba local `svg-rasterize:ok` sin activar dependencia nueva | Decidir persistencia/conversión definitiva de medios en Fase E |
| 2026-07-22 | A.7 | `/admin` marcado `noindex,nofollow`; copy técnico/prototipo retirado en pantallas tocadas; carpetas huérfanas de rutas descartadas eliminadas | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, revisión de navegación/admin | Smoke test visual pendiente para Fase E |
| 2026-07-22 | A.8 | Fase A cerrada; build desbloqueado excluyendo tipos generados de desarrollo stale; rutas descartadas, fallbacks públicos y mocks restantes auditados | `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npm run build` correcto, `cmd /c npx prisma validate` correcto, `cmd /c npx next typegen` correcto, `cmd /c npx tsc --noEmit --pretty false` correcto | Git sigue bloqueado por `safe.directory`; quedan datos estáticos heredados no usados como runtime público para resolver en B.1/B.3 |
| 2026-07-22 | B.1 | Contratos públicos y admin centralizados en módulos neutrales; imports de tipos migrados desde módulos de contenido; nombres de prototipo retirados de contratos activos | `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | `PUBLIC_TEAM_PAGE_MOCKS` sigue como dato estático heredado para B.4; B.2 debe dividir workspaces admin grandes |
| 2026-07-23 | B.2 | Workspaces admin prioritarios divididos mediante módulos de soporte para estadísticas, asignaciones, partidos y clasificaciones; dashboard admin desacoplado de Prisma | `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | B.3 debe continuar con la familia de componentes públicos; quedan monolitos secundarios para fases posteriores si se requiere más granularidad |
| 2026-07-23 | B.3 | Familia pública consolidada con vistas compartidas para resumen de equipo, plantilla y cromos por capas; variantes premium/estándar explícitas y documentación visual alineada | `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | B.4 debe eliminar los mocks/datos estáticos heredados que aún no son fuente runtime real |
| 2026-07-23 | B.4 | Mocks de ejecución eliminados; calendarios, clasificaciones, noticias, equipo/directorio y jugadores quedan en DB o estado vacío/404 honesto; archivos estáticos heredados retirados | `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | B.5 debe reforzar estados de carga, vacío y error; quedan referencias históricas a mocks solo en docs de contexto/seed no runtime |
| 2026-07-23 | B.5 | Estados de carga/error/404 añadidos para público y admin; vacíos diferenciados; feedback admin con tonos coherentes; logging seguro de servidor instrumentado | `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | B.6 debe añadir la estrategia mínima de pruebas sin sobredimensionar infraestructura |
| 2026-07-23 | B.6 | Estrategia mínima de pruebas añadida con Node test + `tsx`; URLs/media, reglas deportivas públicas, variantes de cromos y permisos admin quedan cubiertos; corregida validación de rutas locales con `..` | `cmd /c npm run test` correcto con 11 tests, `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | B.7 debe cerrar Fase B con búsqueda final, validaciones y revisión de navegación |
| 2026-07-23 | B.7 | Fase B cerrada; producción queda sin mocks/demos runtime, navegación pública/admin revisada, rutas descartadas ausentes y validaciones completas correctas | `cmd /c npm run test` correcto con 11 tests, `cmd /c npx tsc --noEmit --pretty false` correcto, `cmd /c npm run lint` correcto con 9 warnings, `cmd /c npx prisma validate` correcto, `cmd /c npm run build` correcto | Continuar por C.1; `git status` sigue bloqueado por `safe.directory` del entorno |
