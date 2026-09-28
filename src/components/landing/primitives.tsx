import * as React from "react"
import { cn } from "@/lib/utils"

import type { Responsive, SectionHeading as SectionHeadingData } from "@/lib/landing/types"

/** 랜딩 컨테이너 — 최대폭 1280, 좌우 여백 16 / 24 / 32 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-320 px-4 md:px-6 lg:px-8", className)} {...props} />
}

/**
 * 모바일(< lg) 전용 문구가 있으면 브레이크포인트에 따라 바꿔 보여준다.
 * mobile === "" 이면 모바일에서는 아무것도 보이지 않는다.
 */
export function Rt({ value }: { value: Responsive<string> }) {
  if (value.mobile === undefined) return <>{value.base}</>
  return (
    <>
      {value.mobile ? <span className="lg:hidden">{value.mobile}</span> : null}
      {value.base ? <span className="max-lg:hidden">{value.base}</span> : null}
    </>
  )
}

function Lines({ lines }: { lines: string[] }) {
  return lines.map((line, index) => (
    <React.Fragment key={line}>
      {index > 0 ? <br /> : null}
      {line}
    </React.Fragment>
  ))
}

export function RtLines({ value }: { value: Responsive<string[]> }) {
  if (!value.mobile) return <Lines lines={value.base} />
  return (
    <>
      <span className="lg:hidden">
        <Lines lines={value.mobile} />
      </span>
      <span className="max-lg:hidden">
        <Lines lines={value.base} />
      </span>
    </>
  )
}

/** 모바일에서 문구를 숨기는 경우(mobile === "") 블록 자체를 감춘다. */
export function hiddenOnMobile(value?: Responsive<string>) {
  return value?.mobile === "" ? "max-lg:hidden" : undefined
}

export function Overline({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-overline text-muted-foreground uppercase", className)} {...props} />
}

/**
 * 섹션 제목 — overline 라벨 + display-lg(모바일 32/40 800) 제목.
 * 설명은 데스크톱에서 오른쪽(최대 400), 모바일에서 제목 아래에 둔다.
 */
export function SectionHeading({
  heading,
  titleId,
  aside,
  className,
}: {
  heading: SectionHeadingData
  titleId?: string
  aside?: React.ReactNode
  className?: string
}) {
  const { description } = heading
  const mobileDescription = description?.mobile ?? description?.base
  const hasDesktopSide = Boolean(description?.base) || Boolean(aside)

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasDesktopSide && "lg:flex-row lg:items-end lg:justify-between lg:gap-6",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:gap-4">
        <Overline>{heading.overline}</Overline>
        <h2 id={titleId} className="text-h1 font-extrabold lg:text-display-lg">
          <RtLines value={heading.title} />
        </h2>
        {mobileDescription ? <p className="text-body text-sub lg:hidden">{mobileDescription}</p> : null}
      </div>
      {description?.base ? <p className="max-w-100 text-body text-sub max-lg:hidden">{description.base}</p> : null}
      {aside}
    </div>
  )
}
