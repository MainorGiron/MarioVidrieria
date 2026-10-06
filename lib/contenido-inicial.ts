import type { Contenido } from "./tipos";

// Contenido inicial. Todo se puede cambiar desde el panel /admin.
// Los campos de imagen vacíos ("") se muestran como recuadros "Aquí va la imagen".

const hoy = "2026-10-06T00:00:00.000Z";

const servicio = (
  orden: number,
  nombre: string,
  slug: string,
  descripcionCorta: string,
  descripcion: string,
  imagen = "",
) => ({ id: `srv-${slug}`, nombre, slug, descripcionCorta, descripcion, imagen, orden, visible: true });

const foto = (orden: number, categoriaId: string, url: string, descripcion: string, destacado = true) => ({
  id: `img-${orden}`,
  categoriaId,
  url,
  descripcion,
  destacado,
  orden,
  fecha: hoy,
});

export const contenidoInicial: Contenido = {
  ajustes: {
    nombre: "Vidriería Indurocer",
    razonSocial: "Vidriería Indurocer S. de R.L. de C.V.",
    eslogan: "La vidriería que te brinda CALIDAD Y CONFIANZA",
    telefonos: ["0000-0000"],
    whatsapp: "",
    correo: "",
    direccion: "3 y 5, 4 Calle Sur",
    ciudad: "El Progreso, Yoro, Honduras",
    horarios: "Lunes a viernes 8:00 a. m. – 5:00 p. m. · Sábados 8:00 a. m. – 12:00 m.",
    urlMapa: "",
    redes: { facebook: "", instagram: "", tiktok: "" },
  },
  portada: {
    titulo: "Calidad y confianza en aluminio, vidrio y PVC",
    subtitulo:
      "Fabricamos e instalamos ventanas de PVC y aluminio, puertas comerciales, vitrinas, espejos y mucho más en El Progreso, Yoro. Cotiza sin compromiso.",
    imagen: "/trabajos/vitrinas.webp",
  },
  nosotros: {
    titulo: "Somos Vidriería Indurocer",
    historia:
      "Aquí va la historia de la empresa: cuándo empezó, quién la fundó y cómo ha crecido. Este texto se edita desde el panel administrativo.",
    mision:
      "Aquí va la misión: ofrecer soluciones en aluminio, vidrio y PVC con acabados de calidad, puntualidad y atención cercana.",
    vision:
      "Aquí va la visión: ser la vidriería de confianza de las familias y empresas de Honduras.",
    imagen: "",
    ventajas: [
      { titulo: "Calidad", texto: "Materiales de primera en aluminio, vidrio y PVC." },
      { titulo: "Confianza", texto: "Cumplimos lo que prometemos, en tiempo y forma." },
      { titulo: "A la medida", texto: "Fabricamos cada trabajo según tu espacio y necesidad." },
      { titulo: "Instalación profesional", texto: "Personal con experiencia y acabados limpios." },
    ],
  },
  servicios: [
    servicio(1, "Ventanas PVC", "ventanas-pvc",
      "Ventanas de PVC corredizas y fijas, resistentes y fáciles de mantener.",
      "Fabricamos ventanas de PVC a la medida: corredizas, fijas, con cuadrícula o con luz superior. Aíslan el calor y el ruido y no se oxidan.",
      "/trabajos/ventana-pvc.webp"),
    servicio(2, "Ventanas de aluminio", "ventanas-de-aluminio",
      "Ventanas y cerramientos de aluminio en distintos colores y estilos.",
      "Ventanas corredizas, fijas y cerramientos completos de aluminio, en blanco, negro y otros acabados, con el vidrio que necesites.",
      "/trabajos/cerramiento-aluminio.webp"),
    servicio(3, "Vitrinas", "vitrinas",
      "Vitrinas y mostradores de vidrio y aluminio para tu negocio.",
      "Vitrinas de exhibición con repisas de vidrio, con o sin rodos, para tiendas, farmacias, pulperías y más.",
      "/trabajos/vitrinas.webp"),
    servicio(4, "Espejos", "espejos",
      "Espejos a la medida para baños, salas, gimnasios y negocios.",
      "Cortamos e instalamos espejos de todos los tamaños, con o sin marco.",
      ""),
    servicio(5, "Enmarcados para título", "enmarcados-para-titulo",
      "Enmarcamos títulos, diplomas y certificados.",
      "Protege y luce tus títulos, diplomas y certificados con un enmarcado con vidrio a la medida.",
      ""),
    servicio(6, "Reparación de telas", "reparacion-de-telas",
      "Cambio y reparación de telas en ventanas y puertas.",
      "Reparamos o reemplazamos la tela de tus ventanas y puertas para que vuelvan a quedar como nuevas.",
      ""),
    servicio(7, "Puertas comerciales", "puertas-comerciales",
      "Puertas de aluminio y vidrio para locales, oficinas y casas.",
      "Puertas corredizas y abatibles de aluminio o PVC con vidrio, ideales para negocios, oficinas y viviendas.",
      "/trabajos/puerta-aluminio-negra.webp"),
    servicio(8, "Tablilla de PVC", "tablilla-de-pvc",
      "Cielos falsos y revestimientos con tablilla de PVC.",
      "Instalamos tablilla de PVC para cielos falsos y paredes: limpia, duradera y resistente a la humedad.",
      ""),
  ],
  categorias: [
    { id: "cat-ventanas", nombre: "Ventanas", slug: "ventanas" },
    { id: "cat-puertas", nombre: "Puertas", slug: "puertas" },
    { id: "cat-vitrinas", nombre: "Vitrinas", slug: "vitrinas" },
    { id: "cat-espejos", nombre: "Espejos", slug: "espejos" },
    { id: "cat-otros", nombre: "Otros", slug: "otros" },
  ],
  galeria: [
    foto(1, "cat-ventanas", "/trabajos/cerramiento-aluminio.webp", "Cerramiento de aluminio negro con barandal de vidrio"),
    foto(2, "cat-vitrinas", "/trabajos/vitrinas.webp", "Vitrinas de vidrio y aluminio con rodos"),
    foto(3, "cat-ventanas", "/trabajos/ventana-pvc.webp", "Ventana corrediza de PVC"),
    foto(4, "cat-puertas", "/trabajos/puerta-aluminio-negra.webp", "Puerta corrediza de aluminio negro"),
    foto(5, "cat-puertas", "/trabajos/puerta-pvc-con-luz.webp", "Puerta de PVC con luz superior"),
    foto(6, "cat-ventanas", "/trabajos/ventana-pvc-cuadricula.webp", "Ventanas de PVC con cuadrícula"),
    foto(7, "cat-puertas", "/trabajos/puerta-corrediza-blanca.webp", "Puerta corrediza blanca con vidrio oscuro", false),
    foto(8, "cat-ventanas", "/trabajos/ventanas-pvc-local.webp", "Ventanas de PVC listas para instalar", false),
    foto(9, "cat-espejos", "", "Espejo instalado (sube la foto desde el panel)", false),
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
