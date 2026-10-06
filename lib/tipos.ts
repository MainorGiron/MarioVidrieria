// Tipos del contenido del sitio. Coinciden con las tablas que tendrá Supabase.

export type Redes = {
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type Ajustes = {
  nombre: string;
  razonSocial: string;
  eslogan: string;
  telefonos: string[];
  whatsapp: string; // solo números, con código de país (ej. 50499999999)
  correo: string;
  direccion: string;
  ciudad: string;
  horarios: string;
  urlMapa: string; // enlace "insertar mapa" de Google Maps (src del iframe)
  redes: Redes;
};

export type Portada = {
  titulo: string;
  subtitulo: string;
  imagen: string;
};

export type Ventaja = {
  titulo: string;
  texto: string;
};

export type Nosotros = {
  titulo: string;
  historia: string;
  mision: string;
  vision: string;
  imagen: string;
  ventajas: Ventaja[];
};

export type Servicio = {
  id: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  descripcion: string;
  imagen: string;
  orden: number;
  visible: boolean;
};

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
};

export type ImagenGaleria = {
  id: string;
  categoriaId: string;
  url: string;
  descripcion: string;
  destacado: boolean;
  orden: number;
  fecha: string;
};

export type Testimonio = {
  id: string;
  cliente: string;
  comentario: string;
  calificacion: number;
  visible: boolean;
};

export type Mensaje = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  servicio: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
};

export type Contenido = {
  ajustes: Ajustes;
  portada: Portada;
  nosotros: Nosotros;
  servicios: Servicio[];
  categorias: Categoria[];
  galeria: ImagenGaleria[];
  testimonios: Testimonio[];
  mensajes: Mensaje[];
};
