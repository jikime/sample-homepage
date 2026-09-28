-- 작품 이미지를 Supabase Storage로 옮긴다.
--   bucket  : artworks (공개 읽기 — 랜딩 공개 샘플용)
--   경로    : samples/{파일명}.webp
--   업로드  : pnpm storage:upload (서버 secret key로만 — 공개 쓰기 정책 없음)
-- 테이블에는 공개 URL이 아니라 bucket 안의 경로를 저장하고, 앱이 공개 URL로 바꿔 쓴다.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artworks',
  'artworks',
  true,
  10485760, -- 10MB
  array['image/webp', 'image/png', 'image/jpeg', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- src(로컬 경로) → storage_path(bucket 안 경로)
alter table public.artworks rename column src to storage_path;
alter table public.landing_hero_showcase_items rename column variant_src to variant_storage_path;

update public.artworks
set storage_path = 'samples/' || regexp_replace(storage_path, '^.*/', '')
where storage_path like '/%';

update public.landing_hero_showcase_items
set variant_storage_path = 'samples/' || regexp_replace(variant_storage_path, '^.*/', '')
where variant_storage_path like '/%';

comment on column public.artworks.storage_path is 'Storage bucket "artworks" 안의 경로(예: samples/summer-terrace.webp).';
comment on column public.landing_hero_showcase_items.variant_storage_path is '표준 변형 이미지의 bucket "artworks" 안 경로. 없으면 원본 작품 이미지를 쓴다.';

notify pgrst, 'reload schema';
