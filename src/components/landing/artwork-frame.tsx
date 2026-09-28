import Image from "next/image"
import { cn } from "@/lib/utils"

import type { Artwork } from "@/lib/landing/types"

type FrameImage = Pick<Artwork, "src" | "width" | "height">

/**
 * ArtworkFrame — design.md §12
 * 작품이 주인공: 원본 비율 그대로(contain), 이미지 위 오버레이·그라데이션·필터·텍스트 0개.
 * 배경 surface-raised 단색 + 1px border + radius-md. 캡션은 프레임 밖 아래에 둔다.
 *
 * 프레임 크기(aspect/height)는 className으로 정하고, inset을 주면 프레임 안쪽에 여백을 둔다.
 */
export function ArtworkFrame({
  artwork,
  image,
  sizes,
  inset = false,
  highPriority = false,
  eager = false,
  className,
}: {
  artwork: Pick<Artwork, "title" | "creator">
  image: FrameImage
  sizes: string
  inset?: boolean
  /** 첫 화면 이미지 — 숨겨진 반응형 쌍이 함께 받아지지 않도록 preload 대신 fetchPriority만 올린다 */
  highPriority?: boolean
  /** LCP 이미지만 — 보이는 쪽 한 장에만 켠다(숨은 반응형 쌍까지 켜면 둘 다 받는다) */
  eager?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-md border border-border bg-surface-raised", className)}>
      <div className={cn("absolute flex items-center justify-center", inset ? "inset-2.5" : "inset-0")}>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={`${artwork.title} — ${artwork.creator}`}
          sizes={sizes}
          fetchPriority={highPriority ? "high" : undefined}
          loading={eager ? "eager" : undefined}
          className="h-auto max-h-full w-auto max-w-full object-contain"
        />
      </div>
    </div>
  )
}
