# Runbook de base de datos y migraciones

Última revisión: 28 de julio de 2026

## Objetivo

Aplicar cambios de esquema MySQL en Hostinger sin perder datos y con una ruta clara de recuperación.

Este runbook no autoriza migraciones destructivas. Cualquier cambio que elimine tablas, columnas o datos históricos requiere una tarea específica y confirmación explícita.

Fuentes Prisma revisadas:

- https://www.prisma.io/docs/cli/migrate/deploy
- https://www.prisma.io/docs/cli/migrate/status
- https://docs.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production

## Comandos del repo

```bash
npm run prisma:generate
npm run db:migrate:status
npm run db:predeploy
npm run db:migrate:deploy
```

`db:predeploy` ejecuta:

```bash
prisma validate && prisma generate
```

`db:migrate:deploy` ejecuta:

```bash
prisma migrate deploy
```

Según Prisma, `migrate deploy` aplica migraciones pendientes en staging/producción, pero no genera Prisma Client, no usa shadow database y no detecta drift completo. Por eso este repo ejecuta `validate` y `generate` como preflight separado.

`migrate status` se ejecuta aparte para inspección. Puede devolver código 1 cuando hay migraciones pendientes, historial divergente, migraciones fallidas o error de conexión; por eso no se encadena dentro de `db:predeploy`.

## Regla de oro

En producción y staging se usa:

```bash
npm run db:migrate:deploy
```

No usar en producción:

```bash
prisma migrate dev
prisma migrate reset
prisma db push
```

`migrate dev` es solo para desarrollo: puede crear migraciones nuevas y usa flujos pensados para detectar drift con base de desarrollo. `migrate reset` destruye datos. `db push` no deja historial de migraciones suficiente para producción.

## Antes de una migración de producción

1. Confirmar que el código desplegado contiene la carpeta `prisma/migrations`.
2. Confirmar que `DATABASE_URL` apunta a la base de producción correcta.
3. Confirmar que las variables runtime `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_CONNECTION_LIMIT` apuntan a la misma base.
4. Crear backup manual de MySQL desde hPanel o exportar la base.
5. Descargar o identificar el backup con fecha/hora.
6. Crear backup de archivos si el despliegue también cambia media, imports o assets.
7. Ejecutar las mismas migraciones en staging o en una copia reciente.
8. Ejecutar smoke mínimo contra staging/copia:
   - login admin;
   - home pública;
   - listado de equipos;
   - una noticia publicada;
   - una edición admin representativa.
9. Ejecutar `npm run db:predeploy` contra producción.
10. Ejecutar `npm run db:migrate:status` e interpretar el resultado: migraciones pendientes esperadas pueden continuar; historial divergente, migraciones fallidas o error de conexión bloquean.

Si cualquiera de estos pasos falla, no ejecutar `db:migrate:deploy`.

## Ensayo contra copia o staging

El ensayo recomendado es:

1. Restaurar un backup reciente de producción en una base MySQL separada.
2. Configurar una app staging o sesión temporal con `DATABASE_URL` y `DB_*` apuntando a esa copia.
3. Ejecutar:

```bash
npm run db:predeploy
npm run db:migrate:status
npm run db:migrate:deploy
npm run db:migrate:status
npm run build
```

4. Revisar que `db:migrate:status` no informa migraciones pendientes ni historial divergente.
5. Hacer smoke funcional antes de repetir en producción.

## Ejecución en producción

Ventana recomendada: baja actividad del club.

Pasos:

1. Confirmar backup manual MySQL recién creado.
2. Confirmar que el backup puede descargarse o identificarse por fecha/hora.
3. Parar temporalmente acciones de backoffice si hay varias personas editando.
4. Ejecutar:

```bash
npm run db:predeploy
npm run db:migrate:status
npm run db:migrate:deploy
npm run db:migrate:status
```

5. Desplegar o reiniciar la app si el cambio de código lo requiere.
6. Ejecutar smoke:
   - `/`;
   - `/equipos`;
   - `/noticias`;
   - `/admin/login`;
   - una pantalla admin real.

## Rollback de aplicación

Si falla el código pero la migración terminó correctamente:

1. Volver a desplegar la versión anterior de la app solo si esa versión es compatible con el esquema ya migrado.
2. Si la versión anterior no es compatible, aplicar un hotfix hacia delante.
3. Evitar tocar la base manualmente salvo que exista un plan SQL revisado.

Prisma Migrate no genera automáticamente migraciones inversas. El rollback seguro suele ser restaurar backup o avanzar con una migración/hotfix correctivo.

## Recuperación de base de datos

Si la migración deja la base en un estado no recuperable:

1. Poner la app en mantenimiento o detener el backoffice.
2. Restaurar el backup MySQL previo desde hPanel.
3. Restaurar archivos si el cambio también afectó media.
4. Desplegar la versión de aplicación compatible con ese backup.
5. Ejecutar smoke mínimo.
6. Registrar causa y no repetir la migración hasta corregirla en staging/copia.

## Señales de bloqueo

No continuar si:

- `db:migrate:status` informa historial divergente.
- Hay migraciones aplicadas en DB que no existen en el repo.
- Hay migraciones modificadas después de aplicarse.
- `DATABASE_URL` no puede confirmarse.
- No hay backup descargable o identificable.
- El ensayo en staging/copia falla.

## Notas para Hostinger

- Mantener `DB_CONNECTION_LIMIT=5` inicialmente.
- Mantener `prisma` como dependency de producción, no solo devDependency, para poder ejecutar `prisma migrate deploy` en Hostinger.
- No mezclar tablas con WordPress/WooCommerce.
- No ejecutar migraciones contra la base de `rr-management`.
