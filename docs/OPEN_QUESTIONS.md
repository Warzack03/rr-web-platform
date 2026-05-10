# OPEN_QUESTIONS.md

## Base de datos y DDL rr-management

Para afinar la importacion desde rr-management, se necesita DDL o ejemplo de export de estas entidades:

- seasons
- teams
- persons
- player_profiles
- player_profile_seasons
- team_assignments

No hace falta DDL de tesoreria, ropa, stock, facturacion o pedidos para la nueva plataforma publica.

## Diseno

Pendiente decidir:

- Logo/escudo exacto a usar.
- Imagenes principales de hero.
- Si se cargaran fuentes externas Bebas Neue y Barlow.
- Variante visual exacta de cromos especiales del Primer Equipo.

## Estadisticas

Pendiente decidir:

- Si las estadisticas se editan por partido y se agregan automaticamente, o si se editan como acumulados por jugador.
- Para MVP se recomienda empezar por acumulados manuales y evolucionar a stats por partido si hace falta.

## Noticias

Pendiente decidir:

- Si las noticias se gestionan en la nueva plataforma.
- Si se siguen gestionando en WordPress.
- Si la home publica solo mostrara noticias creadas en la nueva plataforma.

## Tienda

Decision inicial:

- WooCommerce se mantiene.

Pendiente decidir:

- URL final de tienda.
- Si se mostraran productos destacados en la home publica consumiendo WooCommerce o solo un enlace.


## Resolved after DDL review

- Import should use merge/upsert, not destructive replacement.
- rr-management external IDs are available from source table IDs.
- Do not import NIF/DNI/contact/address/document_status/notes.
- The source team code is available and can be used as a secondary matching key.
- Historical stats must stay attached to the original team/season/match.


## Resueltas en v4

- La pagina de detalle de equipo entra en MVP.
- Las noticias nuevas entran en MVP.
- El entrenador de equipo se muestra/gestiona en el equipo; staff de club queda separado.
- Solo superadmin/manager crean equipos y asignan entrenadores.
- Entrenador solo edita datos permitidos de equipos asignados.
- Participaciones de gol = goles + asistencias.
- Modo oscuro primero; modo claro al final.
- Automatizacion Liga Municipal/RFFM queda fuera del MVP.
