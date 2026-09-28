"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import type { Artwork, SectionHeading as SectionHeadingData } from "@/lib/landing/types"

import { ArtworkFrame } from "./artwork-frame"
import { SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

const GALLERY_ID = "sample-gallery"

/** ⑤ 샘플 작품 — 처음엔 모바일 4개 · 태블릿 이상 6개, "샘플 더 보기"로 나머지를 펼친다. */
export function SampleGallery({
  heading,
  artworks,
  moreLabel,
  initialCount,
}: {
  heading: SectionHeadingData
  artworks: Artwork[]
  moreLabel: string
  initialCount: { mobile: number; desktop: number }
}) {
  const [expanded, setExpanded] = React.useState(false)
  const hasMore = artworks.length > initialCount.mobile
  const label = expanded ? "샘플 접기" : moreLabel

  function toggle() {
    setExpanded((value) => !value)
  }

  return (
    <>
      <Reveal>
        <SectionHeading
          heading={heading}
          titleId="samples-title"
          aside={
            hasMore ? (
              <Button
                variant="secondary"
                className="max-lg:hidden"
                aria-expanded={expanded}
                aria-controls={GALLERY_ID}
                onClick={toggle}
              >
                {label}
                <ArrowRightIcon
                  className={cn("size-4 transition-transform duration-180 ease-enter", expanded && "-rotate-90")}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Button>
            ) : null
          }
        />
      </Reveal>
      <Reveal index={1}>
        <ul id={GALLERY_ID} className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
          {artworks.map((artwork, index) => (
            <li
              key={artwork.id}
              className={cn(
                !expanded && index >= initialCount.desktop && "hidden",
                !expanded && index >= initialCount.mobile && "max-md:hidden"
              )}
            >
              <figure className="flex flex-col gap-2 md:gap-3">
                <ArtworkFrame
                  artwork={artwork}
                  image={artwork}
                  className="h-50 md:h-75"
                  sizes="(min-width: 1280px) 390px, (min-width: 768px) 33vw, 50vw"
                  inset
                />
                <figcaption className="flex flex-col gap-0.5">
                  <span className="text-body-sm font-semibold md:text-body">{artwork.title}</span>
                  <span className="text-caption text-muted-foreground">
                    <span className="md:hidden">{artwork.category}</span>
                    <span className="max-md:hidden">
                      {artwork.category} · {artwork.tone} · {artwork.placement}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
      {hasMore ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto sm:self-center lg:hidden"
          aria-expanded={expanded}
          aria-controls={GALLERY_ID}
          onClick={toggle}
        >
          {label}
        </Button>
      ) : null}
    </>
  )
}
