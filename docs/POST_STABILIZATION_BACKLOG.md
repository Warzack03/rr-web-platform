# Backlog posterior a estabilización

Última revisión: 29 de julio de 2026

Este documento recoge riesgos residuales y mejoras posteriores al plan de estabilización. No amplía el MVP; separa lo que queda pendiente de verificación real, operación o mejora futura.

## Pendiente antes de producción

- Completar el smoke manual de E.5 en Hostinger o staging con MySQL disponible.
- Confirmar Node 20 real en Hostinger.
- Ejecutar `npm run db:migrate:status` contra la base real antes y después de migraciones.
- Probar login, logout y protección de rutas admin en HTTPS.
- Probar CRUD representativo de equipos, jugadores, partidos, clasificaciones, estadísticas, media y noticias.
- Probar subida de imagen, reinicio de app y redeploy controlado conservando la misma URL `/media/...`.
- Confirmar cookies `Secure` en HTTPS.
- Confirmar headers de seguridad y `Cache-Control: no-store` en `/admin` y `/api`.
- Revisar logs de MySQL/pool con `DB_CONNECTION_LIMIT=5`.
- Identificar backup descargable de base de datos y archivos antes de migraciones/imports.

## Pendientes de la Fase D

- Completar D.4 — Rendimiento visual.
- Completar el cierre manual D.6 con revisión responsive/accesibilidad real y datos disponibles.

## Riesgos residuales aceptados para MVP

- El entorno local actual no tiene MySQL disponible; el build pasa, pero muestra timeouts esperados de pool durante generación de rutas estáticas.
- `git status` queda bloqueado en este entorno por `safe.directory`/propiedad del repositorio.
- `npm audit --omit=dev` está limpio, pero `npm audit` completo conserva deuda dev-only asociada a la cadena de ESLint/minimatch/brace-expansion.
- La persistencia definitiva de `UPLOAD_DIR` debe confirmarse tras redeploy real en Hostinger.
- La limpieza de `storage/media-trash` es manual en MVP.
- `sharp` está disponible por dependencias de Next/override, pero la conversión bajo carga real debe observarse en Hostinger.

## Mejoras posteriores candidatas

- Revisar imágenes admin con `<Image />` o una estrategia equivalente cuando se trabaje D.4.
- Mover fuentes a una estrategia recomendada por Next.js si se decide pulir el warning de lint.
- Automatizar un checklist de smoke contra staging cuando exista entorno estable.
- Añadir backups externos automatizados solo si el coste operativo se aprueba explícitamente.
- Añadir integraciones RFFM/municipales únicamente como trabajo futuro, no MVP.
- Añadir sincronización/imports más automatizados desde `rr-management` solo manteniendo diff preview y sin dependencia runtime.

## No objetivos mantenidos

- No ecommerce propio.
- No carrito, Stripe, pedidos ni cuentas de comprador en esta plataforma.
- No consumo runtime de APIs privadas de `rr-management`.
- No roles diferenciados de backoffice en MVP.
