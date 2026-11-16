# Traslados WK: landing page

Sitio estático de una sola página para Traslados WK, empresa de traslado de pacientes para ART en el norte y oeste del Gran Buenos Aires. Está hecho con HTML, CSS y JavaScript propios: sin frameworks, sin dependencias y sin paso de compilación.

## Cómo verlo y publicarlo

- **Local:** `python -m http.server 8080` (o `npx serve .`) dentro de la carpeta, y abrir `http://127.0.0.1:8080`. Hace falta un servidor porque el JavaScript usa módulos y no funciona abriendo el archivo con doble clic.
- **Publicar:** subir la carpeta a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages o un hosting compartido). `.taste-skill/` y `shots/` son archivos de trabajo: no se suben (están en `.gitignore`).

## Datos pendientes: `assets/js/site-config.js`

Un valor en `null` no se muestra. No hay datos de contacto inventados.

| Campo | Qué activa |
|---|---|
| `phone` + `phoneHref` | Teléfono en Contacto y en el footer (enlace `tel:`) |
| `whatsapp` (solo dígitos, ej. `5491100000000`) | Botón flotante, ítem en Contacto y en el footer, y el botón secundario del bloque bordó pasa a "Escribir por WhatsApp" |
| `email` | Correo en Contacto y en el footer; también es el destino del formulario si no hay endpoint |
| `formEndpoint` | Envío real del formulario (ver abajo) |
| `address` | Base operativa en Contacto |

Además: activar `<link rel="canonical">` en `index.html` cuando exista el dominio, y usar la URL absoluta en `og:image`. Los enlaces a políticas legales se agregarán cuando estén redactadas.

## Formulario

Valida en el navegador: nombre, empresa o ART, correo, teléfono (al menos 8 números) y mensaje. Los errores aparecen debajo de cada campo y el foco va al primero que haya que corregir. Según la configuración:

1. **Con `formEndpoint`** (Formspree, Getform, Basin o un backend propio que acepte `POST` con FormData): envía, muestra "Enviando…" y luego la confirmación o el error, sin perder lo escrito.
2. **Solo con `email`:** abre el programa de correo del visitante con la consulta armada.
3. **Sin nada configurado (estado actual):** no simula un envío. Informa que "El envío en línea todavía no está habilitado".

## Fotografías provisorias (Pexels)

Son fotos de stock con licencia libre (Pexels), listadas en `creditos.html`. No muestran a Traslados WK y conviene reemplazarlas por material propio. Para cambiar una, alcanza con sobrescribir el archivo en `assets/img/v2/` con el mismo nombre y una proporción parecida.

| Archivo | Dónde aparece | Ideal propio |
|---|---|---|
| `hero-*.jpg` | Portada | Un móvil de la empresa con su chofer |
| `asistencia-*.jpg` | Nosotros | Un chofer ayudando a un paciente a subir o bajar |
| `operadora-*.jpg` | Nosotros y Servicios | El centro de atención telefónico |
| `cuidado-*.jpg` | Diferenciales | Asistencia dentro del vehículo |
| `silla-*.jpg`, `puerta-*.jpg`, `paraguas-*.jpg` | Servicios | Pacientes, flota, chofer |
| `noche-*.jpg` | Fondo de Capacidad | Puede quedar |

**Clientes (sección "Trabajan con nosotros"):** Traspam, Gestion Integral, Pronto y Red de Traslados S.A. van como nombres tipográficos. Si conseguís sus logos oficiales (y permiso para usarlos), se reemplazan en la sección `#clientes` de `index.html`.

El logo es la insignia que pasaste, recortada en círculo (`logo-wk-*`). Para mayor nitidez conviene conseguir el original en PNG o SVG.

## Estructura

```
index.html               la página
creditos.html            créditos de las fotografías
share.jpg                imagen para compartir en redes
assets/css/styles.css    todos los estilos (variables de color y tipografía al inicio)
assets/js/main.js        menú, header, animaciones, contadores, mapa, formulario
assets/js/site-config.js DATOS DE LA EMPRESA
assets/img/              logo y fotos
```

## Diseño

- **Paleta:** navy profundo dominante (confianza, institución), bordó tomado del logo como único acento (botones principales y motivo de ruta), celeste como detalle sobre fondos oscuros.
- **Tipografía:** Archivo en versión ancha para títulos (solidez, logística) y Public Sans para el texto (legibilidad institucional).
- **Motivo:** una "ruta" punteada con origen y destino. Aparece en las etiquetas de sección, en la línea de trayectoria y en el mapa.
- **Secciones:** portada con foto a sangre, Nosotros (collage y trayectoria 3 móviles → +10 años → flota en expansión), Diferenciales, Servicios en tarjetas, Cobertura con mapa interactivo, Capacidad tipo dashboard, cierre comercial en bordó, Contacto y footer.
- **Mapa:** posiciones reales de la cabecera de cada partido, con la costa del río estilizada, sin límites políticos ni localidades agregadas.
- **Capacidad:** la cifra de 15 a 20 unidades está aclarada con una nota: depende del área operativa y no equivale a la flota permanente.
- **Animación:** entrada de la portada, aparición suave al hacer scroll, trayectoria y barras que se dibujan, contadores, pulso del mapa y estados de hover. Si el sistema pide movimiento reducido (`prefers-reduced-motion`), todo queda quieto y visible.

## Verificación

Probado en Edge headless con 30 pruebas: sin errores ni advertencias de consola, todos los enlaces llegan a su sección, menú móvil (abrir, Escape, cerrar al elegir), contadores, mapa, validación y estados del formulario, sin scroll horizontal entre 360 y 1920 px, botones de al menos 44 px en el teléfono y contenido visible con movimiento reducido. No se probó en Safari ni en dispositivos físicos.

La primera versión (más minimalista) quedó guardada en `.taste-skill/v1/index.html`, aunque sus estilos ya no existen.
