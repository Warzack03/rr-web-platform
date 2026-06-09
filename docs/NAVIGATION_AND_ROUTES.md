# NAVIGATION_AND_ROUTES.md

## Public routes

```text
/
/primer-equipo
/primer-equipo/plantilla
/primer-equipo/calendario
/primer-equipo/clasificacion
/primer-equipo/partidos/[matchId]
/equipos
/equipos/[teamSlug]
/equipos/[teamSlug]/plantilla
/equipos/[teamSlug]/calendario
/equipos/[teamSlug]/clasificacion
/equipos/[teamSlug]/partidos/[matchId]
/equipos/[teamSlug]/jugadores/[playerSlug]
/jugadores/[playerSlug]
/noticias
/noticias/[slug]
```

## Public navigation

Main header items:

- Home -> `/`
- Primer Equipo -> `/primer-equipo`
- Equipos -> `/equipos`
- Noticias -> `/noticias`
- Tienda Oficial -> `https://tienda.risingraimon.es`

Active nav:

- `/primer-equipo/*` marks Primer Equipo active.
- `/equipos/*` marks Equipos active.
- `/noticias/*` marks Noticias active.
- `/` marks Home active.

## Team route ownership

First Team owns:

- `/primer-equipo`
- `/primer-equipo/plantilla`
- `/primer-equipo/calendario`
- `/primer-equipo/clasificacion`
- `/primer-equipo/partidos/[matchId]`
- First Team players can use `/jugadores/[playerSlug]`.

Academy/rest teams own:

- `/equipos/[teamSlug]`
- `/equipos/[teamSlug]/plantilla`
- `/equipos/[teamSlug]/calendario`
- `/equipos/[teamSlug]/clasificacion`
- `/equipos/[teamSlug]/partidos/[matchId]`
- `/equipos/[teamSlug]/jugadores/[playerSlug]`

## Admin routes

```text
/admin
/admin/login
/admin/temporadas
/admin/equipos
/admin/jugadores
/admin/asignaciones
/admin/partidos
/admin/clasificaciones
/admin/estadisticas
/admin/noticias
/admin/media
/admin/importaciones
/admin/usuarios
```

Admin routes must be protected. Role-based visibility is not enough; server-side permission checks are required for writes.
