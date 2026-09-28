"use client"

import * as React from "react"

import { ApplyButton } from "./apply-dialog"

/**
 * 상단 바 "브리프 보내기".
 * design.md Known Gaps #2 제안 적용: 히어로·최종 CTA의 primary가 화면에 보이는 동안에는 secondary,
 * 둘 다 벗어나면 primary로 바꿔 뷰포트당 primary(accent 배경) 1개 규칙을 지킨다.
 */
export function HeaderCta({ label, className }: { label: string; className?: string }) {
  const [primaryInView, setPrimaryInView] = React.useState(true)

  React.useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-primary-cta]"))
    if (targets.length === 0) return
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setPrimaryInView(visible.size > 0)
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <ApplyButton variant={primaryInView ? "secondary" : "primary"} className={className}>
      {label}
    </ApplyButton>
  )
}
