# Inventario de compatibilidad y deuda de esquema Prisma

Última revisión: 24 de julio de 2026

## Principio de C.5

Este documento no autoriza migraciones por sí mismo. Clasifica campos y enums que hoy existen en el esquema para compatibilidad, importación futura o decisiones de producto anteriores.

Cualquier eliminación real debe hacerse en una tarea separada con:

- backup de MySQL;
- revisión de datos existentes;
- migración Prisma explícita;
- plan de rollback;
- validación contra una copia o entorno de ensayo.

## Resumen

| Familia | Estado C.5 | Decisión |
|---|---|---|
| Roles y permisos por entrenador | Compatibilidad técnica / obsoleto funcional MVP | Mantener en DB; no exponer UI ni branching por rol |
| Importación rr-management | Compatibilidad necesaria futura | Mantener trazas, batches e índices |
| Tarjetas/cromos | Compatibilidad necesaria parcial | Mantener `PLAYER_CARD` y `premiumCardMediaId` para Primer Equipo/futuro |
| Media no imagen | Candidato futuro | Mantener enum/campos por compatibilidad; runtime MVP solo usa imágenes |
| Campos deportivos avanzados no editados | Candidato futuro | Mantener si están documentados o ya sembrados; no mostrar datos inventados |

## Roles y permisos

### `User.role` y enum `UserRole`

Valores:

- `SUPERADMIN`
- `MANAGER`
- `COACH`

Uso runtime actual:

- Auth conserva `role` en sesión/JWT.
- `canAccessAdminSection` ignora diferencias de rol y permite solo secciones activas del MVP.
- `toAdminRole` mapea cualquier `UserRole` a `ADMIN`.

Clasificación: compatible, obsoleto funcional para MVP.

Decisión:

- Mantener por compatibilidad con usuarios existentes, seeds y Auth.js.
- No crear selectores de rol, navegación por rol ni UI de entrenador.
- Candidato a simplificación futura solo si se decide que nunca habrá multiusuario ni permisos por equipo.

### `CoachTeamPermission`

Uso runtime actual:

- No condiciona el producto MVP.
- Permanece en relaciones de `User` y `SeasonTeam`.

Clasificación: candidato a migración futura, no seguro de eliminar todavía.

Riesgo:

- Puede tener datos existentes si una semilla o iteración anterior creó permisos.
- Recuperarlo después exigiría migración y lógica nueva.

Decisión:

- Mantener fuera de interfaz.
- No usarlo para limitar pantallas MVP.
- Si se elimina en el futuro, hacerlo junto a una decisión cerrada de no reintroducir entrenador/coach login.

### `TeamCoach.userId`

Uso runtime actual:

- Los entrenadores visibles son metadata pública de equipo.
- No implican permisos.

Clasificación: compatible.

Decisión:

- Mantener como compatibilidad técnica.
- La UI pública/admin debe tratar `TeamCoach` como fila visible, no como cuenta con permisos.

## Importación rr-management

### Campos `sourceSystem`, `sourceExternalId`, `lastImportBatchId`

Modelos afectados:

- `Season`
- `Team`
- `SeasonTeam`
- `Player`
- `PlayerSeasonProfile`
- `TeamPlayerAssignment`

Uso runtime actual:

- Seeds/bootstrap los rellenan para trazabilidad.
- Servicios de asignaciones distinguen origen manual/importado.
- La importación real por CSV/ZIP sigue fuera de la UI MVP activa, pero está documentada como flujo futuro.

Clasificación: compatible necesario.

Decisión:

- Mantener.
- No exponer en DTOs públicos.
- No eliminar antes de implementar o descartar formalmente el import por snapshot.

### `ImportBatch`, `ImportBatchItem`, `ImportStatus`, `ImportAction`

Uso runtime actual:

- Seeds/bootstrap registran batches.
- No hay ruta activa `/admin/importaciones`.

Clasificación: compatible necesario futuro.

Decisión:

- Mantener en esquema.
- Mantener fuera de interfaz hasta que exista un flujo completo con diff preview.
- No mezclar su limpieza con refactors de UI.

Nota:

- `ImportBatchItem.status` es `String @default("PENDING")`, mientras el draft histórico proponía enum. No se corrige en C.5 porque implicaría migración; si se implementa import real, revisar si conviene enum o estados libres para validación granular.

## Tarjetas, cromos y media

### `Player.premiumCardMediaId` y `MediaUsage.PLAYER_CARD`

Uso runtime actual:

- `PLAYER_CARD` existe en biblioteca media.
- La política de producto dice que las tarjetas se componen por capas web, pero el Primer Equipo puede tener recursos premium/base visual.

Clasificación: compatible necesario parcial.

Decisión:

- Mantener.
- No usarlo como PNG final obligatorio del cromo.
- Si en Fase D se confirma que no se subirá ningún recurso premium, podría pasar a candidato futuro, no a eliminación inmediata.

### `MediaType.VIDEO_LINK`, `MediaType.DOCUMENT`, `MediaAsset.externalUrl`

Uso runtime actual:

- El pipeline MVP solo sube `MediaType.IMAGE`.
- Vídeos se guardan como URLs externas en `Match.videoUrl` y `NewsPost.externalVideoUrl`.
- No hay subida de documentos.

Clasificación: candidato a migración futura.

Decisión:

- Mantener por compatibilidad de esquema.
- No exponer en biblioteca media MVP.
- Si se elimina en el futuro, comprobar que no existan filas no `IMAGE` ni `externalUrl` poblado.

### `MediaAsset.deletedAt`

Uso runtime actual:

- Biblioteca media filtra `deletedAt: null`.
- C.4 usa borrado recuperable moviendo archivo a `storage/media-trash` y marcando `deletedAt`.

Clasificación: compatible necesario.

Decisión:

- Mantener.

## Campos deportivos avanzados o futuros

### `Match.liveUrl`

Uso runtime actual:

- Servicios públicos leen `liveUrl` para indicar si hay enlace directo.
- El estado `LIVE` está permitido principalmente para Primer Equipo.

Clasificación: compatible.

Decisión:

- Mantener.
- No mostrar en cantera salvo reglas públicas ya definidas.

### `PlayerMatchStats.shotsOnTargetAgainst`

Uso runtime actual:

- Está en esquema y seed, pero no aparece como métrica pública principal actual.

Clasificación: candidato futuro.

Decisión:

- Mantener hasta revisar el modelo de porteros avanzado.
- No eliminar mientras `goalsAgainstPerMatch` y métricas de portero sigan vivas.

### `PlayerSeasonProfile.level`

Uso runtime actual:

- Es parte del perfil deportivo importable.
- No se expone como UI pública principal.

Clasificación: compatible futuro.

Decisión:

- Mantener hasta cerrar importación real y datos maestros de temporada.

## Capacidades fuera de interfaz MVP

No hay rutas activas en `src`/`server` para:

- `/admin/usuarios`
- `/admin/temporadas`
- `/admin/importaciones`

`AdminSectionKey` conserva claves históricas (`seasons`, `imports`, `users`, `settings`) para compatibilidad de tipos, pero `adminNavigation` solo incluye secciones activas y `canAccessAdminSection` permite únicamente esas secciones.

Clasificación: compatible de código, no UI.

Decisión:

- Mantener mientras sirva para tipos/compatibilidad.
- No crear placeholders ni accesos rápidos.
- Si se limpia, hacerlo en un refactor pequeño separado tras comprobar que no hay imports externos.

## Candidatos de limpieza futura

Antes de cualquier migración, ejecutar consultas de conteo equivalentes a:

```sql
SELECT role, COUNT(*) FROM users GROUP BY role;
SELECT COUNT(*) FROM coach_team_permissions;
SELECT type, COUNT(*) FROM media_assets GROUP BY type;
SELECT COUNT(*) FROM media_assets WHERE externalUrl IS NOT NULL;
SELECT COUNT(*) FROM import_batches;
SELECT COUNT(*) FROM import_batch_items;
SELECT COUNT(*) FROM players WHERE premiumCardMediaId IS NOT NULL;
```

Solo si los conteos y la decisión de producto lo permiten, valorar:

- simplificar `UserRole` a un único valor o reemplazarlo por un flag admin;
- eliminar `CoachTeamPermission`;
- eliminar tipos/campos de media no usados (`VIDEO_LINK`, `DOCUMENT`, `externalUrl`);
- endurecer `ImportBatchItem.status` a enum si el import real lo necesita;
- retirar claves históricas de `AdminSectionKey`.

