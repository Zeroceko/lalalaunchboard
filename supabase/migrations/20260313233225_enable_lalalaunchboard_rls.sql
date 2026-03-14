grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

grant select on public.users to authenticated;
grant select, insert, update, delete on public.apps to authenticated;
grant select, insert, update, delete on public.checklist_item_statuses to authenticated;
grant select, insert, update, delete on public.deliverables to authenticated;
grant select, insert, update, delete on public.routine_logs to authenticated;

alter table public.users enable row level security;
alter table public.apps enable row level security;
alter table public.checklist_item_statuses enable row level security;
alter table public.deliverables enable row level security;
alter table public.routine_logs enable row level security;

alter table public.users force row level security;
alter table public.apps force row level security;
alter table public.checklist_item_statuses force row level security;
alter table public.deliverables force row level security;
alter table public.routine_logs force row level security;

drop policy if exists "users_read_own_profile" on public.users;
create policy "users_read_own_profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users_manage_own_apps" on public.apps;
create policy "users_manage_own_apps"
on public.apps
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_manage_own_checklist_statuses" on public.checklist_item_statuses;
create policy "users_manage_own_checklist_statuses"
on public.checklist_item_statuses
for all
to authenticated
using (
  exists (
    select 1
    from public.apps
    where apps.id = checklist_item_statuses.app_id
      and apps.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.apps
    where apps.id = checklist_item_statuses.app_id
      and apps.user_id = auth.uid()
  )
);

drop policy if exists "users_manage_own_deliverables" on public.deliverables;
create policy "users_manage_own_deliverables"
on public.deliverables
for all
to authenticated
using (
  exists (
    select 1
    from public.apps
    where apps.id = deliverables.app_id
      and apps.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.apps
    where apps.id = deliverables.app_id
      and apps.user_id = auth.uid()
  )
);

drop policy if exists "users_manage_own_routine_logs" on public.routine_logs;
create policy "users_manage_own_routine_logs"
on public.routine_logs
for all
to authenticated
using (
  exists (
    select 1
    from public.apps
    where apps.id = routine_logs.app_id
      and apps.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.apps
    where apps.id = routine_logs.app_id
      and apps.user_id = auth.uid()
  )
);
