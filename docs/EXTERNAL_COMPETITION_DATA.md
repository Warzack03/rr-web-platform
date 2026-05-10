# EXTERNAL_COMPETITION_DATA.md

## Objetivo

Registrar lo investigado sobre posibles fuentes externas para partidos y clasificaciones de Liga Municipal de Madrid y RFFM.

## Decision MVP

No depender de integraciones externas en MVP. Partidos, resultados y clasificaciones se gestionan manualmente.

## Ayuntamiento de Madrid / Juegos Deportivos Municipales

Existe un conjunto de datos publico del Ayuntamiento de Madrid sobre competiciones deportivas municipales de deportes colectivos en temporada vigente. La descripcion indica que permite obtener semanalmente informacion de partidos y clasificaciones y que esta disponible cada miercoles.

Esto hace viable estudiar una importacion futura basada en datos abiertos, especialmente para calendarios, resultados y clasificaciones municipales.

Riesgos:

- Hay que comprobar formato real, estabilidad, codigos de equipos y filtros necesarios.
- La actualizacion puede no ser inmediata tras cada jornada.
- Debe implementarse como importacion asistida, no como dependencia critica de runtime.

## RFFM

La RFFM publica buscadores web de resultados/jornadas y clasificaciones con parametros de temporada, tipo de juego, competicion, grupo y jornada. No se ha confirmado una API publica documentada para integracion directa.

Esto permite estudiar a futuro:

- consumo de paginas publicas si las condiciones de uso lo permiten.
- reverse engineering de llamadas internas si existen endpoints estables.
- importacion manual/asistida desde resultados publicados.

Riesgos:

- No hay garantia de API oficial publica.
- Scraping o endpoints no documentados pueden romperse.
- Debe evitarse depender de ello para la web publica en MVP.

## Regla de arquitectura futura

Si se anade automatizacion externa:

- Implementarla como importador/job admin.
- Guardar preview/diff antes de aplicar.
- Permitir correccion manual.
- No consultar fuentes externas en cada visita publica.
- Cachear resultados importados en la base propia.
