insert into storage.buckets (id, name, public, file_size_limit)
values ('deliverables', 'deliverables', false, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "users_view_own_deliverable_files" on storage.objects;
create policy "users_view_own_deliverable_files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'deliverables'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users_upload_own_deliverable_files" on storage.objects;
create policy "users_upload_own_deliverable_files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'deliverables'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users_delete_own_deliverable_files" on storage.objects;
create policy "users_delete_own_deliverable_files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'deliverables'
  and (storage.foldername(name))[1] = auth.uid()::text
);
