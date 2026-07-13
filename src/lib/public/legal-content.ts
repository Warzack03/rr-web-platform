export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  orderedItems?: string[];
};

export type LegalDocument = {
  title: string;
  intro: string[];
  sections: LegalSection[];
};

export const privacyPolicyContent: LegalDocument = {
  title: "Politica de privacidad",
  intro: [
    "En Rising Raimon nos comprometemos a proteger y respetar tu privacidad. Esta politica explica como usamos la informacion personal que recopilamos cuando utilizas nuestro sitio web.",
  ],
  sections: [
    {
      title: "1. Informacion que recopilamos",
      items: [
        "Datos personales cuando te registras, inicias sesion, compras en la tienda o te suscribes a noticias, como nombre, correo electronico, direccion postal, telefono y datos de pago.",
        "Datos de uso sobre las paginas que visitas y los enlaces en los que haces clic.",
        "Datos de redes sociales si decides conectarte con nuestros perfiles sociales, segun las condiciones de cada plataforma.",
      ],
    },
    {
      title: "2. Uso de la informacion",
      paragraphs: ["Usamos tu informacion para:"],
      items: [
        "Procesar pedidos y gestionar tu cuenta.",
        "Enviarte actualizaciones sobre el equipo, noticias y eventos.",
        "Mejorar el sitio web y personalizar tu experiencia.",
        "Mejorar la capacidad y competencia del equipo.",
        "Cumplir obligaciones legales y regulatorias.",
      ],
    },
    {
      title: "3. Compartir informacion",
      paragraphs: [
        "Podemos compartir tu informacion con proveedores de servicios que nos ayudan a operar el sitio, procesar pagos y entregar productos, asi como con autoridades legales cuando sea requerido por ley o para proteger nuestros derechos.",
        "Si subes imagenes al sitio, evita incluir datos de localizacion incrustados, ya que otros visitantes podrian descargarlos y extraerlos.",
      ],
    },
    {
      title: "4. Seguridad de los datos",
      paragraphs: [
        "Aplicamos medidas de seguridad adecuadas para proteger la informacion personal frente a accesos no autorizados, alteraciones, divulgacion o destruccion.",
      ],
    },
    {
      title: "5. Tus derechos",
      paragraphs: [
        "Puedes acceder, corregir o eliminar tu informacion personal y darte de baja de nuestras comunicaciones de marketing en cualquier momento escribiendo a risingraimon@gmail.com.",
      ],
    },
    {
      title: "6. Cookies y tecnologias similares",
      paragraphs: [
        "Usamos cookies y tecnologias similares para mejorar tu experiencia. Puedes consultar los detalles en nuestra politica de cookies.",
      ],
    },
    {
      title: "7. Cambios en esta politica",
      paragraphs: [
        "Podemos actualizar esta politica periodicamente. Si hubiera cambios importantes, los comunicaremos a traves del sitio web o por correo electronico.",
      ],
    },
    {
      title: "8. Contenido incrustado de otras webs",
      paragraphs: [
        "Algunos articulos pueden incluir contenido incrustado como videos, imagenes o articulos externos. Ese contenido se comporta igual que si hubieras visitado directamente la web de origen y puede recopilar datos, usar cookies o realizar seguimiento adicional.",
      ],
    },
    {
      title: "9. Conservacion de datos",
      paragraphs: [
        "Los comentarios y sus metadatos pueden conservarse indefinidamente para facilitar la moderacion. Si existen usuarios registrados, almacenamos la informacion incluida en su perfil y cada usuario puede verla, editarla o borrarla, salvo el nombre de usuario. Los administradores tambien pueden gestionarla.",
      ],
    },
    {
      title: "10. Marketing",
      paragraphs: [
        "Al suscribirte a nuestros correos aceptas recibir informacion y comunicaciones promocionales relacionadas con Rising Raimon.",
      ],
    },
    {
      title: "11. Contacto",
      paragraphs: [
        "Si tienes dudas o inquietudes sobre esta politica de privacidad, puedes escribirnos a risingraimon@gmail.com.",
      ],
    },
  ],
};

export const cookiesPolicyContent: LegalDocument = {
  title: "Politica de cookies",
  intro: [
    "En Rising Raimon utilizamos cookies y tecnologias similares para mejorar tu experiencia. Al continuar navegando por este sitio, aceptas su uso en los terminos descritos en esta pagina.",
  ],
  sections: [
    {
      title: "Que son las cookies",
      paragraphs: [
        "Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Sirven para recordar preferencias, entender como se usa la web y mejorar futuras visitas.",
      ],
    },
    {
      title: "Tipos de cookies que utilizamos",
      orderedItems: [
        "Cookies esenciales: necesarias para el funcionamiento del sitio y para acciones como iniciar sesion o guardar preferencias de privacidad.",
        "Cookies de rendimiento: nos ayudan a medir trafico, visitas y comportamiento para mejorar el sitio.",
        "Cookies de funcionalidad: permiten personalizacion y funciones mejoradas del sitio.",
        "Cookies de publicidad: pueden ser usadas por socios publicitarios para mostrar anuncios mas relevantes en otros sitios.",
      ],
    },
    {
      title: "Gestion de cookies",
      paragraphs: [
        "Puedes configurar tu navegador para bloquear o avisar sobre estas cookies, aunque algunas partes del sitio podrian dejar de funcionar correctamente.",
        "Tambien puedes gestionar tus preferencias mediante la herramienta de gestion de cookies disponible en el sitio web.",
      ],
    },
    {
      title: "Cookies relacionadas con comentarios y acceso",
      paragraphs: [
        "Si dejas un comentario, puedes guardar nombre, correo electronico y sitio web en cookies durante un ano para no tener que volver a introducirlos.",
        "Si visitas la pagina de inicio de sesion, se crea una cookie temporal para comprobar si tu navegador acepta cookies. No contiene datos personales y desaparece al cerrar el navegador.",
        "Al iniciar sesion se crean cookies para guardar tus datos de acceso y tus opciones de visualizacion. Las de acceso duran dos dias y las de pantalla un ano. Si marcas Recordarme, el acceso se mantiene durante dos semanas. Al cerrar sesion, estas cookies se eliminan.",
        "Si editas o publicas un articulo, el navegador guarda una cookie adicional con el identificador del contenido editado. Caduca en un dia y no contiene datos personales.",
      ],
    },
    {
      title: "Cambios en el aviso de cookies",
      paragraphs: [
        "Podemos actualizar esta pagina ocasionalmente. Te recomendamos revisarla de forma periodica para mantenerte informado.",
      ],
    },
    {
      title: "Contacto",
      paragraphs: [
        "Si tienes cualquier duda sobre nuestro uso de cookies, puedes escribirnos a risingraimon@gmail.com.",
      ],
    },
  ],
};
