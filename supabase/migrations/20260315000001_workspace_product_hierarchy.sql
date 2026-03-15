-- ============================================================
-- Phase 1: Workspace → Product hierarchy migration
-- ============================================================
-- Strategy: preserve existing apps.id UUIDs as products.id
-- so child tables (checklist_item_statuses, deliverables,
-- routine_logs) remain valid with zero data changes.
-- ============================================================

-- 1a. Extend users table
alter table public.users
  add column if not exists full_name text,
  add column if not exists role_in_company text
    check (role_in_company in ('Founder', 'Growth', 'Product', 'Marketing'));

-- ============================================================
-- 1b. workspaces table
-- ============================================================
create table if not exists public.workspaces (
  id               uuid primary key default extensions.gen_random_uuid(),
  user_id          uuid not null references public.users (id) on delete cascade,
  company_name     text,
  website_url      text,
  company_stage    text,
  team_size        text,
  industry         text,
  business_model   text,
  target_audience  text,
  primary_platform text[],
  traction_level   text,
  revenue_level    text,
  growth_channel   text,
  compliance       text[],
  competitors      text[],
  uvp              text check (uvp is null or char_length(uvp) <= 280),
  created_at       timestamptz not null default timezone('utc', now()),
  updated_at       timestamptz not null default timezone('utc', now())
);

create index if not exists workspaces_user_id_idx on public.workspaces (user_id);

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.touch_updated_at();

-- ============================================================
-- 1c. products table
-- ============================================================
create table if not exists public.products (
  id                uuid primary key default extensions.gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces (id) on delete cascade,
  product_name      text not null check (char_length(trim(product_name)) > 0),
  business_model    text check (business_model in ('B2B SaaS', 'B2C Mobile', 'Marketplace', 'E-commerce')),
  monetization_type text[],
  target_audience   text,
  primary_platform  text[],
  launch_date       date not null,
  created_at        timestamptz not null default timezone('utc', now()),
  updated_at        timestamptz not null default timezone('utc', now())
);

create index if not exists products_workspace_id_idx on public.products (workspace_id);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.touch_updated_at();

-- ============================================================
-- 1d. app_store_metadata table
-- ============================================================
create table if not exists public.app_store_metadata (
  id                      uuid primary key default extensions.gen_random_uuid(),
  product_id              uuid not null references public.products (id) on delete cascade,
  primary_category        text,
  secondary_category      text,
  main_competitors        text[],
  target_keywords         text[],
  core_value_proposition  text,
  requires_user_login     boolean,
  collects_user_data      boolean,
  has_account_deletion    boolean,
  uses_external_payments  boolean,
  target_age_rating       text check (target_age_rating in ('4+', '9+', '12+', '17+')),
  created_at              timestamptz not null default timezone('utc', now()),
  updated_at              timestamptz not null default timezone('utc', now())
);

create index if not exists app_store_metadata_product_id_idx on public.app_store_metadata (product_id);

drop trigger if exists set_app_store_metadata_updated_at on public.app_store_metadata;
create trigger set_app_store_metadata_updated_at
before update on public.app_store_metadata
for each row
execute function public.touch_updated_at();

-- ============================================================
-- 1e. Data migration: apps → workspaces + products
-- UUID'ler korunur: products.id = apps.id
-- ============================================================

-- Her user için bir workspace oluştur (apps'i olan kullanıcılar için)
insert into public.workspaces (id, user_id, created_at, updated_at)
select
  extensions.gen_random_uuid(),
  user_id,
  min(created_at),
  timezone('utc', now())
from public.apps
group by user_id
on conflict do nothing;

-- apps → products (aynı UUID kullanılır — child FK'lar geçerli kalır)
insert into public.products (
  id,
  workspace_id,
  product_name,
  primary_platform,
  launch_date,
  created_at,
  updated_at
)
select
  a.id,
  w.id,
  a.name,
  array[a.platform::text],
  a.launch_date,
  a.created_at,
  a.updated_at
from public.apps a
join public.workspaces w on w.user_id = a.user_id
on conflict (id) do nothing;

-- ============================================================
-- 1f. Child tablolara product_id kolonu ekle (geçiş dönemi)
-- Mevcut app_id korunur — Phase 4'te silinecek
-- ============================================================

alter table public.checklist_item_statuses
  add column if not exists product_id uuid references public.products (id) on delete cascade;

alter table public.deliverables
  add column if not exists product_id uuid references public.products (id) on delete cascade;

alter table public.routine_logs
  add column if not exists product_id uuid references public.products (id) on delete cascade;

-- Backfill: UUID'ler eşit olduğu için direkt kopyalanır
update public.checklist_item_statuses set product_id = app_id where product_id is null;
update public.deliverables set product_id = app_id where product_id is null;
update public.routine_logs set product_id = app_id where product_id is null;

create index if not exists checklist_item_statuses_product_id_idx
  on public.checklist_item_statuses (product_id);
create index if not exists deliverables_product_id_idx
  on public.deliverables (product_id);
create index if not exists routine_logs_product_id_idx
  on public.routine_logs (product_id);

-- ============================================================
-- 1g. RLS: yeni tablolar
-- ============================================================

grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.app_store_metadata to authenticated;

alter table public.workspaces enable row level security;
alter table public.products enable row level security;
alter table public.app_store_metadata enable row level security;

alter table public.workspaces force row level security;
alter table public.products force row level security;
alter table public.app_store_metadata force row level security;

-- workspaces: sadece kendi workspace'ini yönet
drop policy if exists "users_manage_own_workspaces" on public.workspaces;
create policy "users_manage_own_workspaces"
on public.workspaces
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- products: workspace üzerinden ownership
drop policy if exists "users_manage_own_products" on public.products;
create policy "users_manage_own_products"
on public.products
for all
to authenticated
using (
  exists (
    select 1 from public.workspaces
    where workspaces.id = products.workspace_id
      and workspaces.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workspaces
    where workspaces.id = products.workspace_id
      and workspaces.user_id = auth.uid()
  )
);

-- app_store_metadata: products → workspaces üzerinden ownership
drop policy if exists "users_manage_own_app_store_metadata" on public.app_store_metadata;
create policy "users_manage_own_app_store_metadata"
on public.app_store_metadata
for all
to authenticated
using (
  exists (
    select 1 from public.products
    join public.workspaces on workspaces.id = products.workspace_id
    where products.id = app_store_metadata.product_id
      and workspaces.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.products
    join public.workspaces on workspaces.id = products.workspace_id
    where products.id = app_store_metadata.product_id
      and workspaces.user_id = auth.uid()
  )
);

-- users: update izni ekle (full_name, role_in_company için)
drop policy if exists "users_update_own_profile" on public.users;
create policy "users_update_own_profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
