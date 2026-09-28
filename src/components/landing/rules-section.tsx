import { cn } from "@/lib/utils"

import type { LandingContent } from "@/lib/landing/types"

import { Container, Rt, SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

/** ⑥ 운영 규칙 숫자 — 운영 규칙 숫자만 쓴다(만족도·고객 수 같은 검증되지 않은 수치 금지). */
export function RulesSection({ rules }: { rules: LandingContent["rules"] }) {
  return (
    <section aria-labelledby="rules-title" className="pb-16 lg:pb-24">
      <Container className="flex flex-col gap-6 lg:gap-12">
        <Reveal>
          <SectionHeading heading={rules.heading} titleId="rules-title" />
        </Reveal>
        <Reveal index={1}>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
            {rules.items.map((rule) => (
              <li key={rule.title} className="flex flex-col gap-1 border-t border-border-strong pt-4 lg:gap-2 lg:pt-6">
                <span className={cn("text-display-lg lg:text-display-xl", rule.emphasis && "text-primary")}>
                  {rule.value}
                  <span className="text-h3 font-extrabold lg:text-h1 lg:font-extrabold">{rule.unit}</span>
                </span>
                <span className="text-body font-semibold lg:text-h3">{rule.title}</span>
                <span className="text-body-sm text-sub">
                  <Rt value={rule.description} />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
