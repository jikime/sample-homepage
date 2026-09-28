/**
 * 랜딩(P-01) 콘텐츠 타입.
 * 지금은 mock-data.ts가 채우고, 이후 CMS/API 응답을 같은 모양으로 매핑한다.
 */

/** 모바일(< lg) 화면에서 다른 문구를 쓸 때만 채운다. */
export type Responsive<T> = { base: T; mobile?: T }

export interface Artwork {
  id: string
  /** 작품명 */
  title: string
  /** 크리에이터 표시명 — 고객 화면 alt 텍스트용("{작품명} — {표시명}") */
  creator: string
  src: string
  width: number
  height: number
  /** 규격 라벨(JetBrains Mono로 표시) */
  sizeLabel: string
  /** 업종 */
  category: string
  /** 톤·무드 */
  tone: string
  /** 매체 */
  placement: string
  /** 매체 줄임말(모바일 히어로 캡션) */
  placementShort: string
}

export interface HeroShowcaseItem {
  artworkId: string
  /** 히어로 프레임에 맞춘 표준 변형(리사이즈·리크롭) 이미지가 따로 있으면 지정 */
  variant?: Pick<Artwork, "src" | "width" | "height" | "sizeLabel">
}

export interface HeroContent {
  overline: Responsive<string>
  /** 줄바꿈 단위. accent는 강조 단어(뷰포트당 accent 텍스트 ≤ 3곳) */
  headline: { lines: string[]; accent: string }
  description: Responsive<string>
  note: Responsive<string>
  primaryCta: string
  secondaryCta: { label: string; href: string }
  /** 데스크톱: [세로 1장] + [정사각·배너 2장] 비대칭 */
  desktopShowcase: [HeroShowcaseItem, HeroShowcaseItem, HeroShowcaseItem]
  /** 모바일: 2장 */
  mobileShowcase: [HeroShowcaseItem, HeroShowcaseItem]
}

export interface SectionHeading {
  overline: string
  title: Responsive<string[]>
  description?: Responsive<string>
}

export interface ProblemItem {
  code: string
  label: string
  title: string
  problem: string
  solution: string
}

export interface ProcessStep {
  code: string
  title: string
  description: Responsive<string>
}

export interface Candidate {
  id: string
  order: number
  artworkId: string
  qualityNote: Responsive<string>
  generation: Responsive<string>
  variations: Responsive<string>
  /** 원, 정수 */
  basePrice: number
  /** 영업일 */
  leadDays: number
  license: string
}

export interface CompareExample {
  caption: Responsive<string>
  /** 비교정보 7항목 라벨 — 순서·문구 고정 */
  rowLabels: Responsive<string>[]
  candidates: Candidate[]
  defaultSelectedId: string
}

export interface OperatingRule {
  value: string
  unit: string
  title: string
  description: Responsive<string>
  /** 핵심 숫자 1곳만 accent */
  emphasis?: boolean
}

export interface TermRow {
  label: string
  value: Responsive<string>
  /** 값 중 JetBrains Mono로 보일 앞부분(금액 등) */
  monoPrefix?: string
  note?: Responsive<string>
  /** 모바일에서 생략 */
  desktopOnly?: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: Responsive<string>
}

export interface FooterContent {
  tagline: string
  copyright: string
  creatorContact: { label: string; linkLabel: Responsive<string>; href: string }
  policies: { label: string; href: string }[]
}

export interface NavItem {
  label: string
  href: string
}

export interface LandingContent {
  nav: NavItem[]
  loginHref: string
  hero: HeroContent
  problem: { heading: SectionHeading; items: ProblemItem[] }
  process: { heading: SectionHeading; steps: ProcessStep[] }
  compare: { heading: SectionHeading; example: CompareExample }
  samples: {
    heading: SectionHeading
    moreLabel: string
    /** 처음 보이는 개수 — 모바일 4 · 태블릿 이상 6 */
    initialCount: { mobile: number; desktop: number }
    artworkIds: string[]
  }
  rules: { heading: SectionHeading; items: OperatingRule[] }
  terms: {
    heading: SectionHeading
    rows: TermRow[]
    detailLink: { label: string; href: string }
    faqTitle: string
    faqs: FaqItem[]
  }
  finalCta: {
    overline: string
    title: Responsive<string[]>
    description: string
    primaryCta: string
    secondaryCta: { label: string; href: string }
  }
  footer: FooterContent
  artworks: Record<string, Artwork>
}
