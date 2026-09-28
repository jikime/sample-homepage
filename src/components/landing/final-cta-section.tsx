import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { LandingContent } from "@/lib/landing/types"

import { ApplyButton } from "./apply-dialog"
import { Container, Overline, RtLines } from "./primitives"
import { Reveal } from "./reveal"

/** ⑧ 최종 CTA — 데스크톱 가운데 정렬 display-xl, 모바일 왼쪽 정렬 display-lg */
export function FinalCtaSection({ finalCta }: { finalCta: LandingContent["finalCta"] }) {
  return (
    <section id="apply" aria-labelledby="apply-title" className="py-20 lg:py-32">
      <Container>
        <Reveal className="flex flex-col gap-5 lg:items-center lg:gap-6 lg:text-center">
          <Overline>{finalCta.overline}</Overline>
          <h2 id="apply-title" className="text-display-lg lg:text-display-xl">
            <RtLines value={finalCta.title} />
          </h2>
          <p className="text-body text-sub lg:text-body-lg">{finalCta.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row lg:mt-2">
            <ApplyButton size="lg" data-primary-cta="" className="w-full sm:w-auto">
              {finalCta.primaryCta}
              <ArrowRightIcon className="size-5" strokeWidth={1.75} aria-hidden />
            </ApplyButton>
            <Button asChild variant="secondary" size="lg" className="max-lg:hidden">
              <Link href={finalCta.secondaryCta.href} prefetch={false}>{finalCta.secondaryCta.label}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
