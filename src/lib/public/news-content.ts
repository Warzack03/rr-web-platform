export const NEWS_CATEGORY_LABELS = [
  "Todas",
  "Cronica",
  "Club",
  "Cantera",
  "Entrevista",
] as const;

export type PublicNewsCategory = Exclude<(typeof NEWS_CATEGORY_LABELS)[number], "Todas">;

export type PublicNewsImageTone =
  | "stadium-night"
  | "locker-room"
  | "academy-surge"
  | "press-room"
  | "training-ground"
  | "crowd-lights";

export type PublicNewsArticleImage = {
  tone: PublicNewsImageTone;
  alt: string;
  caption?: string;
};

export type PublicNewsParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type PublicNewsHeadingBlock = {
  type: "heading";
  text: string;
};

export type PublicNewsQuoteBlock = {
  type: "quote";
  text: string;
  attribution?: string;
};

export type PublicNewsImageBlock = {
  type: "image";
  image: PublicNewsArticleImage;
};

export type PublicNewsImageGridBlock = {
  type: "imageGrid";
  images: PublicNewsArticleImage[];
};

export type PublicNewsLinkBlock = {
  type: "link";
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type PublicNewsContentBlock =
  | PublicNewsParagraphBlock
  | PublicNewsHeadingBlock
  | PublicNewsQuoteBlock
  | PublicNewsImageBlock
  | PublicNewsImageGridBlock
  | PublicNewsLinkBlock;

export type PublicNewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: PublicNewsCategory;
  date: string;
  dateLabel: string;
  author: string;
  imageTone: PublicNewsImageTone;
  coverImageAlt: string;
  featured: boolean;
  relatedTeam?: string;
  relatedTeams?: string[];
  badge?: string;
  relatedSlugs?: string[];
  content: PublicNewsContentBlock[];
};

const paragraph = (text: string): PublicNewsParagraphBlock => ({
  type: "paragraph",
  text,
});

const heading = (text: string): PublicNewsHeadingBlock => ({
  type: "heading",
  text,
});

const quote = (text: string, attribution?: string): PublicNewsQuoteBlock => ({
  type: "quote",
  text,
  attribution,
});

const image = (
  tone: PublicNewsImageTone,
  alt: string,
  caption?: string,
): PublicNewsImageBlock => ({
  type: "image",
  image: {
    tone,
    alt,
    caption,
  },
});

const imageGrid = (...images: PublicNewsArticleImage[]): PublicNewsImageGridBlock => ({
  type: "imageGrid",
  images,
});

const linkReference = (
  label: string,
  href: string,
  description?: string,
  external = true,
): PublicNewsLinkBlock => ({
  type: "link",
  label,
  href,
  description,
  external,
});

export const PUBLIC_NEWS_ARTICLES: PublicNewsArticle[] = [
  {
    slug: "rising-raimon-conquista-el-campeonato-regional",
    title: "Rising Raimon conquista el campeonato regional en un final dramatico",
    excerpt:
      "Un gol en el tramo final premio la energia del equipo y cerro una noche grande bajo las luces del estadio.",
    category: "Cronica",
    date: "2026-05-18",
    dateLabel: "18 MAY 2026",
    author: "Media Team",
    imageTone: "stadium-night",
    coverImageAlt: "Jugador de Rising Raimon golpeando el balon en un estadio iluminado.",
    featured: true,
    relatedTeam: "Primer Equipo",
    badge: "Breaking news",
    relatedSlugs: [
      "jude-sharp-el-grupo-ha-ganado-madurez",
      "nueva-zona-de-rendimiento-para-la-academia",
    ],
    content: [
      paragraph(
        "En una final que exigio cabeza fria y piernas vivas, Rising Raimon encontro el premio en el tramo mas delicado del partido. El equipo sostuvo la tension desde la primera accion, entendio cuando acelerar y cuando enfriar el ritmo, y acabo levantando una noche que ya forma parte del relato competitivo del club.",
      ),
      paragraph(
        "La atmosfera del estadio empujo durante noventa minutos, pero el grupo no se dejo arrastrar por el ruido. Ordeno cada presion, achico espacios entre lineas y logro que el rival viviera lejos de las zonas en las que acostumbra a crecer.",
      ),
      heading("Una lectura de partido muy precisa"),
      paragraph(
        "El plan se construyo desde la disciplina. La primera linea salto con agresividad medida, el mediocampo corrigio alturas con mucha velocidad y la ultima linea protegio bien la espalda en cada cambio de orientacion. El equipo no solo compitio bien: supo interpretar los momentos de la final.",
      ),
      quote(
        "No fue solo una victoria. Fue una declaracion de identidad. El equipo trabajo cada detalle con conviccion y respondio como un bloque en el escenario mas exigente.",
        "Coach Evans",
      ),
      paragraph(
        "El primer gol nacio tras una recuperacion alta y una circulacion limpia hacia el costado debil. En el segundo tiempo, cuando el rival encontro mas presencia cerca del area, Raimon se sostuvo con una fase defensiva mas madura y con una gestion emocional mucho mas estable que en citas anteriores.",
      ),
      imageGrid(
        {
          tone: "training-ground",
          alt: "Balon entrando en contacto con una bota en una jugada de alta intensidad.",
          caption: "El equipo mantuvo su agresividad en cada duelo dividido.",
        },
        {
          tone: "crowd-lights",
          alt: "Jugador con el dorsal nueve mirando al estadio antes del tramo final.",
          caption: "La recta final se jugo con personalidad y sin perder la estructura.",
        },
      ),
      heading("Gestion emocional en el tramo final"),
      paragraph(
        "Cuando el rival empato y el partido amenazo con romperse, el banquillo ordeno al bloque y priorizo el siguiente control. Esa pausa resulto decisiva. Lejos de precipitarse, Rising Raimon eligio bien donde atacar y encontro el espacio exterior desde el que llego la accion definitiva.",
      ),
      linkReference(
        "Ver informe de partido",
        "https://example.com/rising-raimon/final-regional",
        "Referencia externa de ejemplo con datos y secuencias de presion del partido.",
      ),
      image(
        "press-room",
        "Sala de analisis del club con paneles y luces de trabajo.",
        "La preparacion previa puso el foco en reducir recepciones interiores del rival.",
      ),
      heading("El cierre que define una temporada"),
      paragraph(
        "El gol del triunfo desato la celebracion, pero tambien confirmo una tendencia: este equipo ha aprendido a sostener su identidad incluso cuando el contexto aprieta. La final deja un titulo y, sobre todo, la sensacion de que la estructura deportiva llega al siguiente tramo del proyecto con una madurez mucho mas clara.",
      ),
    ],
  },
  {
    slug: "preparacion-intensa-para-el-derbi",
    title: "Preparacion intensa para el derbi en el Estadio Raimon",
    excerpt:
      "La semana se ha centrado en ajustar alturas de presion, ritmo de circulacion y detalles de area antes del duelo clave.",
    category: "Club",
    date: "2026-05-14",
    dateLabel: "14 MAY 2026",
    author: "Media Team",
    imageTone: "locker-room",
    coverImageAlt: "Vestuario del club preparado antes de una sesion de trabajo.",
    featured: false,
    relatedTeam: "Primer Equipo",
    relatedSlugs: [
      "rising-raimon-conquista-el-campeonato-regional",
      "tactical-masterclass-asegura-el-pase-a-semifinales",
    ],
    content: [
      paragraph(
        "La semana previa al derbi se ha construido con mucho detalle. El cuerpo tecnico ha dividido la carga entre sesiones de campo, trabajo de video y ajustes especificos en las situaciones de area para que el equipo llegue con energia y claridad competitiva.",
      ),
      heading("Presion y ritmo"),
      paragraph(
        "La prioridad ha sido sostener la agresividad sin perder orden. El grupo insiste en temporizar mejor los saltos exteriores y en acelerar la circulacion cuando el rival protege demasiado por dentro.",
      ),
      quote(
        "La idea no cambia, pero el contexto pide precision. Queremos un equipo reconocible desde el primer minuto.",
        "Staff tecnico",
      ),
      image(
        "locker-room",
        "Pizarras tacticas y camisetas preparadas en el vestuario del primer equipo.",
        "El trabajo previo ha estado muy orientado a la organizacion de alturas.",
      ),
      linkReference(
        "Agenda de la semana",
        "https://example.com/rising-raimon/agenda-derbi",
        "Referencia externa de ejemplo con la planificacion previa al partido.",
      ),
    ],
  },
  {
    slug: "juvenil-a-acelera-su-crecimiento",
    title: "El Juvenil A acelera su crecimiento antes del tramo final",
    excerpt:
      "La cantera firma otra semana de ritmo alto y sigue consolidando automatismos con una plantilla cada vez mas reconocible.",
    category: "Cantera",
    date: "2026-05-12",
    dateLabel: "12 MAY 2026",
    author: "Academy Desk",
    imageTone: "academy-surge",
    coverImageAlt: "Sesiones de cantera con ambiente de crecimiento competitivo.",
    featured: false,
    relatedTeam: "Juvenil A",
    relatedSlugs: [
      "cadete-a-firma-una-semana-perfecta",
      "nueva-zona-de-rendimiento-para-la-academia",
    ],
    content: [
      paragraph(
        "El Juvenil A atraviesa un tramo de consolidacion muy interesante. El equipo ha mejorado sus registros colectivos en salida de balon, ha reducido errores no forzados y llega al cierre del curso con una identidad mucho mas reconocible.",
      ),
      heading("Automatismos cada vez mas claros"),
      paragraph(
        "La plantilla ha ganado continuidad en la ocupacion de pasillos interiores y en la defensa tras perdida. Ese equilibrio esta permitiendo competir mejor sin perder el foco en el desarrollo individual.",
      ),
      imageGrid(
        {
          tone: "academy-surge",
          alt: "Escena de entrenamiento de cantera con mucha intensidad fisica.",
          caption: "La velocidad de ejecucion ha sido una de las mejoras mas visibles.",
        },
        {
          tone: "training-ground",
          alt: "Trabajo de campo con referencias tacticas y cambios de orientacion.",
          caption: "El equipo sostiene mejor las distancias entre lineas.",
        },
      ),
      linkReference(
        "Resumen de cantera",
        "https://example.com/rising-raimon/juvenil-a-resumen",
        "Referencia de ejemplo con el seguimiento semanal del Juvenil A.",
      ),
    ],
  },
  {
    slug: "jude-sharp-el-grupo-ha-ganado-madurez",
    title: 'Jude Sharp: "El grupo ha ganado madurez competitiva"',
    excerpt:
      "El tecnico valora la respuesta del filial en los momentos de maxima exigencia y la capacidad del equipo para sostenerse sin balon.",
    category: "Entrevista",
    date: "2026-05-10",
    dateLabel: "10 MAY 2026",
    author: "Media Team",
    imageTone: "press-room",
    coverImageAlt: "Entorno de entrevista con atmosfera sobria y foco en el entrenador.",
    featured: false,
    relatedTeam: "Raimon B",
    relatedSlugs: [
      "celia-hills-la-identidad-del-club-tambien-se-entrena",
      "rising-raimon-conquista-el-campeonato-regional",
    ],
    content: [
      paragraph(
        "Jude Sharp analiza el momento del filial con una idea clara: el crecimiento del equipo se explica tanto por los resultados como por su estabilidad en escenarios complejos. El tecnico insiste en que la madurez real aparece cuando el grupo sabe competir tambien sin dominar.",
      ),
      quote(
        "El equipo entiende mejor los tiempos del partido. Ahora sabe cuando apretar, cuando ordenar y cuando proteger lo que ha construido.",
        "Jude Sharp",
      ),
      heading("El siguiente paso"),
      paragraph(
        "La entrevista pone el foco en sostener la personalidad del equipo fuera de casa y en convertir la mejora emocional en una ventaja permanente durante la proxima temporada.",
      ),
      linkReference(
        "Entrevista completa",
        "https://example.com/rising-raimon/jude-sharp-entrevista",
        "Referencia externa de ejemplo con la conversacion ampliada.",
      ),
    ],
  },
  {
    slug: "tactical-masterclass-asegura-el-pase-a-semifinales",
    title: "Tactical masterclass asegura el pase a semifinales",
    excerpt:
      "Rising Raimon controlo alturas, cerro carriles interiores y golpeo en los momentos exactos para avanzar con autoridad.",
    category: "Cronica",
    date: "2026-05-08",
    dateLabel: "08 MAY 2026",
    author: "Media Team",
    imageTone: "training-ground",
    coverImageAlt: "Escena de partido con gran carga tactica y control de espacios.",
    featured: false,
    relatedTeam: "Primer Equipo",
    relatedSlugs: [
      "rising-raimon-conquista-el-campeonato-regional",
      "preparacion-intensa-para-el-derbi",
    ],
    content: [
      paragraph(
        "Rising Raimon interpreto la eliminatoria con mucha limpieza. El equipo redujo la influencia rival en los carriles interiores y supo acelerar justo despues de cada recuperacion util.",
      ),
      heading("Un partido controlado desde la estructura"),
      paragraph(
        "Las coberturas exteriores, la vigilancia sobre el mediapunta y la altura del pivote marcaron una actuacion muy sobria en ambas fases del juego.",
      ),
      image(
        "training-ground",
        "Situacion de partido con lineas compactas y referencias tacticas claras.",
        "El bloque compitio con distancias cortas y mucha coordinacion.",
      ),
      linkReference(
        "Secuencias destacadas",
        "https://example.com/rising-raimon/semifinales-secuencias",
        "Referencia de ejemplo con varias acciones analizadas.",
      ),
    ],
  },
  {
    slug: "nueva-zona-de-rendimiento-para-la-academia",
    title: "Nueva zona de rendimiento para la academia",
    excerpt:
      "El club presenta un nuevo espacio de trabajo orientado a fuerza, prevencion y seguimiento de cargas para los equipos de formacion.",
    category: "Club",
    date: "2026-05-05",
    dateLabel: "05 MAY 2026",
    author: "Club Office",
    imageTone: "locker-room",
    coverImageAlt: "Nuevo espacio de trabajo fisico dentro de la estructura de academia.",
    featured: false,
    relatedTeam: "Academia",
    relatedSlugs: [
      "juvenil-a-acelera-su-crecimiento",
      "cadete-a-firma-una-semana-perfecta",
    ],
    content: [
      paragraph(
        "La academia incorpora una nueva zona de rendimiento pensada para ordenar mejor el trabajo de fuerza, prevencion y seguimiento de cargas. El objetivo es dar soporte diario a tecnicos y jugadores sin complicar la operativa habitual.",
      ),
      heading("Una mejora al servicio del dia a dia"),
      paragraph(
        "El espacio permite encajar mejor los tiempos de activacion, control de carga y trabajo complementario alrededor de cada sesion de campo.",
      ),
      image(
        "locker-room",
        "Espacio de rendimiento con equipamiento y una atmosfera sobria.",
        "La nueva zona se integra en la rutina semanal de los equipos de formacion.",
      ),
      linkReference(
        "Ficha del espacio",
        "https://example.com/rising-raimon/zona-rendimiento",
        "Referencia de ejemplo con el planteamiento funcional de la nueva zona.",
      ),
    ],
  },
  {
    slug: "cadete-a-firma-una-semana-perfecta",
    title: "Cadete A firma una semana perfecta en casa",
    excerpt:
      "El bloque resolvio sus dos compromisos con ritmo, agresividad tras perdida y una respuesta coral en los metros finales.",
    category: "Cantera",
    date: "2026-05-03",
    dateLabel: "03 MAY 2026",
    author: "Academy Desk",
    imageTone: "crowd-lights",
    coverImageAlt: "Escenario competitivo de cantera con celebracion sobria y luces de estadio.",
    featured: false,
    relatedTeam: "Cadete A",
    relatedSlugs: [
      "juvenil-a-acelera-su-crecimiento",
      "nueva-zona-de-rendimiento-para-la-academia",
    ],
    content: [
      paragraph(
        "El Cadete A completo una semana redonda en casa gracias a una presion coordinada, una mejor ocupacion del area y una respuesta muy coral en los metros finales.",
      ),
      quote(
        "Lo mejor no fue solo ganar, sino la forma en la que el equipo sostuvo su idea en dos contextos diferentes.",
        "Staff de cantera",
      ),
      heading("Energia y continuidad"),
      paragraph(
        "La sensacion que deja la semana es la de un grupo cada vez mas consistente, capaz de mantener su plan tanto con ventaja como en tramos mas cerrados.",
      ),
    ],
  },
  {
    slug: "celia-hills-la-identidad-del-club-tambien-se-entrena",
    title: 'Celia Hills: "La identidad del club tambien se entrena"',
    excerpt:
      "La coordinadora insiste en que los detalles del dia a dia tambien construyen la forma de competir y representar al club.",
    category: "Entrevista",
    date: "2026-05-01",
    dateLabel: "01 MAY 2026",
    author: "Media Team",
    imageTone: "press-room",
    coverImageAlt: "Espacio de conversacion institucional con foco en la coordinacion deportiva.",
    featured: false,
    relatedTeam: "Raimon B",
    relatedSlugs: [
      "jude-sharp-el-grupo-ha-ganado-madurez",
      "juvenil-a-acelera-su-crecimiento",
    ],
    content: [
      paragraph(
        "Celia Hills repasa como la metodologia del club se convierte en habitos cotidianos. Para la coordinadora, la identidad no se resume en una idea abstracta: aparece en la exigencia, en el lenguaje comun y en la manera de competir de cada equipo.",
      ),
      heading("De la metodologia al gesto diario"),
      paragraph(
        "La entrevista insiste en que cada sesion debe reforzar comportamientos reconocibles, desde la activacion inicial hasta la gestion emocional del cierre.",
      ),
      linkReference(
        "Conversacion ampliada",
        "https://example.com/rising-raimon/celia-hills-identidad",
        "Referencia externa de ejemplo con la entrevista extendida.",
      ),
    ],
  },
];

export const FEATURED_PUBLIC_NEWS =
  PUBLIC_NEWS_ARTICLES.find((article) => article.featured) ?? PUBLIC_NEWS_ARTICLES[0];

export const PUBLIC_NEWS_GRID_ITEMS = PUBLIC_NEWS_ARTICLES.filter((article) => !article.featured);

export function getPublicNewsArticleBySlug(slug: string) {
  return PUBLIC_NEWS_ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function getRelatedPublicNewsArticles(slug: string, limit = 2) {
  const article = getPublicNewsArticleBySlug(slug);

  if (!article) {
    return [];
  }

  const explicitRelated =
    article.relatedSlugs
      ?.map((relatedSlug) => getPublicNewsArticleBySlug(relatedSlug))
      .filter((relatedArticle): relatedArticle is PublicNewsArticle => relatedArticle !== null) ?? [];

  if (explicitRelated.length > 0) {
    return explicitRelated.slice(0, limit);
  }

  return PUBLIC_NEWS_ARTICLES.filter((candidate) => {
    if (candidate.slug === slug) {
      return false;
    }

    return (
      candidate.category === article.category ||
      (article.relatedTeam !== undefined && candidate.relatedTeam === article.relatedTeam)
    );
  }).slice(0, limit);
}
