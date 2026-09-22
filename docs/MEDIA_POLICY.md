# MEDIA_POLICY.md

## Tipos de media

- logo/escudo de equipo.
- imagen de listado de equipo (3:2 recomendado).
- banner hero de equipo.
- foto de jugador.
- cromo de jugador.
- retrato de jugador para estadisticas (cara y pecho).
- imagen de noticia.
- videoUrl externo.

## Reglas

- No alojar videos propios en Hostinger en MVP; usar enlaces externos.
- Alojar imagenes MVP en filesystem de Hostinger con metadata en `MediaAsset`.
- Mantener URLs publicas bajo `/media/...` aunque `UPLOAD_DIR` apunte a una ruta persistente distinta.
- Optimizar imagenes antes de servirlas publicamente.
- Preferir WebP/AVIF si es viable.
- Guardar alt text siempre que sea posible.
- Evitar imagenes enormes sin comprimir.
- Separar la imagen 3:2 del listado de equipos del banner panoramico del hero.
- El Primer Equipo puede tener cromos especiales.
- El resto de equipos usa cromos estandar.
- La foto de detalle, la imagen del cromo y el retrato de estadisticas son recursos independientes.

## Primer Equipo

- Puede tener diseño de cromo especial.
- Puede mostrar video asociado a partido `played`.
- Puede usar hero con imagen/video/link mas destacado.

## Resto de equipos

- Cromo estandar.
- Foto, nombre publico, dorsal, posicion y stats basicas.
