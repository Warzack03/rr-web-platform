# NAVIGATION_AND_ROUTES.md

## Objetivo

Definir la estructura de rutas para evitar que Codex improvise URLs, nombres de secciones o jerarquias.

## Rutas publicas MVP

- `/` - Home publica.
- `/primer-equipo` - Pagina premium del Primer Equipo.
- `/equipos` - Listado de todos los equipos visibles.
- `/equipos/[teamSlug]` - Detalle publico de cada equipo.
- `/jugadores/[playerSlug]` - Ficha publica de jugador, si se habilita en MVP.
- `/partidos` - Calendario/resultados publicos.
- `/clasificacion` - Clasificacion destacada del Primer Equipo o acceso a clasificaciones.
- `/noticias` - Listado de noticias nuevas creadas en la plataforma.
- `/noticias/[slug]` - Detalle de noticia.
- `/tienda` - Enlace o redirect a WooCommerce, no ecommerce propio.

## Rutas admin MVP

- `/admin/login` - Login interno.
- `/admin` - Dashboard.
- `/admin/temporadas` - Gestion de temporadas.
- `/admin/equipos` - Gestion de equipos.
- `/admin/equipos/[teamId]` - Detalle/edicion de equipo.
- `/admin/jugadores` - Gestion de jugadores publicables.
- `/admin/partidos` - Gestion de partidos/resultados/proximo partido.
- `/admin/clasificaciones` - Gestion manual de clasificaciones.
- `/admin/estadisticas` - Gestion de estadisticas.
- `/admin/noticias` - Gestion de noticias.
- `/admin/importaciones` - Importacion desde rr-management.
- `/admin/usuarios` - Gestion de usuarios y permisos.
- `/admin/configuracion` - Configuracion general.

## Regla de ruta por temporada

Por defecto las rutas publicas muestran la temporada activa. En una fase posterior se podra anadir historico por temporada, por ejemplo:

- `/temporadas/[seasonSlug]/equipos/[teamSlug]`

No implementar historico publico avanzado en MVP salvo que se solicite explicitamente.
