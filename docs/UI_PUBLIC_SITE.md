# UI_PUBLIC_SITE.md

## Objetivo visual

La web publica de Rising Raimon debe transmitir un aspecto profesional, moderno y juvenil. La referencia principal de estilo es la landing `inscripciones` ya existente, especialmente por su uso de fondos oscuros con gradientes, tarjetas glassmorphism, titulares grandes, botones redondeados y acentos amarillo/azul.

## Referencia de estilo

La referencia CSS existente define estos tokens visuales base:

```css
--bg: #071629;
--bg-soft: #0c2341;
--surface: rgba(8, 23, 43, 0.85);
--surface-strong: rgba(7, 19, 34, 0.92);
--surface-light: rgba(255, 255, 255, 0.08);
--text: #eef4ff;
--muted: #bfd0e8;
--accent: #f3cb45;
--accent-2: #3470c8;
--accent-3: #d64045;
--border: rgba(255, 255, 255, 0.12);
--radius-xl: 32px;
--radius-lg: 22px;
--radius-md: 16px;
--radius-sm: 12px;
--font-display: "Bebas Neue", sans-serif;
--font-body: "Barlow", sans-serif;
--max-width: 1180px;
```

Codex debe traducir estos tokens a Tailwind/theme CSS variables o a una capa global `app/globals.css`.

## Personalidad visual

- Profesional, pero no corporativa/fria.
- Juvenil, deportiva y dinamica.
- Mobile-first.
- Alto contraste.
- Fondos oscuros con brillos radiales y acentos en amarillo.
- Tarjetas con bordes suaves, sombras y fondos translucidos.
- Titulares grandes, condensados y con personalidad.
- CTAs tipo pastilla, con radio completo.
- No usar estetica generica de dashboard para la web publica.

## Estructura publica esperada

### Home

Debe incluir, como minimo:

1. Hero principal.
   - Mensaje de club.
   - CTA a Primer Equipo.
   - CTA a Mis equipos.
   - CTA a Tienda.
2. Bloque destacado del Primer Equipo.
   - Proximo partido.
   - Ultimo resultado.
   - Posicion/clasificacion resumida si existe.
3. Bloque de ultimas noticias o comunicados.
4. Acceso visual a todos los equipos.
5. Bloque de tienda/enlace a WooCommerce.
6. Redes/contacto.

### Primer Equipo

Debe ser la seccion mas completa y cuidada.

Debe incluir:

- Cabecera hero propia.
- Datos del equipo.
- Proximo partido.
- Ultimos resultados.
- Clasificacion.
- Plantilla.
- Cromos especiales de jugadores.
- Estadisticas detalladas.
- Fichas de jugador con detalle mas completo.

### Mis equipos

Pagina de listado de todos los equipos del club.

Debe incluir:

- Filtros o agrupacion por categoria si hay muchos equipos.
- Tarjeta por equipo.
- Enlace al detalle de cada equipo.
- Indicar temporada y competicion si aplica.

### Detalle de equipo

Para todos los equipos.

Debe incluir:

- Hero o cabecera del equipo.
- Plantilla.
- Cromos sencillos.
- Partidos/resultados.
- Clasificacion.
- Estadisticas basicas.

El Primer Equipo puede usar una variante visual mas especial y avanzada.

### Cromos

Hay dos niveles:

1. Cromo especial del Primer Equipo.
   - Mas visual.
   - Mejor jerarquia.
   - Estadisticas ampliadas.
   - Foto protagonista.
   - Posibilidad de estilo coleccionable.

2. Cromo normal del resto de equipos.
   - Mas simple.
   - Nombre, dorsal, posicion, foto y stats basicas.

## Navegacion publica inicial

- Inicio
- Primer Equipo
- Mis equipos
- Noticias
- Tienda
- Contacto / Redes

La tienda inicialmente puede enlazar a WooCommerce, no debe reconstruirse en la nueva plataforma.

## Componentes UI prioritarios

- SiteHeader responsive.
- Mobile navigation.
- HeroSection.
- SectionHeading.
- SportCard.
- TeamCard.
- PlayerCard.
- SpecialFirstTeamPlayerCard.
- MatchCard.
- StandingTable.
- StatsTable.
- NewsCard.
- CTAButton.
- EmptyState.
- LoadingState.

## Responsive

La web debe estar pensada primero para movil.

Reglas:

- No tablas horizontales rotas en movil; usar scroll controlado o tarjetas resumidas.
- Cromos en grid responsive.
- Header movil limpio.
- CTAs a ancho completo en pantallas pequenas.
- Evitar layouts de tres columnas en movil.

## Tipografia

Usar preferentemente:

- Display: Bebas Neue o equivalente si se decide no cargar fuente externa.
- Body: Barlow o equivalente.

Si las fuentes externas comprometen rendimiento o simplicidad, se debe documentar la alternativa.

## Colores

Base:

- Fondo principal: azul noche oscuro.
- Superficies: azul/negro translucido.
- Texto principal: blanco azulado.
- Texto secundario: azul claro apagado.
- Acento principal: amarillo.
- Acento secundario: azul.
- Acento de alerta/derrota/error: rojo.

## No hacer

- No copiar el CSS literalmente sin adaptarlo al stack.
- No usar una plantilla generica de club sin personalidad.
- No priorizar escritorio sobre movil.
- No usar el estilo del panel admin para la web publica.
