import { getArtwork } from "@/lib/landing/artworks"
import type { LandingContent } from "@/lib/landing/types"

import { Container } from "./primitives"
import { SampleGallery } from "./sample-gallery"

/** ⑤ 샘플 작품 */
export function SamplesSection({
  samples,
  artworks,
}: {
  samples: LandingContent["samples"]
  artworks: LandingContent["artworks"]
}) {
  return (
    <section id="samples" aria-labelledby="samples-title" className="pb-16 lg:pb-24">
      <Container className="flex flex-col gap-6 lg:gap-12">
        <SampleGallery
          heading={samples.heading}
          artworks={samples.artworkIds.map((id) => getArtwork({ artworks }, id))}
          moreLabel={samples.moreLabel}
          initialCount={samples.initialCount}
        />
      </Container>
    </section>
  )
}
