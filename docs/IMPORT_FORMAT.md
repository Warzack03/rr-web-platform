# IMPORT_FORMAT.md

## Objetivo

Importar desde `rr-management` el maestro deportivo estable usado para inicializar o actualizar la plataforma web publicable:

- temporadas
- equipos
- personas/jugadores transformados a jugadores publicables
- perfiles deportivos de temporada
- asignaciones jugador-equipo-temporada

La importacion no es una sincronizacion viva. Es un proceso puntual, normalmente al inicio de temporada, con posibles reimportaciones controladas durante la temporada.

## Decision cerrada

La importacion debe ser **merge/upsert inteligente**, no borrado destructivo.

Regla central:

- `rr-management` manda en los datos maestros importados.
- La nueva plataforma conserva datos publicos y relaciones ya creadas.
- Las estadisticas se quedan asociadas al equipo/temporada/partidos donde se crearon.
- Nunca se mueven estadisticas automaticamente si un jugador cambia de equipo.

## Formato elegido

La primera version usara CSV por ser la opcion mas comoda de generar y revisar.

Formato recomendado:

- un ZIP con varios CSV, o
- varios CSV subidos por separado.

CSV esperados:

- `seasons.csv`
- `teams.csv`
- `persons.csv`
- `player_profile_seasons.csv`
- `team_assignments.csv`

## DDL fuente de rr-management

Las entidades fuente confirmadas son:

- `seasons(id, name, start_date, end_date, status)`
- `teams(id, code, name, active, display_order, branch)`
- `persons(id, first_name, last_name, nif_type, nif_value, birth_date, address, contact, active, document_status, notes, created_at, updated_at)`
- `player_profiles(person_id, primary_position, secondary_position, tertiary_position, training_preference, match_preference, level, sports_notes, ...)`
- `player_profile_seasons(person_id, season_id, primary_position, secondary_position, tertiary_position, training_preference, match_preference, level, sports_notes, ...)`
- `team_assignments(id, person_id, team_id, season_id, start_date, end_date, active, ...)`

La nueva plataforma no debe replicar datos sensibles de `persons`.

## CSV sugeridos

### `seasons.csv`

Columnas:

```csv
id,name,start_date,end_date,status
1,2026/2027,2026-09-01,2027-06-30,CURRENT
```

Mapeo:

- `id` -> `sourceSeasonId`
- `name` -> `name`
- `start_date` -> `startsAt`
- `end_date` -> `endsAt`
- `status` -> `status` / `isActive`

### `teams.csv`

Columnas:

```csv
id,code,name,active,display_order,branch
10,SENIOR_A,Senior A,true,1,MADRID
```

Mapeo:

- `id` -> `sourceTeamId`
- `code` -> `code` y clave natural secundaria
- `name` -> `name`
- `active` -> `active`
- `display_order` -> `displayOrder`
- `branch` -> `branch`

### `persons.csv`

Columnas permitidas:

```csv
id,first_name,last_name,birth_date,active
100,Nombre,Apellido,2010-01-01,true
```

Mapeo:

- `id` -> `sourcePersonId`
- `first_name` -> `firstName`
- `last_name` -> `lastName`
- `birth_date` -> `birthDate` opcional o `birthYear` si se decide guardar solo el ano
- `active` -> `active`

Columnas prohibidas aunque existan en rr-management:

- `nif_type`
- `nif_value`
- `address`
- `contact`
- `document_status`
- `notes`

### `player_profile_seasons.csv`

Columnas permitidas:

```csv
id,person_id,season_id,primary_position,secondary_position,tertiary_position,level
200,100,1,DELANTERO,EXTREMO,,4
```

Mapeo:

- `person_id` -> `sourcePersonId`
- `season_id` -> `sourceSeasonId`
- `primary_position` -> `primaryPosition`
- `secondary_position` -> `secondaryPosition`
- `tertiary_position` -> `tertiaryPosition`
- `level` -> `level` opcional

Campos no importados por defecto:

- `training_preference`
- `match_preference`
- `sports_notes`

Motivo: pueden contener informacion interna. Si en el futuro se confirma que son publicables, se reevaluara.

### `team_assignments.csv`

Columnas:

```csv
id,person_id,team_id,season_id,start_date,end_date,active
300,100,10,1,2026-09-01,,true
```

Mapeo:

- `id` -> `sourceAssignmentId`
- `person_id` -> `sourcePersonId`
- `team_id` -> `sourceTeamId`
- `season_id` -> `sourceSeasonId`
- `start_date` -> `joinedAt`
- `end_date` -> `leftAt`
- `active` -> `active`

## Claves de matching

Usar external IDs de rr-management:

- temporada: `sourceSeasonId`; alternativa `name` si hiciera falta
- equipo: `sourceTeamId`; alternativa `code`
- jugador: `sourcePersonId`
- perfil temporada: `sourcePersonId + sourceSeasonId`
- asignacion importada: `sourceAssignmentId`; alternativa `sourcePersonId + sourceSeasonId + sourceTeamId`

No usar NIF/DNI como clave en la nueva plataforma.

## Campos controlados por rr-management

Estos campos pueden actualizarse en cada importacion:

- nombre base y apellidos
- estado activo base
- equipo principal importado
- temporada
- posicion base
- codigo/nombre base del equipo
- fechas de asignacion importada

## Campos controlados por la nueva plataforma

Estos campos no deben sobrescribirse automaticamente por importacion:

- slug publico si ya existe
- nombre publico personalizado
- foto publica
- imagen de cromo
- diseno de cromo
- biografia publica
- visibilidad publica
- destacado/featured
- estadisticas
- partidos
- clasificaciones
- noticias
- contenido editorial
- asignaciones excepcionales creadas manualmente

## Conflictos y resolucion

### Jugador nuevo

Si `sourcePersonId` no existe, crear jugador publicable.

### Jugador existente

Si `sourcePersonId` existe, actualizar solo campos maestros permitidos y conservar campos publicos locales.

### Jugador que ya no viene en snapshot

No borrar. Marcar como inactivo para esa temporada o cerrar asignacion importada. Conservar historico.

### Jugador cambia de equipo

- cerrar/inactivar la asignacion importada anterior
- crear/actualizar la nueva asignacion importada
- conservar estadisticas en el equipo/temporada/partidos donde se crearon
- no mover estadisticas automaticamente

### Equipo nuevo

Crear equipo.

### Equipo existente

Actualizar campos maestros como nombre, activo, orden y branch. Conservar slug y configuracion publica si ya existian.

### Equipo desaparece

Marcar inactivo/archivado. No borrar si tiene partidos, clasificaciones, jugadores, noticias o stats.

### Slug en conflicto

Generar slug alternativo o pedir decision al admin. No sobrescribir URLs publicas sin confirmacion.

### Asignaciones excepcionales

La nueva plataforma puede permitir que un jugador este en mas de un equipo en casos excepcionales.

Regla:

- la importacion desde rr-management mantiene la asignacion principal importada
- las asignaciones manuales excepcionales se conservan
- el importador no elimina asignaciones manuales salvo confirmacion explicita

## Flujo de importacion en UI

1. Admin sube ZIP/CSV.
2. Sistema crea `import_batch` en estado `uploaded`.
3. Sistema valida columnas y tipos.
4. Sistema normaliza datos.
5. Sistema calcula diff contra la base actual.
6. Sistema muestra previsualizacion:
   - temporadas nuevas/actualizadas
   - equipos nuevos/actualizados/inactivados
   - jugadores nuevos/actualizados/inactivados
   - asignaciones creadas/cerradas/cambiadas
   - asignaciones manuales conservadas
   - conflictos y errores
7. Admin confirma.
8. Sistema aplica cambios en transaccion cuando sea posible.
9. Sistema guarda resumen y errores en `import_batch`.

## Validaciones

- No importar columnas sensibles.
- No permitir jugadores sin `sourcePersonId`.
- No permitir equipos sin `sourceTeamId` o `code`.
- No permitir asignaciones a temporada/equipo/jugador inexistente en el snapshot.
- No aplicar importacion si hay conflictos criticos sin resolver.
- No borrar datos con historico.
- Mantener auditoria de importacion.

## Politica de borrado

No hay borrado destructivo por defecto.

Usar:

- `active=false`
- `archivedAt`
- `leftAt`
- soft delete si hace falta

Solo permitir borrado fisico en datos sin historico y con confirmacion explicita del superadmin.
