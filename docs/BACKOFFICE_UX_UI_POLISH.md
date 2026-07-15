# BACKOFFICE_UX_UI_POLISH.md

## Objetivo

Cerrar la fase actual del backoffice con una capa final de pulido visual y de coherencia, sin reabrir cambios estructurales grandes.

Este documento sirve para:

- rematar la experiencia movil y desktop
- unificar pequenos detalles visuales y de lenguaje
- reducir ruido residual en modulos ya bastante maduros
- aplicar mejoras rapidas sin mezclar arquitectura ni nuevas funcionalidades

## Como usar este documento

- Marca cada tarea aplicada con `[x]`
- Deja pendientes con `[ ]`
- Si algo ya no compensa hacerlo, anotalo en `Notas`
- No abras una nueva fase grande hasta completar o descartar este bloque

- Aplicado reforzando `Solo consulta` en cabecera y panel de alcance de `Mi equipo`, y ajustando CTAs del entrenador hacia `Abrir` o `Consultar` modulos en lugar de sonar a gestion global.

---

## Bloque 1 - Topbar movil

### Objetivo

Reducir saturacion visual en movil y hacer mas legible el contexto activo.

### Checklist

- [x] Reducir numero de chips visibles simultaneas en movil
- [x] Priorizar solo `rol` y `equipo` cuando no quepa todo
- [x] Hacer que `vista de prueba` pese menos visualmente que el contexto real
- [x] Revisar que el bloque superior no empuje demasiado el contenido operativo hacia abajo

### Notas

- En movil, la topbar debe informar sin sentirse como una segunda cabecera compleja.
- Aplicado compactando chips, ocultando `Temporada` y usuario en movil, suavizando `Vista previa` y reduciendo peso del bloque derecho.

---

## Bloque 2 - Modulos de vista previa

### Objetivo

Mantener visibles los modulos de alcance, pero sin competir con los modulos operativos.

### Checklist

- [x] Bajar contraste visual del grupo `Vista previa` en sidebar desktop
- [x] Bajar contraste visual del grupo `Vista previa` en menu movil
- [x] Valorar si conviene colapsar visualmente ese grupo o dejarlo mas compacto
- [x] Comprobar que el usuario entiende que esas rutas no son flujos completos

### Notas

- La idea no es ocultarlos por completo, sino dejar claro que no son el siguiente paso natural de trabajo.
- Aplicado manteniendo el grupo visible pero mas compacto y con menos contraste; se descarta colapsarlo de momento para no introducir una capa extra de interaccion.

---

## Bloque 3 - Lenguaje de estado

### Objetivo

Unificar como se comunica que algo esta en modo mock, preview o validacion.

### Checklist

- [x] Revisar mensajes que contienen `mock`
- [x] Revisar mensajes que contienen `preview` o `vista previa`
- [x] Revisar mensajes que contienen `guardado local`
- [x] Sustituir variaciones innecesarias por 1 o 2 patrones de texto consistentes

### Patron recomendado

- `Vista previa`: para modulos no terminados
- `Guardado local de prueba`: para acciones que no persisten en datos reales

### Notas

- Evitar mezclar `mock`, `preview`, `seed`, `local` y `prueba` con demasiado protagonismo en la UI.
- Aplicado unificando etiquetas, banners, formularios y estados visibles bajo dos patrones: `Vista previa` y `Guardado local de prueba`, reemplazando referencias visibles a `mock`, `preview` y `seed`.

---

## Bloque 4 - Dashboard manager y superadmin

### Objetivo

Reducir un poco la densidad del dashboard sin cambiar su estructura actual.

### Checklist

- [x] Revisar si hay demasiado contenido visible above the fold
- [x] Compactar paddings o alturas de cards secundarias si hace falta
- [x] Asegurar que `Bandeja de trabajo` siga ganando claramente a metricas y bloques secundarios
- [x] Confirmar que la lectura del dashboard funciona en 10 segundos o menos

### Notas

- Este bloque es de compactacion, no de rediseño.

- Aplicado compactando `Atajos del dia`, metricas y panels secundarios, reduciendo padding y altura visual en cards de seguimiento para que `Bandeja de trabajo` mantenga el protagonismo inicial.

---

## Bloque 5 - Coach en Mi equipo

### Objetivo

Reforzar todavia mas la sensacion de consulta y no de gestion.

### Checklist

- [x] Valorar una etiqueta mas visible de `Solo consulta` en la card o cabecera
- [x] Revisar si algun CTA secundario sigue sonando a edicion global
- [x] Confirmar que el coach entiende rapido que desde aqui solo consulta contexto y salta a otros modulos

### Notas

- Si hay duda entre “explicar mas” o “senalizar mejor”, priorizar senalizacion mejor.

---

## Criterio de cierre

- [ ] El panel se siente rematado, no solo funcional
- [ ] Movil queda limpio y con menos saturacion contextual
- [ ] Los modulos preview no compiten con los operativos
- [ ] El lenguaje de estado se percibe coherente
- [ ] No se ha reabierto una fase grande de cambios

---

## Recomendacion final

Si este documento queda completado, el siguiente paso no deberia ser otra ronda general de UX/UI, sino una de estas dos:

1. convertir un modulo de `Vista previa` en flujo real
2. pasar a QA funcional y de responsive con criterio de release interna
