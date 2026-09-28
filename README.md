# digital place — 랜딩(P-01)

`references/design/`의 디자인 시스템(`design.md`)과 P-01 목업(데스크톱 1280 · 모바일 390)을 Next.js + shadcn/ui로 옮긴 실제 페이지다. 콘텐츠와 가입 신청은 Supabase에 저장하고, `.env`가 비어 있으면 목업 데이터로 동작한다.

| 항목 | 버전 |
|---|---|
| Next.js (App Router, Turbopack) | 16.3.6 |
| React | 19.2 |
| Tailwind CSS | 4.3 |
| shadcn/ui (Radix base) | 4.21 |
| Supabase (`@supabase/supabase-js`) | 2.117 |
| 글꼴 | Pretendard Variable 1.3.9(dynamic subset) · JetBrains Mono(latin, `src/app/fonts`) |

## 실행

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

## 구조

```text
src/
├── app/
│   ├── globals.css              # 디자인 토큰(--dp-*) → shadcn 시맨틱 변수 → Tailwind 유틸리티
│   ├── layout.tsx               # lang=ko, 다크 단일, 글꼴, Toaster
│   ├── page.tsx                 # P-01 랜딩 조립
│   ├── not-found.tsx            # 404 "페이지를 찾을 수 없어요"
│   └── api/applications/route.ts  # 가입 신청 API — Supabase 저장(목업 모드면 메모리)
├── components/
│   ├── ui/                      # shadcn 컴포넌트 — design.md 규격으로 수정함
│   ├── brand/wordmark.tsx       # 임시 워드마크(A-20)
│   └── landing/                 # 섹션 ①~⑧ + 헤더·푸터·ArtworkFrame·Reveal
└── lib/
    ├── landing/
    │   ├── types.ts             # 콘텐츠 타입
    │   ├── mock-data.ts         # 목업 문구·작품·후보·FAQ (seed.sql의 원본)
    │   ├── supabase-repository.ts  # Supabase 테이블 → LandingContent
    │   └── get-landing-content.ts  # 데이터 진입점 — .env 있으면 Supabase, 없으면 목업
    ├── supabase/
    │   ├── env.ts               # 환경변수 읽기·검증
    │   ├── server.ts            # 서버용 클라이언트(publishable 읽기 · secret 쓰기)
    │   └── database.types.ts    # 스키마에서 생성한 타입(pnpm db:types)
    ├── applications/schema.ts   # 가입 신청 검증(클라이언트·API 공용)
    └── utils.ts                 # cn — 타입 스케일(text-h1 …)을 알려 준 클래스 병합기
supabase/
├── migrations/20260928000000_landing_content.sql  # 테이블 21개 · RLS · 권한
└── seed.sql                     # 목업 데이터(자동 생성 — 직접 고치지 않는다)
scripts/
├── generate-seed.ts             # mock-data.ts → seed.sql
└── db.ts                        # db:push · db:types
```

## Supabase

### 환경변수(`.env`, 커밋 안 됨 — 형식은 `.env.example`)

| 변수 | 쓰임 | 확인 위치 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 프로젝트 URL | Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개 콘텐츠 읽기(`sb_publishable_…`) | Project Settings → API Keys |
| `SUPABASE_SECRET_KEY` | 가입 신청 저장, 서버 전용(`sb_secret_…`) | Project Settings → API Keys |
| `SUPABASE_DB_URL` | `pnpm db:push` 전용 DB 연결 문자열 | 상단 Connect → Session pooler |

세 키가 모두 비어 있으면 목업 모드, 일부만 있으면 설정 오류로 멈춘다.

### 명령

```bash
pnpm db:push              # 마이그레이션 + seed.sql을 클라우드 DB에 반영(--dry-run 가능)
pnpm db:seed:generate     # mock-data.ts를 고친 뒤 seed.sql 다시 만들기 → pnpm db:push
pnpm db:types             # 스키마가 바뀌면 타입 다시 생성(처음 한 번 supabase login 필요)
```

- 테이블은 `types.ts`의 타입마다 하나씩이다(`landing_heroes` = `HeroContent` …). 모바일 문구는 `{컬럼}_mobile` — null이면 기본 문구, `''`이면 모바일에서 숨김.
- 콘텐츠 테이블은 누구나 읽기만 가능(RLS "공개 읽기"). `agency_applications`는 공개 정책이 없어 서버의 secret key로만 읽고 쓴다.
- 페이지는 60초마다 다시 만든다(ISR `revalidate = 60`) — 대시보드에서 문구를 고치면 최대 1분 뒤 반영된다.
- `seed.sql`은 다시 실행해도 같다(작품 upsert, 랜딩 페이지 `home`은 지우고 새로 넣음). 단, `pnpm db:push`는 seed.sql이 바뀌었을 때만 다시 넣는다.
- 신청 번호(`APP-YYYY-NNNN`)는 시퀀스라 중복 이메일처럼 실패한 신청이 있으면 번호가 건너뛸 수 있다.

## 동작하는 것

- **브리프 보내기**(상단 바 · 히어로 · 모바일 메뉴 · 최종 CTA) → 가입 신청 Dialog → `POST /api/applications`
  - 빈 값·이메일 형식·동의 누락은 필드 아래 에러 문구 + 첫 에러 필드로 포커스
  - Supabase `agency_applications`에 저장, 같은 이메일(대소문자 무시)은 409
  - `demo@agency.co.kr`는 "이미 신청한 이메일"(409) 흐름 확인용 데모 행
  - 성공하면 토스트로 신청 번호를 알려 준다
- **상단 바 CTA**: 히어로·최종 CTA의 primary가 화면에 보이면 secondary, 벗어나면 primary(design.md Known Gaps #2 제안 적용)
- **후보 비교 예시**: 후보를 눌러(또는 Tab + Enter/Space) 선택 — 데스크톱 표 / 1024px 미만 카드 스택
- **샘플 더 보기**: 처음 모바일 4 · 태블릿 이상 6개, 펼치면 9개
- **FAQ**: 한 번에 하나만 펼치는 아코디언(첫 항목 열림)
- **모바일 메뉴**: 오른쪽 Sheet, 메뉴를 닫은 뒤 섹션으로 이동

## 작품 이미지

`public/images/samples/*.webp` 9장은 `codex-image`(Codex CLI `image_generation`)로 만든 **자리표시 이미지**다. 1024~1536px 원본을 게재 규격 비율(4:5 · 1:1 · 1.91:1 · 9:16)로 잘라 WebP로 저장했고, 히어로의 `summer-terrace-square.webp`는 같은 작품의 정사각 리크롭 변형이다. design.md 원칙대로 배포 전 크리에이터가 승인한 공개 샘플로 바꾼다 — Supabase `artworks` 테이블의 `src`·`width`·`height`를 고친다(이미지 파일은 아직 `public/`에 있다).

## 아직 없는 페이지

`/login`, `/guide`, `/legal/terms`, `/legal/privacy`는 링크만 있고 페이지는 없다(404로 연결, 프리페치 끔). 푸터 크리에이터 문의 주소(`creators@example.com`)도 가상 데이터다.

## 유의사항

- shadcn CLI로 컴포넌트를 추가하면 `import { cn } from "cn"`이 들어간다. `@/lib/utils`로 바꿔야 `text-overline text-muted-foreground` 같은 조합에서 크기 클래스가 지워지지 않는다.
- 색·간격·반경은 `globals.css`의 토큰 유틸리티만 쓴다(`bg-surface`, `text-sub`, `border-border-strong`, `rounded-md` …). 새 색이 필요하면 design.md에 먼저 추가한다.
# sample-homepage
