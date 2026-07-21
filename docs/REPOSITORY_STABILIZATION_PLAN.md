# Plan de estabilización y cierre del repositorio

Última revisión: 21 de julio de 2026  
Estado general: Fase A.0, A.1, A.2, A.3 y A.4 completadas; continuar por A.5  
Siguiente bloque: Fase A.5

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

- [ ] Centralizar la selección de columnas por variante: Primer Equipo, cantera, jugador de campo y portero.
- [ ] Eliminar configuraciones duplicadas o divergentes entre tablas y tarjetas.
- [ ] Validar divisiones por cero y ausencia de minutos/partidos.
- [ ] Confirmar que participación de gol se calcula como goles más asistencias.
- [ ] Confirmar que el histórico no cambia de equipo al modificar una asignación actual.
- [ ] Validar la decisión cerrada de `goalsAgainstPerMatch` antes de modificar la tabla de porteros de cantera.
- [ ] Revisar nombres y abreviaturas para que sean comprensibles sin añadir texto explicativo largo a la interfaz.

## A.6 — URLs, medios y seguridad inmediata

- [ ] Validar URLs externas con esquema `http` o `https` en escrituras de noticias, vídeos y highlights.
- [ ] Rechazar esquemas ejecutables o inesperados como `javascript:` y `data:` en campos de URL externa.
- [ ] Auditar la subida actual por extensión, MIME real, tamaño, nombre de archivo y ubicación pública.
- [ ] Impedir que un SVG original no tratado se sirva desde el mismo origen público.
- [ ] Probar la viabilidad de rasterizar SVG a WebP o PNG con el runtime y límites de Hostinger.
- [ ] Definir un fallo seguro: si la conversión no es posible, el archivo no se publica y el administrador recibe un error claro.
- [ ] No añadir una dependencia de procesado de imágenes sin medir tamaño de instalación, soporte de binarios, memoria y CPU.
- [ ] Mantener fotos y medios como archivos/URLs; no introducir BLOBs en MySQL.

## A.7 — Calidad básica de administración y producción

- [ ] Añadir `noindex, nofollow` a todo `/admin`.
- [ ] Eliminar mensajes técnicos o textos largos innecesarios de las pantallas tocadas.
- [ ] Corregir imports muertos y componentes huérfanos producidos por la limpieza.
- [ ] No introducir rutas, permisos o funcionalidades nuevas fuera del MVP.

## A.8 — Cierre de la Fase A

- [ ] `npm run lint` termina correctamente.
- [ ] `npm run build` termina correctamente.
- [ ] `npx prisma validate` termina correctamente.
- [ ] No hay rutas activas `/admin/temporadas`, `/admin/importaciones` ni `/admin/usuarios`.
- [ ] No quedan fallbacks públicos que conviertan un recurso desconocido en otro recurso válido.
- [ ] No quedan datos ficticios accesibles desde rutas de producción intervenidas en la fase.
- [ ] Se documenta cualquier mock restante para resolverlo en la Fase B.
- [ ] Revisar manualmente login, logout, dashboard, equipos, jugadores, partidos y noticias.
- [ ] Marcar Fase A como completada solo después de resumir archivos cambiados, pruebas y riesgos pendientes.

---

# Fase B — Arquitectura de frontend y contratos mantenibles

## Objetivo

Separar dominio, acceso a datos y presentación; reducir archivos monolíticos; terminar la eliminación de mocks; y dejar componentes públicos y administrativos pequeños, predecibles y comprobables.

## B.1 — Contratos de dominio neutrales

- [ ] Definir contratos para equipos, asignaciones, jugadores, partidos, clasificación, estadísticas, noticias y medios sin depender de componentes.
- [ ] Colocar los contratos de lectura pública y administración en módulos diferenciados cuando expongan datos distintos.
- [ ] Eliminar nombres heredados de mock en tipos ya reales.
- [ ] Evitar duplicar formas de datos entre servicios y componentes.
- [ ] Validar escrituras con esquemas Zod próximos al límite servidor.
- [ ] Confirmar que ningún contrato público incluye campos privados o internos.

## B.2 — División de áreas administrativas grandes

- [ ] Dividir el workspace de estadísticas por filtros, tabla, edición y acciones de servidor.
- [ ] Dividir la administración de asignaciones por consulta, formulario, validación y presentación.
- [ ] Dividir la gestión de partidos por datos, estado, estadísticas y publicación.
- [ ] Dividir la clasificación por edición, orden, validación y publicación.
- [ ] Extraer lógica de negocio de componentes cliente.
- [ ] Evitar componentes que conozcan directamente detalles de Prisma.
- [ ] Mantener acciones mutables en servidor con validación y autorización comunes.

## B.3 — Familia de componentes públicos

- [ ] Consolidar variantes premium y estándar sin duplicar páginas completas.
- [ ] Separar datos de equipo, plantilla, calendario, clasificación y estadísticas de sus vistas.
- [ ] Mantener las páginas resumen separadas de sus páginas completas.
- [ ] Mantener la ficha global de jugador como una composición independiente del equipo de origen.
- [ ] Asegurar que las tarjetas premium se construyen por capas reutilizables.
- [ ] Asegurar que las tarjetas estándar usan únicamente los campos permitidos.
- [ ] Retirar conceptos visuales heredados que dependan de una imagen final de tarjeta.

## B.4 — Eliminación total de mocks

- [ ] Sustituir el contenido estático de perfiles de jugador por servicios reales o estados vacíos honestos.
- [ ] Sustituir calendarios públicos ficticios por consultas reales.
- [ ] Sustituir noticias de ejemplo por contenido real o estado vacío.
- [ ] Sustituir configuraciones de páginas de equipo que contengan datos de ejemplo por metadatos derivados del equipo real.
- [ ] Eliminar todos los fixtures de administración que sigan accesibles.
- [ ] Eliminar archivos de mocks ya sin consumidores.
- [ ] Ejecutar una búsqueda final en código de producción.
- [ ] Documentar excepciones legítimas de tests, storybook o seeds si existen; no contarlas como datos de ejecución.

## B.5 — Estados de carga, vacío y error

- [ ] Añadir estados de carga donde una navegación pueda quedar aparentemente bloqueada.
- [ ] Añadir límites de error útiles sin exponer trazas o detalles internos.
- [ ] Diferenciar claramente lista vacía de error de consulta.
- [ ] Evitar mensajes de éxito si una mutación ha fallado.
- [ ] Unificar feedback de guardar, publicar, archivar y eliminar lógicamente.
- [ ] Registrar errores de servidor con suficiente contexto y sin secretos.

## B.6 — Estrategia mínima de pruebas

- [ ] Probar servicios públicos críticos: visibilidad, `404`, agregación global y estados de partido.
- [ ] Probar validadores de URLs y medios.
- [ ] Probar acciones administrativas críticas y su autorización.
- [ ] Probar componentes con variantes deportivas donde el riesgo de regresión sea alto.
- [ ] Evitar añadir una infraestructura de pruebas desproporcionada; justificar cualquier dependencia nueva.

## B.7 — Cierre de la Fase B

- [ ] No quedan módulos de mocks importados por código de producción.
- [ ] No quedan datos de demostración en rutas públicas ni administrativas.
- [ ] Los archivos monolíticos prioritarios están divididos por responsabilidad.
- [ ] Lint, build, validación de Prisma y pruebas seleccionadas terminan correctamente.
- [ ] La navegación pública y administrativa principal se revisa manualmente.

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
