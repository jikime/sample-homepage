"use client"

import * as React from "react"

/**
 * 랜딩 스크롤 등장 — opacity 0→1 + translateY 12px→0, 240ms, 요소당 1회.
 * 순차 지연은 60ms × 최대 3개(index 0~2). reduced-motion이면 CSS에서 즉시 보인다.
 */
export function Reveal({
  index = 0,
  style,
  ...props
}: React.ComponentProps<"div"> & { index?: 0 | 1 | 2 }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        element.setAttribute("data-revealed", "")
        observer.disconnect()
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ ...style, ["--reveal-index" as string]: index }}
      {...props}
    />
  )
}
