# Seguridad operativa

Última revisión: 28 de julio de 2026

## Alcance

Checklist operativo para publicar la app en Hostinger sin exponer el backoffice ni datos internos.

## HTTPS y cookies

Producción debe usar:

```env
NODE_ENV="production"
NEXTAUTH_URL="https://www.risingraimon.es"
NEXT_PUBLIC_SITE_URL="https://www.risingraimon.es"
AUTH_SECRET="valor-largo-y-aleatorio"
```

La configuración de auth falla al arrancar en producción si `AUTH_SECRET` no existe o si `NEXTAUTH_URL` no empieza por `https://`.

NextAuth se configura con `useSecureCookies` en producción. En local/desarrollo puede usar cookies no seguras para permitir `http://localhost`.

## Protección de `/admin`

- `/admin/login` es la única pantalla administrativa pública.
- Todo `/admin/(panel)` exige `requireAuthenticatedAdmin()` en layout.
- Cada página real del panel usa `requireAdminSectionAccess(...)`.
- Cada acción de servidor admin usa `requireAdminSectionAccess(...)`.
- La API `POST /api/admin/media` usa `getAuthenticatedAdmin()` y comprueba permiso de sección `media`.
- El callback del login solo acepta rutas locales bajo `/admin`.

Rutas admin MVP activas:

```text
/admin
/admin/partidos
/admin/clasificaciones
/admin/estadisticas
/admin/equipos
/admin/asignaciones
/admin/jugadores
/admin/media
/admin/noticias
```

## Headers

`next.config.ts` añade headers globales:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

Además, `/admin/:path*` y `/api/:path*` tienen:

```http
Cache-Control: no-store, max-age=0
```

No se añade una CSP estricta en este bloque porque el MVP permite imágenes públicas locales, URLs externas de vídeo y enlaces externos. Si se añade CSP más adelante, debe probarse con:

- imágenes de `MediaAsset`;
- portadas de noticia;
- vídeos externos enlazados o embebidos si se activan;
- login/admin;
- fuentes/estilos generados por Next.

## Subidas de media

Límites actuales:

- cuerpo multipart máximo: 10 MB;
- archivo de imagen máximo: 8 MB;
- formatos: PNG, JPEG, WebP, AVIF;
- SVG no aceptado como subida pública;
- límite de píxeles para `sharp`: 36.000.000;
- límites de dimensión/proporción por uso.

La API rechaza temprano cuerpos multipart superiores a 10 MB cuando `Content-Length` está disponible y después vuelve a validar el archivo real en servidor.

Smoke E.5:

1. Subir una imagen válida menor de 8 MB.
2. Intentar una imagen superior a 8 MB.
3. Intentar un SVG.
4. Intentar un archivo con MIME/extensión incoherente.
5. Confirmar que la UI muestra error claro y no queda registro huérfano.

## Errores de producción

La app usa estados `error.tsx` públicos/admin sin traza visible.

Las acciones/API administrativas usan mensajes seguros mediante `getSafeServerErrorMessage(...)`. El logger `logServerError(...)` filtra claves sensibles como:

- password;
- token;
- secret;
- credential;
- cookie;
- authorization;
- database_url;
- db_password.

No registrar payloads completos de importación, credenciales, variables de entorno ni URLs de conexión.

## Dependencias

Comando usado:

```bash
npm audit --omit=dev --audit-level=moderate
npm audit --audit-level=moderate
```

Resultado runtime tras E.4:

```text
found 0 vulnerabilities
```

Resultado total tras E.4:

- queda una vulnerabilidad dev-only en la cadena de ESLint/minimatch/brace-expansion;
- el fix automático propone `eslint@10.8.0` como cambio mayor;
- se probó un override directo de `brace-expansion`, pero rompe ESLint con `expand is not a function`;
- se acepta como deuda no-runtime para MVP y no bloquea Hostinger runtime.

Cambios aplicados:

- `next` actualizado a `16.2.12`;
- `next-auth` resuelto a `4.24.15`;
- `prisma` resuelto a `7.9.1`;
- overrides compatibles para `postcss 8.5.24`, `sharp 0.35.3` y `esbuild 0.28.1`.

Mantener `npm audit --omit=dev --audit-level=moderate` como comprobación previa a producción.

## Smoke manual previo a producción

1. Abrir `https://.../admin` sin sesión y confirmar redirección a `/admin/login`.
2. Hacer login con credenciales válidas.
3. Abrir cada ruta admin activa.
4. Hacer logout y confirmar que las rutas admin vuelven a exigir sesión.
5. Probar `POST /api/admin/media` sin sesión y esperar `401`.
6. Confirmar en navegador que cookies de sesión son `Secure` en HTTPS.
7. Confirmar headers con DevTools o `curl -I`:
   - `/`;
   - `/admin`;
   - `/api/auth/session`;
   - `/media/...`.
