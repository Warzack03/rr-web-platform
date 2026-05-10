# ROLES_PERMISSIONS.md

## Roles iniciales

La plataforma tendra tres roles principales:

- `superadmin`.
- `manager`.
- `coach` / entrenador.

## Superadmin

Uso esperado: Aaron / administrador tecnico principal.

Permisos:

- Acceso total.
- Gestionar usuarios internos.
- Gestionar roles.
- Gestionar temporadas.
- Crear, editar, activar e inactivar equipos.
- Asignar entrenadores a equipos.
- Gestionar jugadores publicables.
- Gestionar asignaciones.
- Gestionar partidos.
- Gestionar clasificaciones.
- Gestionar estadisticas.
- Gestionar noticias/contenido.
- Ejecutar importaciones desde rr-management.
- Configurar parametros generales.

## Manager

Uso esperado: staff del club con permisos amplios.

Permisos:

- Crear y editar equipos.
- Asignar entrenadores a equipos.
- Gestionar jugadores publicables.
- Gestionar asignaciones.
- Gestionar partidos.
- Gestionar clasificaciones.
- Gestionar estadisticas.
- Gestionar noticias/contenido.
- Ejecutar importaciones si se habilita explicitamente.

Restricciones:

- No puede gestionar usuarios superadmin.
- No puede modificar configuracion sensible.
- No puede cambiar permisos de superadmin.

## Entrenador

Uso esperado: entrenador de uno o varios equipos concretos.

Permisos permitidos solo sobre sus equipos asignados:

- Ver su equipo asignado.
- Actualizar proximo partido.
- Actualizar resultados de partidos.
- Cambiar estado de partido dentro de lo permitido.
- Actualizar goles y asistencias.
- Actualizar clasificacion manual del equipo.

Restricciones:

- No puede crear equipos.
- No puede borrar equipos.
- No puede asignar permisos a otros usuarios.
- No puede crear temporadas.
- No puede crear usuarios.
- No puede editar otros equipos.
- No puede ejecutar importaciones.
- No puede acceder a datos internos no publicables.
- No puede modificar configuracion general.

## Asignacion entrenador-equipo

Solo `superadmin` y `manager` pueden conceder permisos de entrenador sobre un equipo.

Tabla recomendada:

- `user_team_permissions`.

Campos sugeridos:

- userId.
- teamId.
- seasonId.
- canEditMatches.
- canEditStats.
- canEditStandings.
- canEditNextMatch.

## Reglas de UI

- Ocultar acciones no permitidas.
- Validar permisos tambien en servidor.
- Nunca confiar solo en el frontend.
- Mostrar al entrenador solo sus equipos o una vista filtrada por defecto.

## Permisos MVP

- Superadmin: todo.
- Manager: todo excepto configuracion sensible y superadmins.
- Entrenador: actualizar proximo partido, resultados, goles/asistencias y clasificacion solo de sus equipos asignados.
