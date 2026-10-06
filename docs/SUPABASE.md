# Conectar el sitio con Supabase (paso a paso)

Supabase va a guardar **los textos del sitio, los mensajes de contacto, las fotos y el usuario del panel**. Así el sitio puede vivir en internet y no depende de tu computadora.

Tiempo aproximado: 15 minutos.

---

## Paso 1 · Crear tu cuenta

1. Entra a **https://supabase.com** y toca **Start your project**.
2. Elige **Continue with GitHub** (usa tu cuenta `MainorGiron`) o regístrate con correo.
3. Si te pide crear una **organización**, ponle `Indurocer`, tipo *Personal*, plan **Free**.

## Paso 2 · Crear el proyecto

1. Toca **New project**.
2. Llena:
   - **Name:** `vidrieria-indurocer`
   - **Database password:** toca *Generate a password* y **guárdala** en un lugar seguro (no la vas a usar en el código, pero sirve si algún día la necesitas).
   - **Region:** `East US (North Virginia)` (la más cercana a Honduras).
3. Toca **Create new project** y espera 1–2 minutos a que termine.

## Paso 3 · Crear las tablas, la seguridad y la carpeta de fotos

1. En el menú izquierdo entra a **SQL Editor**.
2. Toca **New query**.
3. Abre el archivo [`supabase/esquema.sql`](../supabase/esquema.sql) del proyecto, copia **todo** y pégalo.
4. Toca **Run** (o `Ctrl + Enter`). Debe decir *Success. No rows returned*.

Esto crea:

| Qué | Para qué |
|---|---|
| Tabla `sitio` | Guarda todo el contenido (empresa, portada, servicios, galería, nosotros, testimonios) |
| Tabla `mensajes` | Guarda las solicitudes del formulario de contacto |
| Bucket `imagenes` | Carpeta pública donde se suben las fotos |
| Reglas de seguridad | El público solo puede **ver** el sitio y **enviar** mensajes; solo el admin puede editar |

Puedes revisarlo en **Table Editor** (verás `sitio` y `mensajes`) y en **Storage** (verás `imagenes`).

## Paso 4 · Crear tu usuario del panel

1. Entra a **Authentication → Users**.
2. Toca **Add user → Create new user**.
3. Escribe tu correo y una contraseña segura.
4. Marca **Auto Confirm User** y toca **Create user**.

Con ese correo y contraseña vas a entrar a `/admin`. Puedes crear otro usuario igual para Mario.

## Paso 5 · Cerrar el registro público (importante)

Cualquier persona con sesión puede editar el sitio, así que nadie más debe poder crearse una cuenta:

1. Entra a **Authentication → Sign In / Providers** (en algunas versiones: *Authentication → Settings*).
2. Desactiva **Allow new users to sign up**.
3. Toca **Save**.

## Paso 6 · Copiar las claves al proyecto

1. Entra a **Project Settings** (el engranaje abajo a la izquierda).
2. En **Data API** (o con el botón **Connect** de arriba) copia la **Project URL**, algo como `https://abcdxyz.supabase.co`.
3. En **API Keys** copia:
   - la **Publishable key** (empieza con `sb_publishable_…`)
   - la **Secret key** (empieza con `sb_secret_…`, toca *Reveal* para verla)

   Si tu proyecto muestra las claves antiguas, usa **anon public** en lugar de la publishable y **service_role** en lugar de la secret.
4. En la carpeta del proyecto, abre (o crea) el archivo **`.env.local`** y pon:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxx
```

> ⚠️ La **secret key** salta todas las reglas de seguridad. Solo va en tu `.env.local` (que no se sube a GitHub). Nunca la pegues en el código, en chats ni en Vercel.

## Paso 7 · Pasar a Supabase lo que ya editaste

Si ya cambiaste cosas en el panel en modo local (carpeta `data/`), cópialas a Supabase:

```bash
npm run migrar
```

Sube tus fotos al bucket, guarda el contenido y copia los mensajes. Si no tienes carpeta `data/`, no hace nada y el sitio arranca con el contenido inicial.

## Paso 8 · Probar

```bash
npm run dev
```

1. Abre http://localhost:3000/admin → ahora te pide **correo y contraseña** (los del paso 4).
2. Cambia algo (por ejemplo el teléfono) y guarda.
3. En Supabase → **Table Editor → sitio** verás el cambio en la columna `datos`.
4. Sube una foto → aparecerá en **Storage → imagenes**.
5. Envía un mensaje desde `/contacto` → aparece en **Table Editor → mensajes** y en el panel.

¿Quieres volver al modo local? Borra (o comenta con `#`) las líneas de Supabase en `.env.local`.

---

## Cómo funciona por dentro

- `lib/supabase.ts`: crea la conexión. Si existen las variables de Supabase, el sitio usa Supabase; si no, usa la carpeta `data/`.
- `lib/datos.ts`: lee y guarda el contenido, los mensajes y las fotos (en Supabase o en archivos).
- `lib/auth.ts`: el inicio de sesión. Con Supabase usa **Supabase Auth** (correo + contraseña).
- `proxy.ts`: mantiene viva la sesión del panel mientras lo usas.
- `supabase/esquema.sql`: tablas, reglas de seguridad y bucket.

## Problemas comunes

| Mensaje | Solución |
|---|---|
| *No se pudo leer el contenido de Supabase* | Revisa la URL y la publishable key en `.env.local`, y reinicia `npm run dev`. |
| *Correo o contraseña incorrectos* | Revisa el usuario en Authentication → Users y que esté **confirmado**. |
| *No se pudo guardar… row-level security* | No corriste el paso 3 completo. Vuelve a ejecutar `esquema.sql`. |
| *No se pudo subir la imagen* | Revisa que exista el bucket `imagenes` en Storage (paso 3). |
| El proyecto aparece *Paused* | En el plan gratis, Supabase pausa proyectos sin visitas por 7 días. Entra a supabase.com y toca **Restore**. |
