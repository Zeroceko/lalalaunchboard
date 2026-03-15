-- ============================================================
-- Growth Tracker Persistence Schema
-- ============================================================

-- 1. growth_configs table
-- Stores the global settings for a product's growth tracker
create table if not exists public.growth_configs (
  id                uuid primary key default extensions.gen_random_uuid(),
  product_id        uuid not null references public.products (id) on delete cascade unique,
  interval          text not null check (interval in ('weekly', 'monthly')),
  metric_names      jsonb not null, -- Stores localized/custom names for awareness, acquisition, etc.
  enabled_metrics   jsonb not null, -- Stores visibility toggles (boolean map)
  target_growth     numeric not null default 5,
  created_at        timestamptz not null default timezone('utc', now()),
  updated_at        timestamptz not null default timezone('utc', now())
);

create index if not exists growth_configs_product_id_idx on public.growth_configs (product_id);

-- 2. growth_metrics table
-- Stores the periodic data points (weeks or months)
create table if not exists public.growth_metrics (
  id                uuid primary key default extensions.gen_random_uuid(),
  product_id        uuid not null references public.products (id) on delete cascade,
  week              integer not null, -- Can represent week number or month index
  awareness         integer not null default 0,
  acquisition       integer not null default 0,
  activation        integer not null default 0,
  retention         integer not null default 0,
  referral          integer not null default 0,
  revenue           numeric not null default 0,
  -- Conversions are calculated on the fly or stored? 
  -- Better to store absolute numbers and calculate in frontend as we do now.
  created_at        timestamptz not null default timezone('utc', now()),
  updated_at        timestamptz not null default timezone('utc', now()),
  unique(product_id, week)
);

create index if not exists growth_metrics_product_id_idx on public.growth_metrics (product_id);

-- 3. RLS Policies
alter table public.growth_configs enable row level security;
alter table public.growth_metrics enable row level security;

grant select, insert, update, delete on public.growth_configs to authenticated;
grant select, insert, update, delete on public.growth_metrics to authenticated;

-- Policy: Users can only manage growth configs for products they own (via workspace)
create policy "users_manage_own_growth_configs"
on public.growth_configs
for all
to authenticated
using (
  exists (
    select 1 from public.products
    join public.workspaces on workspaces.id = products.workspace_id
    where products.id = growth_configs.product_id
      and workspaces.user_id = auth.uid()
  )
);

-- Policy: Users can only manage growth metrics for products they own (via workspace)
create policy "users_manage_own_growth_metrics"
on public.growth_metrics
for all
to authenticated
using (
  exists (
    select 1 from public.products
    join public.workspaces on workspaces.id = products.workspace_id
    where products.id = growth_metrics.product_id
      and workspaces.user_id = auth.uid()
  )
);

-- 4. Triggers for updated_at
drop trigger if exists set_growth_configs_updated_at on public.growth_configs;
create trigger set_growth_configs_updated_at
before update on public.growth_configs
for each row
execute function public.touch_updated_at();

drop trigger if exists set_growth_metrics_updated_at on public.growth_metrics;
create trigger set_growth_metrics_updated_at
before update on public.growth_metrics
for each row
execute function public.touch_updated_at();
