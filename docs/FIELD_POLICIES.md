# FIELD_POLICIES.md

## Objetivo

Definir que sistema manda sobre cada campo para evitar que una importacion desde rr-management destruya datos creados en la web.

## Fuente de verdad por dominio

### rr-management manda en maestro deportivo importado

- sourcePersonId.
- firstName.
- lastName.
- active base.
- sourceTeamId.
- teamCode.
- teamName base.
- sourceSeasonId.
- seasonName.
- asignacion principal jugador-equipo-temporada.
- posicion base si viene de `player_profile_seasons`.

### La plataforma web manda en contenido publicable

- publicName.
- slug publico.
- publicVisible.
- photoUrl.
- cardImageUrl.
- bannerUrl.
- bio publica.
- featured.
- isFirstTeam.
- cromos.
- noticias.
- videos.
- partidos.
- resultados.
- clasificaciones.
- estadisticas.

### Campos mixtos

- dorsal.
- publicPosition.
- displayOrder.
- entrenador visible.

Regla recomendada para campos mixtos:

- Conservar valor local si existe.
- Rellenar desde import solo si el valor local esta vacio.
- Permitir sobrescritura solo con confirmacion explicita en import preview.

## Reglas de importacion

- Usar external IDs (`sourcePersonId`, `sourceTeamId`, `sourceSeasonId`) para emparejar.
- No usar NIF/DNI como clave en la nueva plataforma.
- No importar direccion, contacto, document_status, notes ni datos economicos.
- No borrar fisicamente entidades con historico.
- Si un jugador deja de venir en snapshot, marcar inactivo para la temporada.
- Si un jugador cambia de equipo, cerrar/inactivar la asignacion anterior y crear la nueva.
- Las estadisticas nunca se mueven automaticamente de equipo/temporada/partido.
- Las asignaciones manuales excepcionales se conservan salvo confirmacion explicita.
