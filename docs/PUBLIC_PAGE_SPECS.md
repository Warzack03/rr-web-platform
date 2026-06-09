# PUBLIC_PAGE_SPECS.md

Ver tambien `docs/PUBLIC_APP_SPEC.md`, que es la especificacion consolidada actual de la parte publica.

## Principios

- La web publica es un portal deportivo, no una landing infinita.
- Mobile-first, rapida, cacheada e indexable.
- Fondo oscuro, acento amarillo, tipografia deportiva, paneles rectangulares y radios pequenos.
- El Primer Equipo usa variante premium.
- Cantera/resto usa variante estandar, cuidada y consistente.
- Ocultar secciones sin datos en vez de mostrar bloques vacios.
- No copiar HTML literal de wireframes; reimplementar como componentes limpios.

## Home `/`

Objetivo: entrada/resumen del club.

Debe incluir:

- Hero de presentacion.
- CTA principal a proximo partido o Primer Equipo.
- Resumen del Primer Equipo.
- Proximo partido.
- Mini clasificacion.
- Ultimos resultados reutilizando patron del detalle del Primer Equipo.
- Actualidad/noticias recientes.
- Bloque cantera/equipos en lugar de alto rendimiento puro.

No incluir plantilla, calendario, clasificacion, noticias ni equipos completos.

## Primer Equipo `/primer-equipo`

Objetivo: resumen premium.

Debe incluir:

- Hero/fondo estadio.
- Chips de competicion/temporada.
- Titulo `PRIMER EQUIPO`.
- Entrenador visible.
- CTAs a plantilla/calendario/clasificacion.
- Proximo partido.
- Ultimos resultados.
- Actualidad del Primer Equipo.
- Posicion actual/resumen de clasificacion.
- Metricas rapidas.
- Maximo goleador.

No incluir plantilla completa, calendario completo ni clasificacion completa.

## Plantilla Primer Equipo `/primer-equipo/plantilla`

- Secciones: `PORTEROS` y `JUGADORES DE CAMPO`.
- Cromos premium construidos por capas en la web, no PNG final.
- Foto/base + dorsal + nombre + pais/bandera + posicion + stats + pie dominante.

## Calendario Primer Equipo `/primer-equipo/calendario`

- Filtros: Todos, En vivo, Jugados, Pendientes.
- Partidos por jornadas.
- Todas las filas usan el mismo diseno base tipo Jornada 2 del wireframe.
- Acciones enlazan a `/primer-equipo/partidos/[matchId]` cuando hay detalle.

## Clasificacion Primer Equipo `/primer-equipo/clasificacion`

- Tabla completa manual.
- Equipo propio destacado.
- Sin panel resumen superior de posicion/puntos.
- Mobile en cards compactas.

## Detalle partido Primer Equipo `/primer-equipo/partidos/[matchId]`

- Partido jugado: resultado, anotadores, minutos, highlights si hay URL, actuacion del equipo e iconos.
- Partido pendiente: previa sin marcador final ni anotadores.
- Highlights son exclusivos del Primer Equipo.

## Listado equipos `/equipos`

- Cabecera `NUESTROS EQUIPOS`.
- Bloque destacado Primer Equipo.
- Grid de cantera.
- Enlaces a detalles de equipo.
- No incluir calendarios/clasificaciones/plantillas completas.

## Detalle equipo cantera `/equipos/[teamSlug]`

- Resumen del equipo.
- CTAs a plantilla, calendario y clasificacion.
- Proximo partido, ultimos resultados, resumen clasificacion, resumen plantilla, metricas basicas y noticias relacionadas.
- No incluir contenidos completos.

## Plantilla cantera `/equipos/[teamSlug]/plantilla`

- Cromos generados por la web.
- Foto/placeholder, nombre, dorsal, posicion, pais/bandera, pie dominante, goles y asistencias.

## Calendario cantera `/equipos/[teamSlug]/calendario`

- Filtros: Todos, Jugados, Pendientes.
- No mostrar En vivo ni Aplazados.
- Aplazados se tratan como Pendientes.
- Acciones enlazan a `/equipos/[teamSlug]/partidos/[matchId]`.

## Clasificacion cantera `/equipos/[teamSlug]/clasificacion`

- Misma base que Primer Equipo.
- Tabla completa manual.
- Equipo propio destacado.
- Sin resumen superior.
- Mobile en cards.

## Detalle partido cantera `/equipos/[teamSlug]/partidos/[matchId]`

- Version simple del detalle de partido.
- Sin highlights, sin directo, sin stats avanzadas.
- Iconos basicos: gol, asistencia, amarilla, roja, MVP y porteria a cero si aplica.

## Detalle jugador Primer Equipo `/jugadores/[playerSlug]`

- Ficha premium.
- Stats avanzadas segun field/goalkeeper.
- Sin grafica radar fake; usar espacio para estadisticas/metricas.

## Detalle jugador cantera `/equipos/[teamSlug]/jugadores/[playerSlug]`

- Ficha mas simple.
- Stats reducidas.
- Sin tiros, tiros a puerta, recuperaciones ni paradas.

## Noticias `/noticias`

- Hero con noticia destacada.
- Categorias/filtros.
- Grid de noticias.
- Boton cargar/ver mas.
- Mantener fondo oscuro. No newsletter grande.

## Detalle noticia `/noticias/[slug]`

- Imagen principal, categoria, titulo, fecha, autor, contenido estructurado, citas, imagenes internas, links/referencias, relacionadas y compartir/copiar enlace.
- Preferir bloques estructurados a HTML libre.
