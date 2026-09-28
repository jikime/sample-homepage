/**
 * src/lib/landing/mock-data.ts 를 그대로 supabase/seed.sql 로 옮긴다.
 *   pnpm db:seed:generate
 * 목업 문구를 고치면 이 스크립트로 seed.sql을 다시 만든 뒤 `pnpm db:push`로 반영한다.
 */
import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { landingMock } from "../src/lib/landing/mock-data"
import type { HeroShowcaseItem, Responsive } from "../src/lib/landing/types"
import { toArtworkStoragePath } from "../src/lib/supabase/storage"

const PAGE_SLUG = "home"
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), "../supabase/seed.sql")

/** mock-data.ts 의 "이미 신청한 이메일" 데모 행(409 흐름 확인용) */
const DEMO_APPLICATION = {
  company: "데모 에이전시",
  contact_name: "데모 담당자",
  email: "demo@agency.co.kr",
  agree_privacy: true,
}

type SqlValue = string | number | boolean | null | undefined | string[]

function literal(value: SqlValue): string {
  if (value === null || value === undefined) return "null"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return value ? "true" : "false"
  if (Array.isArray(value)) return `array[${value.map(literal).join(", ")}]::text[]`
  return `'${value.replaceAll("'", "''")}'`
}

function insert(table: string, rows: Record<string, SqlValue>[], conflict?: string): string {
  if (rows.length === 0) return ""
  const columns = Object.keys(rows[0]!)
  const values = rows.map((row) => `  (${columns.map((column) => literal(row[column])).join(", ")})`).join(",\n")
  return `insert into public.${table} (${columns.join(", ")}) values\n${values}${conflict ? `\n${conflict}` : ""};\n`
}

/** Responsive<string> → [기본, 모바일]. 모바일 문구가 없으면 null */
function responsive(value: Responsive<string>): [string, string | null] {
  return [value.base, value.mobile ?? null]
}

const content = landingMock
const statements: string[] = []

// 작품 — 다른 페이지에서도 쓸 수 있어 upsert
statements.push(
  insert(
    "artworks",
    Object.values(content.artworks).map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      creator: artwork.creator,
      storage_path: toArtworkStoragePath(artwork.src),
      width: artwork.width,
      height: artwork.height,
      size_label: artwork.sizeLabel,
      category: artwork.category,
      tone: artwork.tone,
      placement: artwork.placement,
      placement_short: artwork.placementShort,
    })),
    `on conflict (id) do update set
  title = excluded.title, creator = excluded.creator, storage_path = excluded.storage_path,
  width = excluded.width, height = excluded.height, size_label = excluded.size_label,
  category = excluded.category, tone = excluded.tone, placement = excluded.placement,
  placement_short = excluded.placement_short`
  )
)

// 페이지 — 다시 넣을 때는 하위 테이블까지 지우고(on delete cascade) 새로 넣는다
statements.push(`delete from public.landing_pages where slug = ${literal(PAGE_SLUG)};\n`)
statements.push(insert("landing_pages", [{ slug: PAGE_SLUG, login_href: content.loginHref }]))

statements.push(
  insert(
    "landing_nav_items",
    content.nav.map((item, index) => ({ page_slug: PAGE_SLUG, label: item.label, href: item.href, sort_order: index }))
  )
)

const { hero } = content
const [heroOverline, heroOverlineMobile] = responsive(hero.overline)
const [heroDescription, heroDescriptionMobile] = responsive(hero.description)
const [heroNote, heroNoteMobile] = responsive(hero.note)
statements.push(
  insert("landing_heroes", [
    {
      page_slug: PAGE_SLUG,
      overline: heroOverline,
      overline_mobile: heroOverlineMobile,
      headline_lines: hero.headline.lines,
      headline_accent: hero.headline.accent,
      description: heroDescription,
      description_mobile: heroDescriptionMobile,
      note: heroNote,
      note_mobile: heroNoteMobile,
      primary_cta: hero.primaryCta,
      secondary_cta_label: hero.secondaryCta.label,
      secondary_cta_href: hero.secondaryCta.href,
    },
  ])
)

const showcaseRow = (layout: "desktop" | "mobile") => (item: HeroShowcaseItem, position: number) => ({
  page_slug: PAGE_SLUG,
  layout,
  position,
  artwork_id: item.artworkId,
  variant_storage_path: item.variant ? toArtworkStoragePath(item.variant.src) : null,
  variant_width: item.variant?.width ?? null,
  variant_height: item.variant?.height ?? null,
  variant_size_label: item.variant?.sizeLabel ?? null,
})
statements.push(
  insert("landing_hero_showcase_items", [
    ...hero.desktopShowcase.map(showcaseRow("desktop")),
    ...hero.mobileShowcase.map(showcaseRow("mobile")),
  ])
)

const headings = {
  problem: content.problem.heading,
  process: content.process.heading,
  compare: content.compare.heading,
  samples: content.samples.heading,
  rules: content.rules.heading,
  terms: content.terms.heading,
}
statements.push(
  insert(
    "landing_section_headings",
    Object.entries(headings).map(([section, heading]) => ({
      page_slug: PAGE_SLUG,
      section,
      overline: heading.overline,
      title_lines: heading.title.base,
      title_lines_mobile: heading.title.mobile ?? null,
      description: heading.description?.base ?? null,
      description_mobile: heading.description?.mobile ?? null,
    }))
  )
)

statements.push(
  insert(
    "landing_problem_items",
    content.problem.items.map((item, index) => ({
      page_slug: PAGE_SLUG,
      code: item.code,
      label: item.label,
      title: item.title,
      problem: item.problem,
      solution: item.solution,
      sort_order: index,
    }))
  )
)

statements.push(
  insert(
    "landing_process_steps",
    content.process.steps.map((step, index) => {
      const [description, descriptionMobile] = responsive(step.description)
      return {
        page_slug: PAGE_SLUG,
        code: step.code,
        title: step.title,
        description,
        description_mobile: descriptionMobile,
        sort_order: index,
      }
    })
  )
)

const { example } = content.compare
statements.push(
  insert(
    "landing_candidates",
    example.candidates.map((candidate) => {
      const [qualityNote, qualityNoteMobile] = responsive(candidate.qualityNote)
      const [generation, generationMobile] = responsive(candidate.generation)
      const [variations, variationsMobile] = responsive(candidate.variations)
      return {
        id: candidate.id,
        page_slug: PAGE_SLUG,
        display_order: candidate.order,
        artwork_id: candidate.artworkId,
        quality_note: qualityNote,
        quality_note_mobile: qualityNoteMobile,
        generation,
        generation_mobile: generationMobile,
        variations,
        variations_mobile: variationsMobile,
        base_price: candidate.basePrice,
        lead_days: candidate.leadDays,
        license: candidate.license,
      }
    })
  )
)

const [caption, captionMobile] = responsive(example.caption)
statements.push(
  insert("landing_compare_examples", [
    {
      page_slug: PAGE_SLUG,
      caption,
      caption_mobile: captionMobile,
      default_candidate_id: example.defaultSelectedId,
    },
  ])
)

statements.push(
  insert(
    "landing_compare_row_labels",
    example.rowLabels.map((label, position) => ({
      page_slug: PAGE_SLUG,
      position,
      label: label.base,
      label_mobile: label.mobile ?? null,
    }))
  )
)

statements.push(
  insert("landing_sample_sections", [
    {
      page_slug: PAGE_SLUG,
      more_label: content.samples.moreLabel,
      initial_count_mobile: content.samples.initialCount.mobile,
      initial_count_desktop: content.samples.initialCount.desktop,
    },
  ])
)
statements.push(
  insert(
    "landing_sample_items",
    content.samples.artworkIds.map((artworkId, index) => ({
      page_slug: PAGE_SLUG,
      artwork_id: artworkId,
      sort_order: index,
    }))
  )
)

statements.push(
  insert(
    "landing_operating_rules",
    content.rules.items.map((rule, index) => {
      const [description, descriptionMobile] = responsive(rule.description)
      return {
        page_slug: PAGE_SLUG,
        value: rule.value,
        unit: rule.unit,
        title: rule.title,
        description,
        description_mobile: descriptionMobile,
        emphasis: rule.emphasis ?? false,
        sort_order: index,
      }
    })
  )
)

statements.push(
  insert("landing_terms_sections", [
    {
      page_slug: PAGE_SLUG,
      detail_link_label: content.terms.detailLink.label,
      detail_link_href: content.terms.detailLink.href,
      faq_title: content.terms.faqTitle,
    },
  ])
)
statements.push(
  insert(
    "landing_term_rows",
    content.terms.rows.map((row, index) => {
      const [value, valueMobile] = responsive(row.value)
      return {
        page_slug: PAGE_SLUG,
        label: row.label,
        value,
        value_mobile: valueMobile,
        mono_prefix: row.monoPrefix ?? null,
        note: row.note?.base ?? null,
        note_mobile: row.note?.mobile ?? null,
        desktop_only: row.desktopOnly ?? false,
        sort_order: index,
      }
    })
  )
)
statements.push(
  insert(
    "landing_faqs",
    content.terms.faqs.map((faq, index) => {
      const [answer, answerMobile] = responsive(faq.answer)
      return {
        page_slug: PAGE_SLUG,
        id: faq.id,
        question: faq.question,
        answer,
        answer_mobile: answerMobile,
        sort_order: index,
      }
    })
  )
)

const { finalCta } = content
statements.push(
  insert("landing_final_ctas", [
    {
      page_slug: PAGE_SLUG,
      overline: finalCta.overline,
      title_lines: finalCta.title.base,
      title_lines_mobile: finalCta.title.mobile ?? null,
      description: finalCta.description,
      primary_cta: finalCta.primaryCta,
      secondary_cta_label: finalCta.secondaryCta.label,
      secondary_cta_href: finalCta.secondaryCta.href,
    },
  ])
)

const { footer } = content
const [contactLinkLabel, contactLinkLabelMobile] = responsive(footer.creatorContact.linkLabel)
statements.push(
  insert("landing_footers", [
    {
      page_slug: PAGE_SLUG,
      tagline: footer.tagline,
      copyright: footer.copyright,
      creator_contact_label: footer.creatorContact.label,
      creator_contact_link_label: contactLinkLabel,
      creator_contact_link_label_mobile: contactLinkLabelMobile,
      creator_contact_href: footer.creatorContact.href,
    },
  ])
)
statements.push(
  insert(
    "landing_footer_links",
    footer.policies.map((policy, index) => ({
      page_slug: PAGE_SLUG,
      label: policy.label,
      href: policy.href,
      sort_order: index,
    }))
  )
)

statements.push(insert("agency_applications", [DEMO_APPLICATION], "on conflict ((lower(email))) do nothing"))

const header = `-- 자동 생성 파일 — 직접 고치지 마세요.
-- 원본: src/lib/landing/mock-data.ts · 생성: pnpm db:seed:generate (scripts/generate-seed.ts)
-- 다시 실행해도 결과가 같다: 작품은 upsert, 랜딩 페이지(${PAGE_SLUG})는 지우고 새로 넣는다.

`
writeFileSync(OUTPUT, header + statements.filter(Boolean).join("\n"))
console.log(`seed.sql 생성: ${OUTPUT}`)
