-- ============================================================
-- Phase 2: products tablosuna ürün bazlı context alanları ekle
-- Her ürünün kendi sektörü, aşaması, compliance'ı olabilir
-- ============================================================

alter table public.products
  add column if not exists industry       text,
  add column if not exists company_stage  text,
  add column if not exists compliance     text[],
  add column if not exists uvp            text check (uvp is null or char_length(uvp) <= 280),
  add column if not exists competitors    text[];

-- workspace_id üzerinden zaten RLS var, ek politika gerekmez
