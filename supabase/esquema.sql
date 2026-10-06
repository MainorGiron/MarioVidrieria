-- =====================================================================
-- Vidriería Indurocer · Esquema de Supabase
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
-- Se puede ejecutar más de una vez sin romper nada.
-- =====================================================================

-- 1) Contenido del sitio (un solo registro con todo en formato JSON:
--    datos de la empresa, portada, nosotros, servicios, galería, testimonios).
create table if not exists public.sitio (
  id          int primary key default 1 check (id = 1),
  datos       jsonb not null default '{}'::jsonb,
  actualizado timestamptz not null default now()
);

-- 2) Mensajes del formulario de contacto.
create table if not exists public.mensajes (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null check (char_length(nombre) between 1 and 120),
  telefono  text not null default '' check (char_length(telefono) <= 40),
  correo    text not null default '' check (char_length(correo) <= 120),
  servicio  text not null default '' check (char_length(servicio) <= 120),
  mensaje   text not null check (char_length(mensaje) between 1 and 2000),
  fecha     timestamptz not null default now(),
  leido     boolean not null default false
);

-- 3) Seguridad (Row Level Security):
--    - Cualquier visitante puede LEER el contenido del sitio.
--    - Cualquier visitante puede ENVIAR un mensaje, pero no leerlos.
--    - Solo un usuario con sesión (el administrador) puede modificar todo.
alter table public.sitio    enable row level security;
alter table public.mensajes enable row level security;

drop policy if exists "sitio: lectura publica"       on public.sitio;
drop policy if exists "sitio: admin escribe"         on public.sitio;
drop policy if exists "mensajes: publico envia"      on public.mensajes;
drop policy if exists "mensajes: admin gestiona"     on public.mensajes;

create policy "sitio: lectura publica" on public.sitio
  for select to anon, authenticated using (true);

create policy "sitio: admin escribe" on public.sitio
  for all to authenticated using (true) with check (true);

create policy "mensajes: publico envia" on public.mensajes
  for insert to anon, authenticated with check (leido = false);

create policy "mensajes: admin gestiona" on public.mensajes
  for all to authenticated using (true) with check (true);

-- Permisos de la API (por si el proyecto no expone tablas nuevas automáticamente).
grant select on public.sitio to anon, authenticated;
grant insert, update, delete on public.sitio to authenticated;
grant insert on public.mensajes to anon, authenticated;
grant select, update, delete on public.mensajes to authenticated;

-- 4) Bucket público para las fotos que se suben desde el panel.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 8388608,
        array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "imagenes: admin sube"   on storage.objects;
drop policy if exists "imagenes: admin cambia" on storage.objects;
drop policy if exists "imagenes: admin borra"  on storage.objects;

create policy "imagenes: admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'imagenes');

create policy "imagenes: admin cambia" on storage.objects
  for update to authenticated using (bucket_id = 'imagenes');

create policy "imagenes: admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'imagenes');
