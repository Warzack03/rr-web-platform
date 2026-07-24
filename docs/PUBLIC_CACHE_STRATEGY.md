# Estrategia de publicación y caché pública

Última revisión: 24 de julio de 2026

## Regla base

El backoffice trabaja siempre en lectura/escritura real. Las rutas bajo `/admin` son dinámicas y no deben depender de HTML público cacheado para confirmar una escritura.

Las rutas públicas con datos deportivos o noticias usan ISR con una ventana común de 300 segundos. El valor se declara como literal en cada segmento porque Next.js requiere que `revalidate` sea analizable estáticamente. Las acciones administrativas revalidan las rutas afectadas al guardar para que la publicación manual no espere necesariamente a que expire la ventana.

Las páginas legales y otros contenidos sin lectura de base de datos pueden quedar estáticas de build.

## Mapa de rutas

| Ruta | Tipo | Revalidación |
|---|---|---|
| `/` | Pública con datos de home, Primer Equipo, cantera y noticias | ISR 300s + revalidación tras cambios de noticias, equipos, partidos y clasificaciones relevantes |
| `/equipos` | Directorio público de equipos | ISR 300s + revalidación tras cambios de equipos/asignaciones |
| `/primer-equipo` | Resumen público de equipo | ISR 300s + revalidación tras cambios del Primer Equipo, partidos, clasificaciones, estadísticas, asignaciones y noticias relacionadas |
| `/primer-equipo/plantilla` | Plantilla pública | ISR 300s + revalidación tras cambios de asignaciones, jugadores, equipos y estadísticas |
| `/primer-equipo/calendario` | Calendario público | ISR 300s + revalidación tras cambios de partidos del Primer Equipo |
| `/primer-equipo/clasificacion` | Clasificación pública | ISR 300s + revalidación tras cambios de clasificación del Primer Equipo |
| `/primer-equipo/estadisticas` | Estadísticas públicas | ISR 300s + revalidación tras cambios de estadísticas del Primer Equipo |
| `/primer-equipo/partidos/[matchId]` | Detalle público de partido | ISR 300s + revalidación tras cambios del partido afectado |
| `/equipos/[teamSlug]` | Resumen público de equipo de cantera | ISR 300s + revalidación tras cambios del equipo, partidos, clasificaciones, estadísticas, asignaciones y noticias relacionadas |
| `/equipos/[teamSlug]/plantilla` | Plantilla pública de cantera | ISR 300s + revalidación tras cambios de asignaciones, jugadores, equipos y estadísticas |
| `/equipos/[teamSlug]/calendario` | Calendario público de cantera | ISR 300s + revalidación tras cambios de partidos del equipo |
| `/equipos/[teamSlug]/clasificacion` | Clasificación pública de cantera | ISR 300s + revalidación tras cambios de clasificación del equipo |
| `/equipos/[teamSlug]/estadisticas` | Estadísticas públicas de cantera | ISR 300s + revalidación tras cambios de estadísticas del equipo |
| `/equipos/[teamSlug]/partidos/[matchId]` | Detalle público de partido de cantera | ISR 300s + revalidación tras cambios del partido afectado |
| `/equipos/[teamSlug]/jugadores/[playerSlug]` | Compatibilidad/redirección a ficha global | ISR 300s + revalidación tras cambios del jugador o asignación |
| `/jugadores/[playerSlug]` | Ficha pública global de jugador | ISR 300s + revalidación tras cambios de jugador, asignación o estadísticas |
| `/noticias` | Listado público de noticias | ISR 300s + revalidación tras cambios de noticias publicables |
| `/noticias/[slug]` | Detalle público de noticia | ISR 300s + revalidación tras cambios de la noticia afectada |
| `/politica-de-cookies` y `/politica-de-privacidad` | Contenido legal estático | Estático de build |

## Dependencias externas

El runtime público no consume `rr-management`, WordPress ni WooCommerce. Los enlaces a tienda y redes sociales son navegación externa estática; no son dependencias de datos.

La importación desde `rr-management` sigue siendo un flujo futuro por snapshot CSV/ZIP, no una lectura en tiempo de ejecución.
