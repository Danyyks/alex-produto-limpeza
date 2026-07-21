-- ─────────────────────────────────────────────────────────────
-- Schema do banco — Alex, Produtos de Limpeza
--
-- Como usar: cole este arquivo inteiro no SQL Editor do seu
-- projeto Supabase (https://app.supabase.com > seu projeto >
-- SQL Editor > New query) e clique em "Run". Depois rode o
-- seed.sql para popular produtos de exemplo.
--
-- Este projeto não usa Supabase CLI/migrations — os scripts
-- .sql aqui servem apenas de documentação e para reproduzir o
-- banco em um projeto Supabase novo.
-- ─────────────────────────────────────────────────────────────

-- ── Tabela: menu_items ──────────────────────────────────────
-- Guarda todos os produtos do catálogo (qualquer categoria).
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price > 0),
  image_url text,
  category text not null check (category in ('geral', 'lavanderia', 'higiene', 'kits')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table menu_items enable row level security;

-- Qualquer visitante (anônimo) só vê itens ativos
drop policy if exists "menu_items: leitura pública de itens ativos" on menu_items;
create policy "menu_items: leitura pública de itens ativos"
  on menu_items for select
  to anon
  using (active = true);

-- Usuário autenticado (admin) tem acesso total
drop policy if exists "menu_items: admin tem acesso total" on menu_items;
create policy "menu_items: admin tem acesso total"
  on menu_items for all
  to authenticated
  using (true)
  with check (true);

-- ── Tabela: site_profile ────────────────────────────────────
-- Guarda a logo do site. Sempre tem no máximo 1 linha (id = 1).
create table if not exists site_profile (
  id integer primary key default 1,
  logo_url text,
  constraint site_profile_singleton check (id = 1)
);

alter table site_profile enable row level security;

drop policy if exists "site_profile: leitura pública" on site_profile;
create policy "site_profile: leitura pública"
  on site_profile for select
  to anon, authenticated
  using (true);

drop policy if exists "site_profile: admin pode escrever" on site_profile;
create policy "site_profile: admin pode escrever"
  on site_profile for all
  to authenticated
  using (true)
  with check (true);

-- ── Storage: bucket de imagens ──────────────────────────────
-- Guarda fotos de produtos e a logo, com leitura pública.
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

drop policy if exists "menu-images: leitura pública" on storage.objects;
create policy "menu-images: leitura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'menu-images');

drop policy if exists "menu-images: admin pode enviar" on storage.objects;
create policy "menu-images: admin pode enviar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-images');

drop policy if exists "menu-images: admin pode remover" on storage.objects;
create policy "menu-images: admin pode remover"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-images');

-- ── Usuário admin ───────────────────────────────────────────
-- Crie o usuário admin manualmente em Authentication > Users
-- no painel do Supabase (email + senha). Esse é o login usado
-- no botão "admin" discreto do site.
