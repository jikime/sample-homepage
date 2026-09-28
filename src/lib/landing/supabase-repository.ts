import "server-only"

import type { Tables } from "@/lib/supabase/database.types"
import type { SupabasePublicConfig } from "@/lib/supabase/env"
import { createSupabaseReader } from "@/lib/supabase/server"
import { ARTWORKS_BUCKET } from "@/lib/supabase/storage"

import type {
  Artwork,
  HeroShowcaseItem,
  LandingContent,
  Responsive,
  SectionHeading,
} from "./types"

/**
 * Supabase 테이블(supabase/migrations/*_landing_content.sql) → LandingContent.
 * 한 번의 요청으로 페이지 하위 테이블을 모두 embed해 가져오고, 작품은 따로 읽는다.
 * 작품 이미지는 Storage bucket "artworks"의 경로를 공개 URL로 바꿔 넘긴다.
 */
const LANDING_PAGE_SELECT = `
  slug,
  login_href,
  landing_nav_items ( label, href, sort_order ),
  landing_heroes ( * ),
  landing_hero_showcase_items ( layout, position, artwork_id, variant_storage_path, variant_width, variant_height, variant_size_label ),
  landing_section_headings ( * ),
  landing_problem_items ( * ),
  landing_process_steps ( * ),
  landing_candidates ( * ),
  landing_compare_examples ( * ),
  landing_compare_row_labels ( * ),
  landing_sample_sections ( * ),
  landing_sample_items ( artwork_id, sort_order ),
  landing_operating_rules ( * ),
  landing_terms_sections ( * ),
  landing_term_rows ( * ),
  landing_faqs ( * ),
  landing_final_ctas ( * ),
  landing_footers ( * ),
  landing_footer_links ( label, href, sort_order )
`

type SectionKey = "problem" | "process" | "compare" | "samples" | "rules" | "terms"

export async function fetchLandingContent(config: SupabasePublicConfig, slug = "home"): Promise<LandingContent> {
  const supabase = createSupabaseReader(config)
  const bucket = supabase.storage.from(ARTWORKS_BUCKET)
  const publicUrl = (path: string) => bucket.getPublicUrl(path).data.publicUrl
  const [pageResult, artworksResult] = await Promise.all([
    supabase.from("landing_pages").select(LANDING_PAGE_SELECT).eq("slug", slug).maybeSingle(),
    supabase.from("artworks").select("*"),
  ])

  if (pageResult.error) throw new Error(`랜딩 콘텐츠를 불러오지 못했어요: ${pageResult.error.message}`)
  if (artworksResult.error) throw new Error(`작품 목록을 불러오지 못했어요: ${artworksResult.error.message}`)
  const page = pageResult.data
  if (!page) throw new Error(`랜딩 페이지(${slug})가 없어요. pnpm db:push로 목업 데이터를 넣었는지 확인해 주세요.`)

  const hero = required(page.landing_heroes, "landing_heroes")
  const compareExample = required(page.landing_compare_examples, "landing_compare_examples")
  const sampleSection = required(page.landing_sample_sections, "landing_sample_sections")
  const termsSection = required(page.landing_terms_sections, "landing_terms_sections")
  const finalCta = required(page.landing_final_ctas, "landing_final_ctas")
  const footer = required(page.landing_footers, "landing_footers")
  const heading = headingLookup(page.landing_section_headings)
  const showcase = page.landing_hero_showcase_items

  return {
    nav: bySortOrder(page.landing_nav_items).map(({ label, href }) => ({ label, href })),
    loginHref: page.login_href,
    hero: {
      overline: responsive(hero.overline, hero.overline_mobile),
      headline: { lines: hero.headline_lines, accent: hero.headline_accent },
      description: responsive(hero.description, hero.description_mobile),
      note: responsive(hero.note, hero.note_mobile),
      primaryCta: hero.primary_cta,
      secondaryCta: { label: hero.secondary_cta_label, href: hero.secondary_cta_href },
      desktopShowcase: showcaseTuple(showcase, "desktop", 3, publicUrl) as LandingContent["hero"]["desktopShowcase"],
      mobileShowcase: showcaseTuple(showcase, "mobile", 2, publicUrl) as LandingContent["hero"]["mobileShowcase"],
    },
    problem: {
      heading: heading("problem"),
      items: bySortOrder(page.landing_problem_items).map((item) => ({
        code: item.code,
        label: item.label,
        title: item.title,
        problem: item.problem,
        solution: item.solution,
      })),
    },
    process: {
      heading: heading("process"),
      steps: bySortOrder(page.landing_process_steps).map((step) => ({
        code: step.code,
        title: step.title,
        description: responsive(step.description, step.description_mobile),
      })),
    },
    compare: {
      heading: heading("compare"),
      example: {
        caption: responsive(compareExample.caption, compareExample.caption_mobile),
        rowLabels: [...page.landing_compare_row_labels]
          .sort((a, b) => a.position - b.position)
          .map((row) => responsive(row.label, row.label_mobile)),
        candidates: [...page.landing_candidates]
          .sort((a, b) => a.display_order - b.display_order)
          .map((candidate) => ({
            id: candidate.id,
            order: candidate.display_order,
            artworkId: candidate.artwork_id,
            qualityNote: responsive(candidate.quality_note, candidate.quality_note_mobile),
            generation: responsive(candidate.generation, candidate.generation_mobile),
            variations: responsive(candidate.variations, candidate.variations_mobile),
            basePrice: candidate.base_price,
            leadDays: candidate.lead_days,
            license: candidate.license,
          })),
        defaultSelectedId: compareExample.default_candidate_id,
      },
    },
    samples: {
      heading: heading("samples"),
      moreLabel: sampleSection.more_label,
      initialCount: {
        mobile: sampleSection.initial_count_mobile,
        desktop: sampleSection.initial_count_desktop,
      },
      artworkIds: bySortOrder(page.landing_sample_items).map((item) => item.artwork_id),
    },
    rules: {
      heading: heading("rules"),
      items: bySortOrder(page.landing_operating_rules).map((rule) => ({
        value: rule.value,
        unit: rule.unit,
        title: rule.title,
        description: responsive(rule.description, rule.description_mobile),
        ...(rule.emphasis ? { emphasis: true } : {}),
      })),
    },
    terms: {
      heading: heading("terms"),
      rows: bySortOrder(page.landing_term_rows).map((row) => ({
        label: row.label,
        value: responsive(row.value, row.value_mobile),
        ...(row.mono_prefix !== null ? { monoPrefix: row.mono_prefix } : {}),
        ...(row.note !== null ? { note: responsive(row.note, row.note_mobile) } : {}),
        ...(row.desktop_only ? { desktopOnly: true } : {}),
      })),
      detailLink: { label: termsSection.detail_link_label, href: termsSection.detail_link_href },
      faqTitle: termsSection.faq_title,
      faqs: bySortOrder(page.landing_faqs).map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: responsive(faq.answer, faq.answer_mobile),
      })),
    },
    finalCta: {
      overline: finalCta.overline,
      title: responsiveLines(finalCta.title_lines, finalCta.title_lines_mobile),
      description: finalCta.description,
      primaryCta: finalCta.primary_cta,
      secondaryCta: { label: finalCta.secondary_cta_label, href: finalCta.secondary_cta_href },
    },
    footer: {
      tagline: footer.tagline,
      copyright: footer.copyright,
      creatorContact: {
        label: footer.creator_contact_label,
        linkLabel: responsive(footer.creator_contact_link_label, footer.creator_contact_link_label_mobile),
        href: footer.creator_contact_href,
      },
      policies: bySortOrder(page.landing_footer_links).map(({ label, href }) => ({ label, href })),
    },
    artworks: Object.fromEntries(artworksResult.data.map((row) => [row.id, toArtwork(row, publicUrl)])),
  }
}

/** {컬럼}_mobile 이 null 이면 모바일도 기본 문구 → mobile 키를 두지 않는다('' 은 그대로 = 모바일에서 숨김) */
function responsive(base: string, mobile: string | null): Responsive<string> {
  return mobile === null ? { base } : { base, mobile }
}

function responsiveLines(base: string[], mobile: string[] | null): Responsive<string[]> {
  return mobile === null ? { base } : { base, mobile }
}

function bySortOrder<T extends { sort_order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order)
}

function required<T>(value: T | null, table: string): T {
  if (value === null) throw new Error(`랜딩 콘텐츠에 ${table} 행이 없어요.`)
  return value
}

function headingLookup(rows: Tables<"landing_section_headings">[]) {
  return (section: SectionKey): SectionHeading => {
    const row = rows.find((candidate) => candidate.section === section)
    if (!row) throw new Error(`landing_section_headings에 ${section} 행이 없어요.`)
    return {
      overline: row.overline,
      title: responsiveLines(row.title_lines, row.title_lines_mobile),
      ...(row.description !== null ? { description: responsive(row.description, row.description_mobile) } : {}),
    }
  }
}

type ShowcaseRow = Pick<
  Tables<"landing_hero_showcase_items">,
  "layout" | "position" | "artwork_id" | "variant_storage_path" | "variant_width" | "variant_height" | "variant_size_label"
>

type PublicUrl = (storagePath: string) => string

function showcaseTuple(
  rows: ShowcaseRow[],
  layout: "desktop" | "mobile",
  expected: number,
  publicUrl: PublicUrl
): HeroShowcaseItem[] {
  const items = rows
    .filter((row) => row.layout === layout)
    .sort((a, b) => a.position - b.position)
    .map((row): HeroShowcaseItem => {
      const hasVariant =
        row.variant_storage_path !== null &&
        row.variant_width !== null &&
        row.variant_height !== null &&
        row.variant_size_label !== null
      return {
        artworkId: row.artwork_id,
        ...(hasVariant
          ? {
              variant: {
                src: publicUrl(row.variant_storage_path!),
                width: row.variant_width!,
                height: row.variant_height!,
                sizeLabel: row.variant_size_label!,
              },
            }
          : {}),
      }
    })
  if (items.length !== expected) {
    throw new Error(`히어로 쇼케이스(${layout})는 ${expected}장이어야 해요. 지금 ${items.length}장이에요.`)
  }
  return items
}

function toArtwork(row: Tables<"artworks">, publicUrl: PublicUrl): Artwork {
  return {
    id: row.id,
    title: row.title,
    creator: row.creator,
    src: publicUrl(row.storage_path),
    width: row.width,
    height: row.height,
    sizeLabel: row.size_label,
    category: row.category,
    tone: row.tone,
    placement: row.placement,
    placementShort: row.placement_short,
  }
}
