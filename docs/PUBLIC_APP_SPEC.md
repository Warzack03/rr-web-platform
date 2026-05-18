# PUBLIC_APP_SPEC.md

## Estado

Esta es la especificacion consolidada de la parte publica de Rising Raimon. Se considera suficientemente definida a nivel funcional, visual y de navegacion. Queda pendiente conectar datos reales, imagenes reales, SEO final y estados de carga/error.

## Principios publicos

- La parte publica es un portal deportivo, no una landing infinita.
- Cada seccion importante tiene su propia ruta.
- La home es resumen/entrada, no contiene toda la app.
- Mantener lenguaje visual oscuro, deportivo, sobrio, con acento amarillo.
- Usar paneles rectangulares, radios pequenos, grids claros, poco copy y mucho aire vertical.
- El wireframe/screen visual manda sobre DESIGN.md/code.html cuando haya conflicto.
- Reutilizar componentes entre pantallas. No duplicar si puede parametrizarse.
- Mobile debe ser usable. Desktop no debe degradarse si ya esta validado.
- Header y footer publicos se mantienen salvo ajustes minimos de navegacion.
- Videos son URLs externas. Imagenes son archivos/URLs, no BLOBs.

## Rutas publicas cerradas

```text
/
/primer-equipo
/primer-equipo/plantilla
/primer-equipo/calendario
/primer-equipo/clasificacion
/primer-equipo/partidos/[matchId]
/equipos
/equipos/[teamSlug]
/equipos/[teamSlug]/plantilla
/equipos/[teamSlug]/calendario
/equipos/[teamSlug]/clasificacion
/equipos/[teamSlug]/partidos/[matchId]
/equipos/[teamSlug]/jugadores/[playerSlug]
/jugadores/[playerSlug]
/noticias
/noticias/[slug]
```

La tienda queda fuera de la app y se enlaza a `tienda.risingraimon.es`.

## Home `/`

Objetivo: entrada/resumen del club.

Debe mostrar:

- Hero de presentacion del club con fondo oscuro/estadio.
- CTA principal a proximo partido o Primer Equipo.
- Bloque resumen del Primer Equipo.
- Proximo partido del Primer Equipo.
- Mini clasificacion del Primer Equipo, no tabla completa.
- Ultimos resultados usando el patron del detalle del Primer Equipo.
- Actualidad/noticias recientes.
- Bloque de cantera/equipos en lugar de alto rendimiento puro.
- Enlaces a `/primer-equipo`, `/equipos`, `/noticias` y tienda externa.

No debe mostrar:

- Plantilla completa.
- Calendario completo.
- Clasificacion completa.
- Todas las noticias.
- Todos los equipos.

## Primer Equipo `/primer-equipo`

Objetivo: pagina resumen premium del Primer Equipo.

Debe seguir el wireframe de Primer Equipo:

- Header publico compacto.
- Hero/fondo tipo estadio.
- Chips pequenos de competicion y temporada.
- Titulo dominante `PRIMER EQUIPO`.
- Entrenador visible.
- CTAs a plantilla, calendario y clasificacion si procede.
- Grid principal de dos columnas en desktop.
- Columna izquierda: proximo partido, ultimos resultados, actualidad del Primer Equipo.
- Columna derecha: posicion actual/resumen de clasificacion, metricas rapidas y maximo goleador.

Reglas:

- Es resumen, no contiene plantilla completa, calendario completo ni clasificacion completa.
- Enlaza a `/primer-equipo/plantilla`, `/primer-equipo/calendario` y `/primer-equipo/clasificacion`.
- Puede mostrar video asociado solo como preview/enlace si existe.

## Plantilla Primer Equipo `/primer-equipo/plantilla`

Objetivo: pagina de cromos/plantilla premium del Primer Equipo.

Debe mostrar:

- Titulo `PLANTILLA - PRIMER EQUIPO`.
- Seccion `PORTEROS`.
- Seccion `JUGADORES DE CAMPO`.
- Grid de cromos.

Decision cerrada sobre cromos:

- El cromo del Primer Equipo se construye en la web por capas/componentes.
- No es un PNG completo ya montado.
- La foto/base del jugador es una capa.
- Dorsal, nombre, pais/bandera, posicion, stats y pie dominante son texto/UI renderizados.
- Debe poder actualizarse sin reemplazar toda la imagen.
- Incluir indicador de pie dominante si es razonable: izquierdo/derecho, marcando el activo.

Datos del cromo:

- Foto/base.
- Dorsal.
- Nombre publico.
- Posicion.
- Pais/bandera.
- Pie dominante.
- Goles.
- Asistencias.
- Stats especificas segun tipo.

## Calendario Primer Equipo `/primer-equipo/calendario`

Objetivo: calendario/listado de partidos del Primer Equipo.

Debe mostrar:

- Titulo `CALENDARIO DE PARTIDOS`.
- Subtitulo con equipo y temporada.
- Filtros: `Todos`, `En vivo`, `Jugados`, `Pendientes`.
- Partidos agrupados por jornadas.
- Todas las filas de partido usan el mismo diseno base, tomando como referencia la Jornada 2 del wireframe.

Estados:

- Jugado.
- En vivo.
- Pendiente.
- Aplazado puede existir tecnicamente, pero si se muestra puede tratarse como pendiente segun contexto.

Acciones:

- Jugado: `Ver resumen` -> `/primer-equipo/partidos/[matchId]`.
- Pendiente: `Vista previa` -> `/primer-equipo/partidos/[matchId]`.
- En vivo: `Seguir directo` puede enlazar al detalle o futura vista live.

## Detalle partido Primer Equipo `/primer-equipo/partidos/[matchId]`

Objetivo: detalle de partido jugado o previa de partido pendiente.

Para partido jugado debe mostrar:

- Panel principal con marcador grande.
- Equipo local y visitante.
- Logos/placeholders.
- Campo, competicion/jornada y estado.
- Anotadores y minutos del Rising Raimon.
- Anotadores del rival si se conocen; si no, no romper UI ni mostrar placeholders feos.
- Link a mejores momentos/highlights si existe.
- Seccion `ACTUACION DEL EQUIPO` con jugadores que participaron.
- Iconos por jugador: goles, asistencias, amarilla, roja, MVP, porteria a cero si aplica, goles en propia, multiplicadores x2/x3.

Para partido pendiente debe mostrar:

- Rival, fecha, hora, campo, competicion, jornada, local/visitante.
- No mostrar marcador final, anotadores ni actuacion si no hay datos.

Reglas:

- Highlights son exclusivos del Primer Equipo.
- Los eventos del mock/datos deben cuadrar con el marcador.
- Si el portero encaja gol, no mostrar porteria a cero.

## Clasificacion Primer Equipo `/primer-equipo/clasificacion`

Objetivo: clasificacion completa manual del Primer Equipo.

Debe mostrar:

- Cabecera sencilla de pagina.
- Tabla completa en desktop.
- Cards compactas en mobile.
- Equipo propio destacado.
- Ultima actualizacion si existe.
- Enlaces discretos a equipo, calendario y plantilla.

No debe mostrar:

- Panel/resumen superior de posicion/puntos. Ese resumen ya vive en el detalle del equipo.

Columnas:

- Posicion.
- Equipo.
- PJ.
- G.
- E.
- P.
- GF.
- GC.
- DG.
- Pts.

La clasificacion se edita manualmente. No se calcula a partir de partidos.

## Listado de equipos `/equipos`

Objetivo: indice de estructura deportiva.

Debe mostrar:

- Cabecera centrada `NUESTROS EQUIPOS`.
- Seccion `PRIMER EQUIPO` destacada.
- Bloque horizontal: imagen/visual a la izquierda, panel informativo a la derecha.
- CTAs a plantilla y calendario del Primer Equipo.
- Seccion `CANTERA`.
- Grid de equipos de cantera.
- Tarjetas para Raimon B, Juvenil A, Juvenil B, Cadete A, Infantil A u otros mocks.
- Bloque final tipo `Futuro Raimon` si encaja.

No debe mostrar calendarios, clasificaciones ni plantillas completas.

## Detalle equipo cantera `/equipos/[teamSlug]`

Objetivo: resumen publico de un equipo que no es Primer Equipo.

Debe reutilizar el lenguaje visual de `/primer-equipo`, pero en variante mas ligera.

Debe mostrar:

- Nombre del equipo.
- Categoria.
- Temporada.
- Competicion.
- Entrenadores visibles.
- CTAs a plantilla, calendario y clasificacion.
- Proximo partido.
- Ultimos resultados.
- Resumen de clasificacion.
- Resumen de plantilla, no plantilla completa.
- Metricas basicas.
- Noticias relacionadas si existen.

No debe mostrar:

- Plantilla completa.
- Calendario completo.
- Clasificacion completa.
- Estadisticas avanzadas del Primer Equipo.
- Highlights.

## Plantilla cantera `/equipos/[teamSlug]/plantilla`

Objetivo: plantilla/cromos estandar del equipo.

Debe mostrar cromos generados por la web, no PNG final.

Cada cromo debe incluir:

- Foto o placeholder.
- Nombre.
- Dorsal.
- Posicion.
- Pais/bandera.
- Pie dominante.
- Goles.
- Asistencias.

La version cantera es mas simple que Primer Equipo.

## Calendario cantera `/equipos/[teamSlug]/calendario`

Objetivo: calendario especifico por equipo de cantera.

Debe reutilizar `MatchRow` del calendario del Primer Equipo.

Filtros:

- Todos.
- Jugados.
- Pendientes.

No mostrar:

- Filtro `En vivo`.
- Filtro `Aplazados`.
- Accion `Seguir directo`.

Regla de aplazados:

- En cantera, un partido aplazado se trata visual y funcionalmente como pendiente.
- Badge principal: `Pendiente`.
- Texto secundario opcional: fecha por confirmar / pendiente de nueva fecha.

Acciones:

- Jugado: `Ver resultado` o `Ver resumen` -> `/equipos/[teamSlug]/partidos/[matchId]`.
- Pendiente: `Vista previa` -> `/equipos/[teamSlug]/partidos/[matchId]`.

## Detalle partido cantera `/equipos/[teamSlug]/partidos/[matchId]`

Objetivo: detalle simple de partido de cantera.

Debe reutilizar la base del detalle de partido del Primer Equipo, pero con flags:

- `teamType = academy`.
- `showHighlights = false`.
- `showAdvancedEvents = false`.
- `showLiveFeatures = false`.

Debe mostrar:

- Resultado o previa.
- Anotadores propios si se conocen.
- Anotadores rivales opcionales; pueden estar vacios.
- Actuacion basica del equipo si jugado.
- Iconos basicos: gol, asistencia, amarilla, roja, MVP, porteria a cero si aplica.

No debe mostrar:

- Highlights.
- Mejoras momentos.
- Directo.
- Stats avanzadas.

## Clasificacion cantera `/equipos/[teamSlug]/clasificacion`

Misma base que `/primer-equipo/clasificacion`.

Debe mostrar tabla completa manual con equipo propio destacado.

No debe mostrar panel resumen superior de posicion/puntos.

En mobile usar cards compactas.

## Detalle jugador Primer Equipo `/jugadores/[playerSlug]`

Objetivo: ficha premium del jugador del Primer Equipo.

Debe servir para jugador de campo y portero.

Estructura:

- Hero con dorsal, posicion, nombre, pais/bandera e imagen.
- Seccion `RENDIMIENTO TECNICO`.
- Stats base segun tipo.
- Metricas derivadas utiles.
- CTA tienda externo si procede.

Decision sobre grafica tactica/radar:

- No replicar la grafica si no hay datos reales.
- Usar ese espacio para mas estadisticas y metricas.

Stats Primer Equipo jugador de campo:

- Partidos jugados.
- Goles.
- Asistencias.
- Tarjetas amarillas.
- Tarjetas rojas.
- Recuperaciones.
- Tiros.
- Tiros a puerta.
- Goles en propia puerta.
- MVP's.

Stats Primer Equipo portero:

- Partidos jugados.
- Goles.
- Asistencias.
- Tarjetas amarillas.
- Tarjetas rojas.
- Imbatidos.
- Paradas.
- Goles en propia puerta.
- MVP's.

Metricas derivadas:

- Participaciones de gol = goles + asistencias.
- Goles por partido.
- Asistencias por partido.
- Participaciones por partido.
- Precision de tiro si hay tiros y tiros a puerta.
- Tiros por partido.
- Paradas por partido.
- Ratio de imbatidos.

## Detalle jugador cantera `/equipos/[teamSlug]/jugadores/[playerSlug]`

Objetivo: ficha simple del jugador de cantera/resto.

Puede reutilizar componentes del detalle del Primer Equipo con:

- `teamType = academy`.
- `statsLevel = basic`.

Stats cantera jugador de campo:

- Partidos jugados.
- Goles.
- Asistencias.
- Tarjetas amarillas.
- Tarjetas rojas.
- Goles en propia puerta.
- MVP's.

Stats cantera portero:

- Partidos jugados.
- Goles.
- Asistencias.
- Tarjetas amarillas.
- Tarjetas rojas.
- Imbatidos.
- Goles en propia puerta.
- MVP's.

No mostrar:

- Recuperaciones.
- Tiros.
- Tiros a puerta.
- Paradas.
- Grafica radar.
- CTA tienda obligatoria.

## Noticias `/noticias`

Objetivo: centro publico de noticias.

Debe mostrar:

- Hero con noticia destacada.
- Categorias/filtros compactos.
- Grid de noticias.
- Boton cargar/ver mas.

No debe mostrar:

- Fondo blanco del wireframe.
- Newsletter grande.

Categorias sugeridas:

- Todas.
- Cronicas.
- Club.
- Cantera.
- Entrevistas.

## Detalle noticia `/noticias/[slug]`

Objetivo: lectura completa de noticia.

Debe mostrar:

- Volver a noticias.
- Layout dos columnas desktop: contenido + relacionadas.
- Imagen principal.
- Categoria.
- Titulo.
- Fecha.
- Autor.
- Contenido estructurado.
- Links/referencias dentro del contenido.
- Citas destacadas.
- Imagenes internas.
- Noticias relacionadas.
- Acciones discretas de compartir/copiar enlace.

Links y referencias:

- Deben verse bien.
- No deben romper layout.
- Preferir contenido como bloques estructurados mock: paragraph, heading, quote, image, link.
- Evitar `dangerouslySetInnerHTML` salvo sanitizacion.

No implementar newsletter, comentarios ni integraciones externas.

## Estados y fallbacks publicos

- Si un equipo no tiene jugadores, mostrar `Plantilla pendiente` o CTA neutro.
- Si no hay clasificacion, mostrar `Clasificacion pendiente`.
- Si no hay proximo partido, priorizar ultimos resultados o mensaje neutro.
- Si un jugador no tiene foto, usar placeholder.
- Si no hay anotadores del rival, ocultar esa lista sin romper layout.
- Si no hay highlights, ocultar boton.
- Si no hay noticias relacionadas, ocultar bloque.

## Responsive publico

- Sin overflow horizontal.
- Header usable en mobile.
- Footer usable en mobile.
- Paneles apilados en mobile.
- Tablas grandes pasan a cards compactas o scroll controlado.
- Cromos legibles.
- CTAs tactiles.
