import type { Contenido } from "./tipos";

// Contenido de ejemplo. Todo se puede cambiar desde el panel /admin.
// Los campos de imagen vacíos ("") se muestran como recuadros "Aquí va la imagen".

const hoy = "2026-10-06T00:00:00.000Z";

export const contenidoInicial: Contenido = {
  ajustes: {
    nombre: "Vidriería Indurocer",
    razonSocial: "Vidriería Indurocer S. de R.L. de C.V.",
    eslogan: "Vidrio y aluminio a la medida de tu hogar y negocio",
    telefonos: ["0000-0000"],
    whatsapp: "",
    correo: "contacto@ejemplo.com",
    direccion: "Dirección pendiente (editar en el panel)",
    ciudad: "Ciudad",
    horarios: "Lunes a viernes 8:00 a. m. – 5:00 p. m. · Sábados 8:00 a. m. – 12:00 m.",
    urlMapa: "",
    redes: { facebook: "", instagram: "", tiktok: "" },
  },
  portada: {
    titulo: "Transparencia, calidad y estilo en cada instalación",
    subtitulo:
      "Fabricamos e instalamos ventanas, puertas, divisiones de baño, espejos y vitrinas en vidrio y aluminio. Medimos a domicilio y cotizamos sin compromiso.",
    imagen: "",
  },
  nosotros: {
    titulo: "Somos Vidriería Indurocer",
    historia:
      "Aquí va la historia de la empresa: cuándo empezó, quién la fundó y cómo ha crecido. Este texto se edita desde el panel administrativo.",
    mision:
      "Aquí va la misión: ofrecer soluciones en vidrio y aluminio con acabados de calidad, puntualidad y atención cercana.",
    vision:
      "Aquí va la visión: ser la vidriería de confianza de las familias y empresas de la región.",
    imagen: "",
    ventajas: [
      { titulo: "Medición a domicilio", texto: "Visitamos tu casa o negocio para tomar medidas exactas." },
      { titulo: "Materiales de calidad", texto: "Trabajamos con vidrio templado, laminado y aluminio de primera." },
      { titulo: "Instalación profesional", texto: "Personal con experiencia y acabados limpios." },
      { titulo: "Garantía", texto: "Respaldamos cada trabajo que entregamos." },
    ],
  },
  servicios: [
    {
      id: "srv-ventanas",
      nombre: "Ventanas",
      slug: "ventanas",
      descripcionCorta: "Ventanas corredizas, abatibles y fijas en aluminio y vidrio.",
      descripcion:
        "Fabricamos ventanas a la medida en diferentes estilos y colores de aluminio, con vidrio claro, bronce, reflectivo o esmerilado.",
      imagen: "",
      orden: 1,
      visible: true,
    },
    {
      id: "srv-puertas",
      nombre: "Puertas de vidrio",
      slug: "puertas-de-vidrio",
      descripcionCorta: "Puertas de vidrio templado para casas, oficinas y comercios.",
      descripcion:
        "Puertas batientes y corredizas de vidrio templado con herrajes de acero inoxidable, ideales para entradas y locales comerciales.",
      imagen: "",
      orden: 2,
      visible: true,
    },
    {
      id: "srv-banos",
      nombre: "Divisiones de baño",
      slug: "divisiones-de-bano",
      descripcionCorta: "Cabinas y mamparas de baño en vidrio templado.",
      descripcion:
        "Divisiones de baño corredizas o abatibles, con vidrio claro, esmerilado o decorado, a la medida de tu espacio.",
      imagen: "",
      orden: 3,
      visible: true,
    },
    {
      id: "srv-espejos",
      nombre: "Espejos",
      slug: "espejos",
      descripcionCorta: "Espejos decorativos, de baño y para gimnasios.",
      descripcion:
        "Cortamos e instalamos espejos de todos los tamaños, con bisel, marco de aluminio o luz LED.",
      imagen: "",
      orden: 4,
      visible: true,
    },
    {
      id: "srv-vitrinas",
      nombre: "Vitrinas y mostradores",
      slug: "vitrinas",
      descripcionCorta: "Vitrinas y mostradores para exhibir tus productos.",
      descripcion:
        "Diseñamos vitrinas y mostradores en vidrio y aluminio para tiendas, farmacias, joyerías y más.",
      imagen: "",
      orden: 5,
      visible: true,
    },
    {
      id: "srv-fachadas",
      nombre: "Fachadas y barandales",
      slug: "fachadas-y-barandales",
      descripcionCorta: "Fachadas de vidrio, barandales y pasamanos.",
      descripcion:
        "Fachadas, muros cortina, barandales de vidrio templado y pasamanos de aluminio o acero inoxidable.",
      imagen: "",
      orden: 6,
      visible: true,
    },
  ],
  categorias: [
    { id: "cat-ventanas", nombre: "Ventanas", slug: "ventanas" },
    { id: "cat-puertas", nombre: "Puertas", slug: "puertas" },
    { id: "cat-banos", nombre: "Baños", slug: "banos" },
    { id: "cat-espejos", nombre: "Espejos", slug: "espejos" },
    { id: "cat-comercial", nombre: "Comercial", slug: "comercial" },
  ],
  galeria: [
    { id: "img-1", categoriaId: "cat-ventanas", url: "", descripcion: "Ventana corrediza instalada en una casa", destacado: true, orden: 1, fecha: hoy },
    { id: "img-2", categoriaId: "cat-puertas", url: "", descripcion: "Puerta de vidrio templado en un local", destacado: true, orden: 2, fecha: hoy },
    { id: "img-3", categoriaId: "cat-banos", url: "", descripcion: "División de baño terminada", destacado: true, orden: 3, fecha: hoy },
    { id: "img-4", categoriaId: "cat-espejos", url: "", descripcion: "Espejo decorativo con bisel", destacado: true, orden: 4, fecha: hoy },
    { id: "img-5", categoriaId: "cat-comercial", url: "", descripcion: "Vitrina para una tienda", destacado: true, orden: 5, fecha: hoy },
    { id: "img-6", categoriaId: "cat-comercial", url: "", descripcion: "Fachada de vidrio de un negocio", destacado: true, orden: 6, fecha: hoy },
  ],
  testimonios: [
    {
      id: "tes-1",
      cliente: "Nombre del cliente",
      comentario: "Aquí va un comentario de un cliente satisfecho. Se agrega y edita desde el panel.",
      calificacion: 5,
      visible: true,
    },
    {
      id: "tes-2",
      cliente: "Nombre del cliente",
      comentario: "Otro testimonio de ejemplo: puntualidad, buen trabajo y buen precio.",
      calificacion: 5,
      visible: true,
    },
    {
      id: "tes-3",
      cliente: "Nombre del cliente",
      comentario: "Un tercer testimonio de ejemplo para completar la sección.",
      calificacion: 5,
      visible: true,
    },
  ],
  mensajes: [],
};
