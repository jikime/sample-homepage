-- digital place 랜딩(P-01) 콘텐츠 + 에이전시 가입 신청
--
-- src/lib/landing/types.ts 의 타입을 그대로 테이블로 옮겼다.
--   LandingContent        → landing_pages (+ page_slug로 묶인 하위 테이블)
--   NavItem               → landing_nav_items
--   HeroContent           → landing_heroes
--   HeroShowcaseItem      → landing_hero_showcase_items
--   SectionHeading        → landing_section_headings
--   ProblemItem           → landing_problem_items
--   ProcessStep           → landing_process_steps
--   CompareExample        → landing_compare_examples · landing_compare_row_labels
--   Candidate             → landing_candidates
--   samples               → landing_sample_sections · landing_sample_items
--   OperatingRule         → landing_operating_rules
--   TermRow / terms       → landing_term_rows · landing_terms_sections
--   FaqItem               → landing_faqs
--   finalCta              → landing_final_ctas
--   FooterContent         → landing_footers · landing_footer_links
--   Artwork               → artworks
--   ApplicationInput      → agency_applications
--
-- Responsive<T> 규칙: 기본 문구는 {컬럼}, 모바일(< 1024px) 문구는 {컬럼}_mobile.
--   {컬럼}_mobile 이 null 이면 모바일도 기본 문구를 쓰고, '' 이면 모바일에서 숨긴다.

-- ─────────────────────────────────────────────────────────────
-- 공통: updated_at 자동 갱신
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 작품
-- ─────────────────────────────────────────────────────────────
create table public.artworks (
  id text primary key,
  title text not null,
  creator text not null,
  src text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  size_label text not null,
  category text not null,
  tone text not null,
  placement text not null,
  placement_short text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.artworks is '공개 샘플 작품(Artwork). creator는 크리에이터 표시명만 — 연락처를 넣지 않는다.';
comment on column public.artworks.size_label is '규격 라벨(예: 1080×1350). 화면에서는 JetBrains Mono로 표시한다.';

-- ─────────────────────────────────────────────────────────────
-- 랜딩 페이지 (LandingContent 루트)
-- ─────────────────────────────────────────────────────────────
create table public.landing_pages (
  slug text primary key,
  login_href text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.landing_pages is '랜딩 페이지 루트. 지금은 slug = home 한 행만 쓴다.';

create table public.landing_nav_items (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null,
  unique (page_slug, sort_order)
);

-- ① 히어로
create table public.landing_heroes (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  overline text not null,
  overline_mobile text,
  headline_lines text[] not null check (cardinality(headline_lines) > 0),
  headline_accent text not null,
  description text not null,
  description_mobile text,
  note text not null,
  note_mobile text,
  primary_cta text not null,
  secondary_cta_label text not null,
  secondary_cta_href text not null,
  updated_at timestamptz not null default now()
);
comment on column public.landing_heroes.headline_lines is '헤드라인 줄 단위. {accent} 자리에 headline_accent를 강조색으로 넣는다.';

create table public.landing_hero_showcase_items (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  layout text not null check (layout in ('desktop', 'mobile')),
  position smallint not null check (position >= 0),
  artwork_id text not null references public.artworks (id),
  variant_src text,
  variant_width integer check (variant_width > 0),
  variant_height integer check (variant_height > 0),
  variant_size_label text,
  unique (page_slug, layout, position),
  constraint landing_hero_showcase_items_variant_check check (
    (variant_src is null and variant_width is null and variant_height is null and variant_size_label is null)
    or (variant_src is not null and variant_width is not null and variant_height is not null and variant_size_label is not null)
  )
);
comment on table public.landing_hero_showcase_items is '히어로 쇼케이스. desktop 3장(세로 · 정사각 · 배너), mobile 2장.';
comment on column public.landing_hero_showcase_items.variant_src is '프레임에 맞춘 표준 변형(리사이즈·리크롭) 이미지가 따로 있을 때만.';

-- 섹션 제목(②~⑦)
create table public.landing_section_headings (
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  section text not null check (section in ('problem', 'process', 'compare', 'samples', 'rules', 'terms')),
  overline text not null,
  title_lines text[] not null check (cardinality(title_lines) > 0),
  title_lines_mobile text[],
  description text,
  description_mobile text,
  primary key (page_slug, section)
);

-- ② 문제
create table public.landing_problem_items (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  code text not null,
  label text not null,
  title text not null,
  problem text not null,
  solution text not null,
  sort_order integer not null,
  unique (page_slug, sort_order)
);

-- ③ 진행 방식
create table public.landing_process_steps (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  code text not null,
  title text not null,
  description text not null,
  description_mobile text,
  sort_order integer not null,
  unique (page_slug, sort_order)
);

-- ④ 비교정보 7항목
create table public.landing_candidates (
  id text primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  display_order integer not null check (display_order > 0),
  artwork_id text not null references public.artworks (id),
  quality_note text not null,
  quality_note_mobile text,
  generation text not null,
  generation_mobile text,
  variations text not null,
  variations_mobile text,
  base_price integer not null check (base_price >= 0),
  lead_days integer not null check (lead_days > 0),
  license text not null,
  unique (page_slug, display_order)
);
comment on column public.landing_candidates.base_price is '기준 가격 — 원 단위 정수(공급가).';
comment on column public.landing_candidates.lead_days is '기준 납기 — 영업일.';

create table public.landing_compare_examples (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  caption text not null,
  caption_mobile text,
  default_candidate_id text not null references public.landing_candidates (id)
);

create table public.landing_compare_row_labels (
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  position smallint not null check (position between 0 and 6),
  label text not null,
  label_mobile text,
  primary key (page_slug, position)
);
comment on table public.landing_compare_row_labels is '비교정보 7항목 라벨 — 순서·문구 고정(① 대표 이미지 … ⑦ 라이선스).';

-- ⑤ 샘플 작품
create table public.landing_sample_sections (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  more_label text not null,
  initial_count_mobile integer not null check (initial_count_mobile > 0),
  initial_count_desktop integer not null check (initial_count_desktop > 0)
);

create table public.landing_sample_items (
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  artwork_id text not null references public.artworks (id),
  sort_order integer not null,
  primary key (page_slug, artwork_id),
  unique (page_slug, sort_order)
);

-- ⑥ 운영 규칙 숫자
create table public.landing_operating_rules (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  value text not null,
  unit text not null,
  title text not null,
  description text not null,
  description_mobile text,
  emphasis boolean not null default false,
  sort_order integer not null,
  unique (page_slug, sort_order)
);
comment on table public.landing_operating_rules is '운영 규칙 숫자만(48시간 · 후보 2~5개 · 수정 2회 · 라이선스 증서). 검증되지 않은 수치 금지.';

-- ⑦ 이용 조건 요약 + FAQ
create table public.landing_terms_sections (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  detail_link_label text not null,
  detail_link_href text not null,
  faq_title text not null
);

create table public.landing_term_rows (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  label text not null,
  value text not null,
  value_mobile text,
  mono_prefix text,
  note text,
  note_mobile text,
  desktop_only boolean not null default false,
  sort_order integer not null,
  unique (page_slug, sort_order)
);
comment on column public.landing_term_rows.mono_prefix is '값 앞부분 중 JetBrains Mono로 보일 금액 등.';

create table public.landing_faqs (
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  id text not null,
  question text not null,
  answer text not null,
  answer_mobile text,
  sort_order integer not null,
  primary key (page_slug, id),
  unique (page_slug, sort_order)
);

-- ⑧ 최종 CTA
create table public.landing_final_ctas (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  overline text not null,
  title_lines text[] not null check (cardinality(title_lines) > 0),
  title_lines_mobile text[],
  description text not null,
  primary_cta text not null,
  secondary_cta_label text not null,
  secondary_cta_href text not null
);

-- 푸터
create table public.landing_footers (
  page_slug text primary key references public.landing_pages (slug) on delete cascade,
  tagline text not null,
  copyright text not null,
  creator_contact_label text not null,
  creator_contact_link_label text not null,
  creator_contact_link_label_mobile text,
  creator_contact_href text not null
);

create table public.landing_footer_links (
  id bigint generated always as identity primary key,
  page_slug text not null references public.landing_pages (slug) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null,
  unique (page_slug, sort_order)
);

-- 외래키 인덱스
create index landing_hero_showcase_items_artwork_id_idx on public.landing_hero_showcase_items (artwork_id);
create index landing_candidates_artwork_id_idx on public.landing_candidates (artwork_id);
create index landing_compare_examples_default_candidate_id_idx on public.landing_compare_examples (default_candidate_id);
create index landing_sample_items_artwork_id_idx on public.landing_sample_items (artwork_id);

-- ─────────────────────────────────────────────────────────────
-- 에이전시 가입 신청 (ApplicationInput)
-- ─────────────────────────────────────────────────────────────
create sequence public.agency_application_code_seq;

create table public.agency_applications (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default (
    'APP-' || to_char(now() at time zone 'Asia/Seoul', 'YYYY') || '-'
    || lpad(nextval('public.agency_application_code_seq')::text, 4, '0')
  ),
  company text not null check (length(btrim(company)) > 0),
  contact_name text not null check (length(btrim(contact_name)) > 0),
  email text not null check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  agree_privacy boolean not null check (agree_privacy),
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter sequence public.agency_application_code_seq owned by public.agency_applications.code;
create unique index agency_applications_email_key on public.agency_applications (lower(email));
comment on table public.agency_applications is '랜딩 "브리프 보내기" 가입 신청. 서버(secret key)만 읽고 쓴다.';
comment on column public.agency_applications.code is '신청 번호 APP-YYYY-NNNN.';

-- ─────────────────────────────────────────────────────────────
-- updated_at 트리거
-- ─────────────────────────────────────────────────────────────
create trigger artworks_set_updated_at before update on public.artworks
  for each row execute function public.set_updated_at();
create trigger landing_pages_set_updated_at before update on public.landing_pages
  for each row execute function public.set_updated_at();
create trigger landing_heroes_set_updated_at before update on public.landing_heroes
  for each row execute function public.set_updated_at();
create trigger agency_applications_set_updated_at before update on public.agency_applications
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 권한 · RLS
--   콘텐츠 테이블: 누구나 읽기만(anon · authenticated). 쓰기는 대시보드·secret key(service_role)로만.
--   agency_applications: 정책 없음 → anon · authenticated 접근 불가, 서버의 secret key(service_role)만.
--   새 프로젝트는 SQL로 만든 테이블에 Data API 권한을 자동으로 주지 않으므로 GRANT를 명시한다.
-- ─────────────────────────────────────────────────────────────
do $$
declare
  content_table text;
begin
  foreach content_table in array array[
    'artworks',
    'landing_pages',
    'landing_nav_items',
    'landing_heroes',
    'landing_hero_showcase_items',
    'landing_section_headings',
    'landing_problem_items',
    'landing_process_steps',
    'landing_candidates',
    'landing_compare_examples',
    'landing_compare_row_labels',
    'landing_sample_sections',
    'landing_sample_items',
    'landing_operating_rules',
    'landing_terms_sections',
    'landing_term_rows',
    'landing_faqs',
    'landing_final_ctas',
    'landing_footers',
    'landing_footer_links'
  ]
  loop
    execute format('alter table public.%I enable row level security', content_table);
    execute format('revoke all on public.%I from anon, authenticated', content_table);
    execute format('grant select on public.%I to anon, authenticated', content_table);
    execute format('grant select, insert, update, delete on public.%I to service_role', content_table);
    execute format(
      'create policy "공개 읽기" on public.%I for select to anon, authenticated using (true)',
      content_table
    );
  end loop;
end;
$$;

alter table public.agency_applications enable row level security;
revoke all on public.agency_applications from anon, authenticated;
revoke all on sequence public.agency_application_code_seq from anon, authenticated;
grant select, insert, update, delete on public.agency_applications to service_role;
grant usage, select on sequence public.agency_application_code_seq to service_role;
