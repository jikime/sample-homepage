import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { getArtwork } from "@/lib/landing/artworks"
import type { HeroContent, HeroShowcaseItem, LandingContent } from "@/lib/landing/types"

import { ApplyButton } from "./apply-dialog"
import { ArtworkFrame } from "./artwork-frame"
import { Container, Overline, Rt } from "./primitives"

type Artworks = Pick<LandingContent, "artworks">

/** ① 히어로 — 좌 display-xl 헤드라인 + CTA, 우 공개 샘플 3장 비대칭 그리드(모바일 2장) */
export function HeroSection({ hero, artworks }: { hero: HeroContent; artworks: Artworks }) {
  const [tall, square, banner] = hero.desktopShowcase
  const [mobileTall, mobilePortrait] = hero.mobileShowcase

  return (
    <section id="top" aria-labelledby="hero-title">
      <Container className="flex flex-col gap-5 pt-10 pb-16 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:gap-y-0 lg:pt-20 lg:pb-24">
        <div className="flex flex-col gap-5 lg:col-span-6 lg:gap-6">
          <Overline>
            <Rt value={hero.overline} />
          </Overline>
          <h1 id="hero-title" className="text-display-lg lg:text-display-xl">
            {hero.headline.lines.map((line, index) => (
              <span key={line} className="block">
                {line.includes("{accent}") ? (
                  <>
                    {line.split("{accent}")[0]}
                    <span className="text-primary">{hero.headline.accent}</span>
                    {line.split("{accent}")[1]}
                  </>
                ) : (
                  line
                )}
                {index < hero.headline.lines.length - 1 ? <span className="sr-only"> </span> : null}
              </span>
            ))}
          </h1>
          <p className="text-body-lg text-sub lg:max-w-130">
            <Rt value={hero.description} />
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row lg:mt-2">
            <ApplyButton size="lg" data-primary-cta="" className="w-full sm:w-auto">
              {hero.primaryCta}
              <ArrowRightIcon className="size-5" strokeWidth={1.75} aria-hidden />
            </ApplyButton>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </Button>
          </div>
          <p className="text-body-sm text-muted-foreground">
            <Rt value={hero.note} />
          </p>
        </div>

        {/*
          쇼케이스 — 데스크톱: 세로 1장 + (정사각 · 배너), 모바일: 세로 1장 + 4:5 1장.
          두 레이아웃의 세로 작품이 같으면 한 장만 렌더링해 같은 이미지를 두 번 받지 않는다.
        */}
        <div className="mt-3 grid grid-cols-2 items-start gap-x-4 sm:max-w-xl lg:col-span-6 lg:col-start-7 lg:mt-0 lg:max-w-none lg:gap-x-6">
          {isSameShowcaseItem(tall, mobileTall) ? (
            <HeroFigure item={tall} artworks={artworks} frameClassName="aspect-9/16" layout="both" eager />
          ) : (
            <>
              <HeroFigure item={tall} artworks={artworks} frameClassName="aspect-9/16" className="max-lg:hidden" eager />
              <HeroFigure item={mobileTall} artworks={artworks} frameClassName="aspect-9/16" className="lg:hidden" layout="mobile" />
            </>
          )}
          <HeroFigure
            item={mobilePortrait}
            artworks={artworks}
            frameClassName="aspect-4/5"
            className="mt-10 lg:hidden"
            layout="mobile"
          />
          <div className="mt-16 flex flex-col gap-6 max-lg:hidden">
            <HeroFigure item={square} artworks={artworks} frameClassName="aspect-square" />
            <HeroFigure item={banner} artworks={artworks} frameClassName="aspect-1200/628" />
          </div>
        </div>
      </Container>
    </section>
  )
}

function isSameShowcaseItem(a: HeroShowcaseItem, b: HeroShowcaseItem) {
  return a.artworkId === b.artworkId && a.variant?.src === b.variant?.src
}

const FIGURE_SIZES = {
  desktop: "(min-width: 1280px) 300px, 25vw",
  mobile: "(min-width: 640px) 280px, 50vw",
  both: "(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 280px, 50vw",
} as const

/** layout: desktop(≥ lg 캡션 "매체 · 업종") · mobile(< lg 캡션 "업종 · 매체 줄임말") · both(브레이크포인트로 전환) */
function HeroFigure({
  item,
  artworks,
  frameClassName,
  className,
  layout = "desktop",
  eager = false,
}: {
  item: HeroShowcaseItem
  artworks: Artworks
  frameClassName: string
  className?: string
  layout?: "desktop" | "mobile" | "both"
  /** LCP(세로 작품)만 즉시 로드 */
  eager?: boolean
}) {
  const artwork = getArtwork(artworks, item.artworkId)
  const image = item.variant ?? artwork
  const desktopMeta = `${artwork.placement} · ${artwork.category}`
  const mobileMeta = `${artwork.category} · ${artwork.placementShort}`

  return (
    <figure
      className={cn(
        "flex flex-col",
        layout === "desktop" && "gap-3",
        layout === "mobile" && "gap-2",
        layout === "both" && "gap-2 lg:gap-3",
        className
      )}
    >
      <ArtworkFrame
        artwork={artwork}
        image={image}
        className={frameClassName}
        sizes={FIGURE_SIZES[layout]}
        highPriority
        eager={eager}
      />
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-body-sm font-semibold text-foreground">{artwork.title}</span>
        <span className="text-caption text-muted-foreground">
          {layout === "both" ? (
            <>
              <span className="lg:hidden">{mobileMeta}</span>
              <span className="max-lg:hidden">{desktopMeta}</span>
            </>
          ) : layout === "mobile" ? (
            mobileMeta
          ) : (
            desktopMeta
          )}
        </span>
      </figcaption>
    </figure>
  )
}
