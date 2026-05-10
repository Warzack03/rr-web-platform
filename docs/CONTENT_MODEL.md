# CONTENT_MODEL.md

## Decision MVP

La nueva plataforma incluye noticias propias en MVP.

WordPress puede seguir existiendo para WooCommerce, pero las noticias nuevas de la web deportiva se gestionan dentro de la nueva plataforma.

## Campos de noticia

- id.
- title.
- slug.
- excerpt.
- body.
- coverImageUrl.
- status: draft/published.
- publishedAt.
- authorId.
- relatedTeamId opcional.
- featured.
- videoUrl opcional.

## Contenido multimedia

Una noticia puede contener:

- imagen de portada.
- imagenes embebidas o asociadas.
- links de video externos.

En MVP se permite almacenar links de video en vez de gestionar hosting de video propio.

## Reglas

- No crear ecommerce propio desde noticias.
- No usar datos privados de jugadores en noticias salvo que sean datos publicos.
- Las noticias publicadas deben tener metadata SEO basica.
- Si no hay editor rich text sencillo, se puede empezar con Markdown.
