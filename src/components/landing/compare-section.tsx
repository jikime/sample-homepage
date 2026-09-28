import type { LandingContent } from "@/lib/landing/types"

import { CompareExample } from "./compare-example"
import { Container, SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

/** ④ 비교정보 7항목 */
export function CompareSection({
  compare,
  artworks,
}: {
  compare: LandingContent["compare"]
  artworks: LandingContent["artworks"]
}) {
  return (
    <section aria-labelledby="compare-title" className="pb-16 lg:pb-24">
      <Container className="flex flex-col gap-6 lg:gap-12">
        <Reveal>
          <SectionHeading heading={compare.heading} titleId="compare-title" />
        </Reveal>
        <Reveal index={1}>
          <CompareExample example={compare.example} artworks={artworks} />
        </Reveal>
      </Container>
    </section>
  )
}
