# Runbook de entrega y operación

Última revisión: 29 de julio de 2026

## Objetivo

Operar el MVP de Rising Raimon Web Platform en Hostinger Business con un flujo repetible de despliegue, backups, migraciones, verificación posterior y recuperación.

Este documento une:

- `docs/HOSTINGER_DEPLOYMENT.md`
- `docs/ENVIRONMENTS.md`
- `docs/DATABASE_MIGRATION_RUNBOOK.md`
- `docs/MEDIA_PERSISTENCE_DECISION.md`
- `docs/OPERATIONAL_SECURITY_CHECKS.md`
- `docs/POST_STABILIZATION_BACKLOG.md`

## Fuentes oficiales revisadas

- Hostinger Node.js Web App / GitHub deployment: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger backups de archivos y bases de datos: https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/

Puntos relevantes de Hostinger:

- Business Web Hosting soporta Node.js Web Apps.
- Hostinger soporta Next.js y Node.js 18, 20, 22 y 24.
- GitHub integration permite desplegar desde repositorio y activar builds automáticos.
- Los comandos npm de apps Node.js se gestionan desde hPanel/build settings; no asumir SSH libre para ejecutar comandos manuales.
- Business o superior tiene backups diarios. Los backups diarios tienen retención limitada y deben descargarse si se quieren conservar.

## Arquitectura operativa MVP

```text
www.risingraimon.es / risingraimon.es
└─ Hostinger Node.js Web App
   ├─ Next.js App Router
   ├─ Sports/public website
   ├─ /admin backoffice deportivo
   ├─ /media imágenes locales
   └─ Hostinger MySQL dedicado

tienda.risingraimon.es
└─ WordPress/WooCommerce existente

rr-management
└─ App interna separada, sin dependencia runtime
```

## Separaciones obligatorias

- La nueva web no ejecuta ecommerce, carrito, pagos, pedidos ni cuentas de comprador.
- WooCommerce mantiene tienda, productos, Stripe, pedidos y compradores.
- `rr-management` sigue siendo interno y no es backend runtime de la web pública.
- La nueva plataforma solo puede recibir snapshots/exportaciones revisadas de datos deportivos maestros.
- No conectar la web pública a APIs privadas de `rr-management`.
- No mezclar tablas MySQL de la nueva plataforma con WordPress/WooCommerce.

## Variables de producción

Configurar en hPanel Environment Variables:

```env
NODE_ENV="production"
DATABASE_URL="mysql://user:password@host:3306/database_name?connection_limit=5"
DB_HOST="host"
DB_PORT="3306"
DB_USER="user"
DB_PASSWORD="change-me"
DB_NAME="database_name"
DB_CONNECTION_LIMIT="5"
AUTH_SECRET="long-random-secret"
NEXTAUTH_URL="https://www.risingraimon.es"
NEXT_PUBLIC_SITE_URL="https://www.risingraimon.es"
UPLOAD_DIR="./public/media"
```

Setup-only/local-only:

```env
ADMIN_INITIAL_EMAIL=""
ADMIN_INITIAL_USERNAME=""
ADMIN_INITIAL_DISPLAY_NAME=""
ADMIN_INITIAL_PASSWORD=""
ENABLE_TEST_MANAGER="false"
INITIAL_LOAD_DOC_PATH=""
```

Reglas:

- `AUTH_SECRET` debe ser largo, aleatorio y no reutilizado.
- `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` deben usar HTTPS público.
- `DB_CONNECTION_LIMIT=5` inicialmente. No subir por encima de 10 sin medir.
- No copiar `.env` real al repositorio.
- No usar credenciales de WordPress ni `rr-management`.

## Despliegue desde GitHub a Hostinger

Flujo recomendado:

1. Confirmar que la rama a desplegar tiene build local correcto.
2. En hPanel, ir a Websites → Add Website o al dashboard del website Node.js.
3. Elegir Node.js Web App.
4. Elegir GitHub integration / Import Git Repository.
5. Autorizar GitHub si hPanel lo solicita.
6. Seleccionar el repositorio del proyecto.
7. Elegir la rama de despliegue.
8. Seleccionar framework Next.js si Hostinger lo detecta; si aparece como `Other`, configurar manualmente según hPanel:
   - build/output: `.next` cuando lo solicite;
   - start command: `npm run start`;
   - build command: `npm run build`.
9. Configurar variables de entorno antes del primer despliegue real.
10. Desplegar.
11. Abrir deployment logs y confirmar instalación/build correctos.
12. Ejecutar smoke posterior.

Si hPanel permite definir comandos separados:

```bash
npm ci
npm run build
npm run start
```

Si hPanel usa `npm install` en lugar de `npm ci`, aceptarlo para Hostinger y conservar `package-lock.json` como referencia de resolución.

## Migraciones en producción

Antes de aplicar migraciones:

1. Crear o identificar backup MySQL.
2. Validar en staging/copia cuando haya datos reales.
3. Ejecutar preflight:

```bash
npm run db:predeploy
npm run db:migrate:status
```

4. Aplicar:

```bash
npm run db:migrate:deploy
npm run db:migrate:status
```

Si Hostinger no permite ejecutar estos comandos manualmente en la app:

- Opción preferente: ejecutar migraciones desde una máquina controlada o CI con `DATABASE_URL` apuntando a Hostinger, siempre después de backup.
- Opción alternativa: incluir `npm run db:migrate:deploy` como paso explícito de despliegue solo si hPanel soporta ese flujo y los logs permiten auditarlo.

No usar:

```bash
prisma migrate dev
prisma migrate reset
prisma db push
```

Ver detalle completo en `docs/DATABASE_MIGRATION_RUNBOOK.md`.

## Backups

Antes de producción, migraciones, imports grandes o cambios de despliegue:

1. Descargar o identificar backup de archivos.
2. Descargar o identificar backup de base de datos.
3. Confirmar fecha/hora de ambos.
4. Guardarlos juntos si se necesita conservarlos más allá de la retención de Hostinger.

Según Hostinger, los backups descargados son:

- archivos: `.tar.gz`;
- bases de datos: `.sql.gz`.

Comprobar que el backup de archivos incluye:

- carpeta configurada en `UPLOAD_DIR`;
- `storage/media-trash`, si existe;
- `public/media` con media semilla;
- artefactos relevantes de la app si el backup es completo de hosting.

## Rollback

### Si falla el despliegue de código

1. Revisar logs de deployment en hPanel.
2. Volver a desplegar el commit anterior si es compatible con el esquema DB actual.
3. Si el esquema ya cambió y no es compatible, aplicar hotfix hacia delante.
4. Ejecutar smoke posterior.

### Si falla una migración o deja datos inconsistentes

1. Detener cambios de backoffice.
2. Restaurar backup MySQL previo.
3. Restaurar archivos si el cambio afectó media.
4. Desplegar versión compatible con ese backup.
5. Ejecutar smoke posterior.
6. Registrar causa antes de repetir.

### Si falla media

1. Confirmar que DB `media_assets` conserva metadata.
2. Restaurar `UPLOAD_DIR`.
3. Restaurar `storage/media-trash` si se necesita recuperar borrados.
4. Verificar `/admin/media`.
5. Verificar una portada de noticia, una foto de jugador y un logo/banner público.

## Comprobaciones posteriores a cada despliegue

Smoke mínimo:

```text
/
/equipos
/noticias
/primer-equipo
/primer-equipo/plantilla
/primer-equipo/calendario
/primer-equipo/clasificacion
/admin
/admin/login
/api/auth/session
/robots.txt
/sitemap.xml
```

Admin:

1. Abrir `/admin` sin sesión y confirmar login.
2. Iniciar sesión.
3. Abrir:
   - Panel;
   - Jornada;
   - Clasificaciones;
   - Estadísticas;
   - Equipos;
   - Plantilla;
   - Fichas y cromos;
   - Media;
   - Noticias.
4. Hacer logout.
5. Confirmar que una ruta admin vuelve a exigir sesión.

Contenido:

1. Crear o editar una noticia de prueba en staging.
2. Publicarla.
3. Verla en `/noticias`.
4. Archivarla.
5. Confirmar que desaparece de público.

Media:

1. Subir imagen válida menor de 8 MB.
2. Confirmar URL `/media/uploads/...`.
3. Reiniciar app.
4. Confirmar misma URL.
5. Hacer redeploy controlado.
6. Confirmar misma URL.

Seguridad:

1. Confirmar cookies `Secure` en HTTPS.
2. Confirmar headers:
   - `X-Content-Type-Options: nosniff`;
   - `X-Frame-Options: DENY`;
   - `Cache-Control: no-store` en `/admin` y `/api`.
3. Confirmar que `/api/admin/media` sin sesión devuelve `401`.

DB/pool:

1. Ejecutar o revisar `DB_CONNECTION_LIMIT=5`.
2. Abrir varias rutas públicas y admin.
3. Revisar logs por timeouts de pool.
4. No subir pool sin evidencia.

## Limitaciones aceptadas para MVP

- E.5 queda parcial hasta completar smoke real en Hostinger/staging.
- D.4 y cierre manual D.6 siguen pendientes por orden global.
- `npm audit` total conserva una deuda dev-only en ESLint/minimatch/brace-expansion; runtime audit está limpio.
- No hay integración automática RFFM/Municipal.
- No hay live sync con `rr-management`.
- No hay ecommerce propio.
- No hay cuentas de compradores.
- No hay roles UI diferenciados en backoffice.
- La persistencia local de media depende del smoke real de Hostinger; si falla, reabrir E.2 antes de producción.
- `sharp` está disponible por dependencias de Next y override, pero la conversión bajo carga real debe observarse en Hostinger.
- La limpieza definitiva de `storage/media-trash` es manual en MVP.
- No hay backup externo automatizado fuera de Hostinger en MVP.

Los riesgos residuales y mejoras posteriores se mantienen en `docs/POST_STABILIZATION_BACKLOG.md`.

## Criterio de go/no-go

Go si:

- build de Hostinger correcto;
- variables correctas;
- DB migrada o confirmada sin pendientes;
- smoke público/admin/media correcto;
- backups identificados;
- tienda y `rr-management` siguen separados.

No-go si:

- no hay backup DB identificable;
- `db:migrate:status` informa historial divergente;
- login admin falla;
- `/admin` queda accesible sin sesión;
- media subida desaparece tras restart/redeploy;
- aparecen errores de conexión MySQL persistentes en producción;
- se detecta dependencia runtime hacia WordPress/WooCommerce o `rr-management`.
