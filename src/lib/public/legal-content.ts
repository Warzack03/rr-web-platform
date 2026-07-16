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
    "En Rising Raimon protegemos tu privacidad y limitamos la informacion que tratamos a lo necesario para mantener la web publica y el backoffice deportivo.",
  ],
  sections: [
    {
      title: "1. Informacion que recopilamos",
      items: [
        "Datos deportivos y publicos necesarios para mostrar equipos, jugadores, partidos, clasificaciones, estadisticas, noticias y media del club.",
        "Datos de acceso del usuario interno autorizado cuando se utiliza el backoffice.",
        "Datos tecnicos basicos que el servidor puede registrar por seguridad y funcionamiento, como direccion IP, fecha, navegador o ruta solicitada.",
        "Datos que nos envies voluntariamente por correo electronico u otros canales de contacto.",
      ],
    },
    {
      title: "2. Uso de la informacion",
      paragraphs: ["Usamos tu informacion para:"],
      items: [
        "Publicar y mantener informacion deportiva del club.",
        "Gestionar el acceso seguro al backoffice interno.",
        "Responder a mensajes o solicitudes recibidas.",
        "Proteger el sitio frente a accesos no autorizados, abuso o errores tecnicos.",
        "Cumplir obligaciones legales y regulatorias.",
      ],
    },
    {
      title: "3. Compartir informacion",
      paragraphs: [
        "No vendemos datos personales ni los cedemos para publicidad comportamental.",
        "Podemos compartir informacion con proveedores tecnicos necesarios para alojar, mantener y proteger la web, y con autoridades cuando exista una obligacion legal.",
        "La tienda, los productos, el carrito, los pagos y las cuentas de comprador se gestionan fuera de esta plataforma, en el entorno WordPress/WooCommerce del club.",
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
        "Puedes solicitar acceso, rectificacion, supresion, oposicion o limitacion del tratamiento de tus datos escribiendo a risingraimon@gmail.com.",
      ],
    },
    {
      title: "6. Cookies y tecnologias similares",
      paragraphs: [
        "Actualmente no usamos cookies de analitica, publicidad comportamental ni seguimiento en la web publica. La plataforma puede usar cookies tecnicas necesarias para funciones como el acceso seguro al backoffice. Puedes consultar los detalles en nuestra politica de cookies.",
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
        "Algunas noticias o paginas pueden enlazar o, en el futuro, incrustar contenido externo como videos. Si se incrusta contenido de terceros, ese proveedor puede tratar datos o usar cookies segun sus propias condiciones.",
      ],
    },
    {
      title: "9. Conservacion de datos",
      paragraphs: [
        "Conservamos la informacion durante el tiempo necesario para mantener la web, el historico deportivo, la seguridad del servicio y las obligaciones legales aplicables.",
      ],
    },
    {
      title: "10. Patrocinadores y publicidad",
      paragraphs: [
        "La web puede mostrar patrocinadores o espacios publicitarios directos del club. Estos espacios se muestran como contenido propio y no implican por si mismos cookies publicitarias, perfilado ni seguimiento individual.",
        "Si en el futuro se incorporan redes publicitarias, analitica o publicidad personalizada, actualizaremos esta politica y solicitaremos el consentimiento que corresponda antes de activar esas tecnologias.",
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
    "Actualmente la web publica de Rising Raimon no utiliza cookies de analitica, publicidad comportamental ni seguimiento. Solo pueden utilizarse cookies tecnicas necesarias para el funcionamiento seguro de la plataforma.",
  ],
  sections: [
    {
      title: "Que son las cookies",
      paragraphs: [
        "Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Sirven para recordar preferencias, entender como se usa la web y mejorar futuras visitas.",
      ],
    },
    {
      title: "Cookies que podemos utilizar",
      orderedItems: [
        "Cookies tecnicas necesarias: pueden utilizarse para iniciar sesion en el backoffice, mantener la seguridad, recordar una accion solicitada por el usuario o permitir funciones basicas del sitio.",
        "Registros tecnicos del servidor: pueden recoger informacion basica de funcionamiento y seguridad, como fecha, ruta solicitada, navegador o direccion IP.",
      ],
    },
    {
      title: "Cookies que no utilizamos actualmente",
      items: [
        "No usamos cookies de analitica para medir el comportamiento individual de visitantes.",
        "No usamos cookies de publicidad comportamental ni creamos perfiles publicitarios.",
        "No usamos cookies de redes publicitarias de terceros en la web publica.",
      ],
    },
    {
      title: "Patrocinadores directos",
      paragraphs: [
        "La web puede mostrar logos, menciones o enlaces de patrocinadores del club. Estos espacios se muestran como contenido propio y no usan cookies publicitarias ni seguimiento individual por si mismos.",
        "Si haces clic en un enlace externo de un patrocinador, pasaras a una web ajena a Rising Raimon. Esa web puede tener sus propias politicas de privacidad y cookies.",
      ],
    },
    {
      title: "Gestion desde el navegador",
      paragraphs: [
        "Puedes configurar tu navegador para bloquear o avisar sobre cookies. Si bloqueas cookies tecnicas, algunas funciones necesarias, como el acceso al backoffice, podrian dejar de funcionar correctamente.",
      ],
    },
    {
      title: "Futuros cambios",
      paragraphs: [
        "Si en el futuro incorporamos analitica, redes publicitarias, publicidad personalizada o cualquier tecnologia no necesaria, actualizaremos esta politica y mostraremos un mecanismo de consentimiento antes de activarla.",
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
