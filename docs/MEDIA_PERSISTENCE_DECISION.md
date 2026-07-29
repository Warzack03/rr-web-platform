# Decisión de persistencia de medios

Última revisión: 28 de julio de 2026

## Decisión MVP

El MVP mantiene las imágenes en el filesystem de Hostinger y guarda solo metadata en MySQL mediante `MediaAsset`.

No se integra S3, Cloudinary, R2 ni otro servicio externo de pago en esta fase. Si el smoke test real de Hostinger demuestra que las subidas se pierden en redeploy o no entran en backups recuperables, la alternativa será reabrir esta decisión antes de producción.

## Evidencia revisada

- Hostinger Business Web Hosting permite desplegar apps Node.js desde GitHub o por archivo, con versiones Node.js 18, 20, 22 y 24.
- En apps Node.js, Hostinger ubica los archivos de backend/build fuera de `public_html`, bajo una carpeta `nodejs` dentro del dominio.
- Hostinger documenta backups de archivos y backups de bases de datos descargables desde hPanel. En planes Business o superiores indica backups diarios.

Fuentes oficiales revisadas:

- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/
- https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/

## Implementación en el repo

Las URLs públicas se mantienen estables:

```text
/media/uploads/{uso}/{yyyy}/{mm}/{nombre-normalizado}-{uuid}.{extension}
```

La ruta lógica guardada en DB sigue siendo:

```text
public/media/uploads/{uso}/{yyyy}/{mm}/{archivo}
```

La raíz física se resuelve con `UPLOAD_DIR`:

```env
UPLOAD_DIR="./public/media"
```

Por defecto, local y producción guardan en `public/media`. Si durante el ensayo de despliegue se confirma que el directorio de la app puede ser reemplazado en redeploy, se debe configurar `UPLOAD_DIR` a una ruta absoluta estable dentro del hosting, por ejemplo:

```env
UPLOAD_DIR="/home/{usuario}/domains/{dominio}/media"
```

La ruta `/media/...` sirve los ficheros desde esa raíz configurable y conserva compatibilidad con ficheros estáticos existentes bajo `public/media`.

## Impacto del disco local en Hostinger

Ventajas:

- Coste adicional cero.
- Menos dependencias externas.
- Encaja con el volumen MVP esperado de imágenes de club.
- Los backups de archivos y DB se gestionan desde el mismo proveedor.

Riesgos:

- Hostinger no garantiza explícitamente en la documentación pública revisada que un fichero mutado en runtime dentro del directorio de la app sobreviva a todos los redeploys.
- La recuperación completa exige restaurar DB y ficheros de forma coordinada.
- Si se usa GitHub deployment, no se deben versionar subidas reales ni confiar en que Git restaure media generada por usuarios.
- La cuota e inodos del hosting deben vigilarse si se suben muchas imágenes sin limpieza.

Mitigación aplicada:

- `UPLOAD_DIR` permite separar las subidas del directorio de despliegue sin cambiar URLs ni metadata.
- El borrado real no destruye al instante: mueve el archivo a `storage/media-trash` y marca `deletedAt`.
- Los nombres incluyen UUID, por lo que pueden cachearse de forma agresiva.
- Los vídeos siguen siendo URLs externas, no ficheros alojados.

## Alternativa externa

Solo se considerará si falla el smoke test de persistencia/backup en Hostinger.

Coste de una alternativa externa:

- Nueva cuenta/proveedor y posible coste mensual.
- Variables, credenciales y permisos nuevos.
- Adaptador de subida, borrado y serving.
- Mayor superficie de errores y dependencia operativa.

Para el MVP, ese coste no compensa mientras Hostinger filesystem cumpla persistencia y recuperación suficientes.

## Copia y backup

Antes de migraciones, imports grandes o cambios de despliegue:

1. Descargar backup de MySQL desde hPanel o exportar la base.
2. Descargar backup de archivos del hosting.
3. Confirmar que el backup contiene:
   - la carpeta configurada en `UPLOAD_DIR`;
   - `storage/media-trash`, si existe;
   - ficheros semilla bajo `public/media`, si se usan.
4. Guardar juntos el backup DB y el backup de archivos de la misma fecha.

No basta con hacer backup de MySQL: `MediaAsset` solo contiene metadata y URL pública.

## Restauración

Para restaurar medios:

1. Restaurar primero los archivos de `UPLOAD_DIR`.
2. Restaurar `storage/media-trash` si se necesita recuperar borrados recientes.
3. Restaurar MySQL con la tabla `media_assets` y sus relaciones.
4. Verificar en backoffice `/admin/media` que las imágenes cargan.
5. Verificar en público una portada de noticia, una foto de jugador y un logo/banner de equipo.

Si se restaura DB sin archivos, las páginas podrán conservar referencias rotas. Si se restauran archivos sin DB, el backoffice no sabrá que existen.

## Eliminación

- Una imagen enlazada no puede eliminarse desde el backoffice.
- Una imagen sin referencias se mueve a `storage/media-trash/...` y se marca `deletedAt`.
- La limpieza definitiva de `storage/media-trash` será manual en MVP.
- Antes de vaciar la papelera, comprobar que existe un backup de archivos posterior al borrado y que no se necesita rollback.

## Smoke test obligatorio en E.5

Antes de producción, ejecutar en Hostinger:

1. Configurar `UPLOAD_DIR`.
2. Subir una imagen desde `/admin/media`.
3. Verificar que la URL `/media/uploads/...` carga.
4. Reiniciar la app Node.js y volver a verificar.
5. Hacer un redeploy controlado desde GitHub o ZIP y volver a verificar.
6. Descargar un backup de archivos o inspeccionar el árbol respaldado para confirmar que incluye la carpeta configurada.

Si cualquiera de los pasos 3-6 falla, no se considera cerrada la persistencia local y debe reabrirse la decisión antes de producción.
