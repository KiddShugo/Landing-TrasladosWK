/*
  Datos comerciales de Traslados WK: el único archivo a editar cuando lleguen los datos oficiales.
  Un valor en null no se muestra en la página (no hay teléfono, WhatsApp ni correo inventados).

  - phone:        teléfono visible, tal como se quiere mostrar. Ej.: "11 0000-0000"
  - phoneHref:    el mismo número para el enlace tel:, sin espacios. Ej.: "+541100000000"
  - whatsapp:     número para wa.me, solo dígitos con código de país. Ej.: "5491100000000"
  - email:        correo de contacto. Ej.: "contacto@dominio.com.ar"
  - formEndpoint: URL del servicio que recibe el formulario (Formspree, Getform, un backend propio...).
                  Con endpoint, el formulario envía por fetch y muestra la confirmación.
                  Sin endpoint, usa mailto: hacia `email` (abre el programa de correo del visitante).
  - address:      calle y localidad/partido de la base operativa, si se quiere publicar.
  - social:       { instagram: "https://...", facebook: "https://...", linkedin: "https://..." }
*/
export const SITE = {
  name: 'Traslados WK',
  phone: null,
  phoneHref: null,
  whatsapp: null,
  whatsappMessage: 'Hola, quisiera información sobre traslados de pacientes para ART.',
  email: null,
  formEndpoint: null,
  address: null,
  social: {},
};
