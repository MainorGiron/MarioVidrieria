# Vidriería Indurocer · Sitio web

Sitio público + panel administrativo, hecho con **Next.js (React + TypeScript)** y **Tailwind CSS**.

## Cómo correrlo en tu computadora

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev
```

- Sitio público: http://localhost:3000
- Panel: http://localhost:3000/admin (contraseña en `ADMIN_PASSWORD`; si no la defines, en desarrollo es `indurocer`)

## Qué hay

| Ruta | Qué es |
|---|---|
| `/` | Inicio: portada, servicios, por qué elegirnos, trabajos recientes, testimonios |
| `/servicios` | Todos los servicios con descripción y foto |
| `/trabajos` | Galería con filtro por categoría y vista ampliada |
| `/nosotros` | Historia, misión, visión |
| `/contacto` | Formulario de cotización, datos de contacto y mapa |
| `/admin` | Panel: datos de la empresa, portada, servicios, galería, nosotros, testimonios y mensajes |

Mientras no se suba una foto, cada espacio muestra un recuadro **"Aquí va la imagen"** con lo que debe ir y el tamaño recomendado.

## Estructura

```
app/(publico)/      páginas del sitio público
app/admin/          panel administrativo y login
components/site/    componentes del sitio (encabezado, pie, galería, Imagen…)
components/admin/   componentes del panel (campos, botones, selector de imagen)
lib/tipos.ts        tipos del contenido (= futuras tablas de Supabase)
lib/contenido-inicial.ts  textos de ejemplo
lib/datos.ts        dónde se guarda el contenido  ← único archivo a cambiar para Supabase
lib/acciones-admin.ts     acciones del panel (guardar, subir, borrar)
```

## Paleta (del logo)

| Token | Hex | Uso |
|---|---|---|
| `rojo` | `#F21B07` | acentos grandes |
| `rojo-oscuro` | `#B3140A` | botones y enlaces (contraste 6.9:1) |
| `coral` | `#F25C5C` | detalles |
| `rosa` / `rosa-suave` | `#FFE3E1` / `#FFF8F7` | fondos suaves |
| `carbon` | `#1C1C1E` | texto y secciones oscuras |
| `gris` | `#5B5B60` | texto secundario |

## Almacenamiento temporal

Por ahora el contenido se guarda en `data/contenido.json` y las fotos en `data/imagenes/` (carpeta ignorada por git).
Funciona en tu computadora; **para publicar en internet hay que conectar Supabase** (última fase), porque Vercel no guarda archivos.
