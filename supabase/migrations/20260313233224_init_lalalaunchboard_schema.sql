create extension if not exists pgcrypto with schema extensions;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.sync_checklist_completion_timestamp()
returns trigger
language plpgsql
as $$
begin
  if new.completed then
    new.completed_at = coalesce(new.completed_at, timezone('utc', now()));
  else
    new.completed_at = null;
  end if;

  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.apps (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  platform text not null check (platform in ('ios', 'android', 'web')),
  launch_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.checklist_item_statuses (
  id uuid primary key default extensions.gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  cms_item_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (app_id, cms_item_id)
);

create table if not exists public.deliverables (
  id uuid primary key default extensions.gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  cms_item_id text not null,
  type text not null check (type in ('link', 'note', 'file')),
  content text not null check (char_length(trim(content)) > 0),
  file_name text,
  file_size bigint check (file_size is null or file_size between 0 and 10485760),
  created_at timestamptz not null default timezone('utc', now()),
  check (
    (type = 'file' and file_name is not null and file_size is not null) or
    (type in ('link', 'note') and file_name is null)
  )
);

create table if not exists public.routine_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  cms_task_id text not null,
  week_number integer not null check (week_number between 1 and 53),
  completed boolean not null default true,
  logged_at timestamptz not null default timezone('utc', now()),
  unique (app_id, cms_task_id, week_number)
);

create index if not exists apps_user_id_idx on public.apps (user_id);
create index if not exists checklist_item_statuses_app_id_idx
  on public.checklist_item_statuses (app_id);
create index if not exists deliverables_app_id_idx on public.deliverables (app_id);
create index if not exists deliverables_app_id_cms_item_id_idx
  on public.deliverables (app_id, cms_item_id);
create index if not exists routine_logs_app_id_idx on public.routine_logs (app_id);
create index if not exists routine_logs_app_id_week_number_idx
  on public.routine_logs (app_id, week_number);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.touch_updated_at();

drop trigger if exists set_apps_updated_at on public.apps;
create trigger set_apps_updated_at
before update on public.apps
for each row
execute function public.touch_updated_at();

drop trigger if exists set_checklist_item_statuses_updated_at on public.checklist_item_statuses;
create trigger set_checklist_item_statuses_updated_at
before update on public.checklist_item_statuses
for each row
execute function public.touch_updated_at();

drop trigger if exists sync_checklist_completion_timestamp on public.checklist_item_statuses;
create trigger sync_checklist_completion_timestamp
before insert or update on public.checklist_item_statuses
for each row
execute function public.sync_checklist_completion_timestamp();

create or replace function public.sync_public_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.users (id, email)
    values (new.id, new.email)
    on conflict (id) do update
      set email = excluded.email,
          updated_at = timezone('utc', now());

    return new;
  end if;

  if tg_op = 'UPDATE' then
    update public.users
      set email = new.email,
          updated_at = timezone('utc', now())
    where id = new.id;

    return new;
  end if;

  delete from public.users where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.sync_public_user_from_auth();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_public_user_from_auth();

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
after delete on auth.users
for each row
execute function public.sync_public_user_from_auth();

insert into public.users (id, email)
select id, email
from auth.users
where email is not null
on conflict (id) do update
  set email = excluded.email,
      updated_at = timezone('utc', now());
