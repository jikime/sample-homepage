import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { LandingContent, TermRow } from "@/lib/landing/types"

import { Container, Rt, SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

/** ⑦ 이용 조건 요약 + 자주 묻는 질문 — 랜딩에서 bg ↔ surface 교차는 이 섹션 1회만 */
export function TermsSection({ terms }: { terms: LandingContent["terms"] }) {
  return (
    <section id="terms" aria-labelledby="terms-title" className="bg-surface py-16 lg:py-24">
      <Container className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
        <Reveal className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading heading={terms.heading} titleId="terms-title" />
          <dl className="flex flex-col border-b border-border">
            {terms.rows.map((row) => (
              <TermRowItem key={row.label} row={row} />
            ))}
          </dl>
          <Link
            href={terms.detailLink.href}
            prefetch={false}
            className="flex min-h-11 items-center gap-2 self-start rounded-md text-body font-semibold text-primary transition-colors duration-120 hover:text-primary-hover max-lg:hidden"
          >
            {terms.detailLink.label}
            <ArrowRightIcon className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </Reveal>

        <Reveal index={1} className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7 lg:gap-8">
          <h3 className="text-h3 lg:pt-8 lg:text-h2">{terms.faqTitle}</h3>
          <Accordion
            type="single"
            collapsible
            defaultValue={terms.faqs[0]?.id}
            className="border-t border-border"
          >
            {terms.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="min-h-14 py-3.5 text-body font-semibold lg:min-h-16 lg:px-3 lg:py-4 lg:text-body-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-body text-sub lg:px-3 lg:pb-5">
                  <p>
                    <Rt value={faq.answer} />
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  )
}

function TermRowItem({ row }: { row: TermRow }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-t border-border py-3 lg:grid lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-4 lg:py-4",
        row.desktopOnly && "max-lg:hidden"
      )}
    >
      <dt className="text-caption text-muted-foreground lg:text-body-sm lg:font-normal lg:tracking-normal">
        {row.label}
      </dt>
      <dd className="text-body">
        {row.monoPrefix ? <span className="font-mono font-medium tabular-nums">{row.monoPrefix}</span> : null}
        <Rt value={row.value} />
        {row.note?.base ? (
          <span className="block text-body-sm text-sub max-lg:hidden">{row.note.base}</span>
        ) : null}
      </dd>
    </div>
  )
}
