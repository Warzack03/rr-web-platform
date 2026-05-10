# PUBLIC_PAGE_SPECS.md

## Principios

- La web publica debe ser mobile-first, rapida, cacheada e indexable.
- El estilo debe seguir la referencia `inscripciones`: oscuro, profesional, juvenil, acento amarillo/azul, tarjetas glass, titulares grandes.
- El Primer Equipo tiene tratamiento premium.
- El resto de equipos tienen tratamiento estandar, pero cuidado y consistente.
- Ocultar secciones sin datos en vez de mostrar bloques vacios.

## Home `/`

Objetivo: presentar el club y dar acceso rapido a lo mas relevante.

Secciones MVP:

1. Hero principal.
   - Mensaje de club.
   - CTA a Primer Equipo.
   - CTA a Mis equipos.
   - CTA a Tienda.
2. Bloque Primer Equipo.
   - Proximo partido.
   - Ultimo resultado.
   - Resumen de clasificacion si existe.
3. Ultimas noticias.
4. Acceso a equipos.
5. Bloque tienda/enlace WooCommerce.
6. Redes/contacto.

## Primer Equipo `/primer-equipo`

Objetivo: pagina premium y mas completa.

Secciones:

- Hero premium con imagen/video si existe.
- Proximo partido.
- Ultimos resultados.
- Clasificacion.
- Plantilla.
- Cromos especiales.
- Estadisticas avanzadas.
- Videos asociados a partidos jugados si existen.
- Noticias relacionadas.

## Listado de equipos `/equipos`

Objetivo: mostrar todos los equipos visibles.

Secciones:

- Hero breve.
- Filtros/agrupacion por categoria si hay muchos equipos.
- Grid de tarjetas de equipo.
- Cada tarjeta enlaza a `/equipos/[teamSlug]`.

## Detalle de equipo `/equipos/[teamSlug]`

Objetivo: mostrar toda la informacion publica de un equipo.

Secciones comunes:

- Hero del equipo: nombre, categoria, temporada, competicion, entrenador, imagen/banner si existe.
- Resumen rapido: proximo partido, ultimo resultado, posicion, jugadores.
- Proximo partido.
- Ultimos resultados.
- Clasificacion manual.
- Plantilla.
- Cromos.
- Estadisticas.
- Noticias relacionadas si existen.

Variantes:

- Primer Equipo: variante premium, estadisticas ampliadas, cromos especiales y video en partidos `played` si existe.
- Resto: variante estandar, estadisticas simples y cromos normales.

## Noticias `/noticias` y `/noticias/[slug]`

MVP incluye noticias nuevas creadas en la plataforma, no solo enlaces a WordPress.

Una noticia puede contener:

- titulo.
- slug.
- extracto.
- cuerpo.
- imagen de portada.
- imagenes embebidas.
- enlaces a videos externos.
- fecha de publicacion.
- estado borrador/publicado.
- etiquetas opcionales, por ejemplo equipo relacionado.

No construir un CMS complejo en MVP; si el editor rich text complica demasiado, empezar con Markdown o campos simples.

## Tienda `/tienda`

La tienda no se reconstruye en MVP.

Regla:

- Enlazar o redirigir a WooCommerce.
- Mantener checkout/pagos/pedidos en WordPress/WooCommerce.
