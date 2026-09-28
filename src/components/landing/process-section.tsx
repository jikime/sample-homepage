import { cn } from "@/lib/utils"

import type { LandingContent } from "@/lib/landing/types"

import { Container, Rt, SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

/** ③ 진행 방식 6단계 — 데스크톱 가로 스텝(점 + 선), 모바일 세로 목록 */
export function ProcessSection({ process }: { process: LandingContent["process"] }) {
  const lastIndex = process.steps.length - 1

  return (
    <section id="how" aria-labelledby="how-title" className="pb-16 lg:pb-24">
      <Container className="flex flex-col gap-6 lg:gap-12">
        <Reveal>
          <SectionHeading heading={process.heading} titleId="how-title" />
        </Reveal>
        <Reveal index={1}>
          <ol className="flex flex-col lg:grid lg:grid-cols-6 lg:gap-6">
            {process.steps.map((step, index) => {
              const isFirst = index === 0
              return (
                <li
                  key={step.code}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0 lg:flex lg:flex-col lg:border-t-0 lg:p-0"
                >
                  <div aria-hidden className="flex items-center gap-2 max-lg:hidden">
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border-2",
                        isFirst ? "border-primary" : "border-border-strong"
                      )}
                    />
                    {index < lastIndex ? <span className="h-px grow bg-border" /> : null}
                  </div>
                  <span
                    className={cn(
                      "font-mono text-mono leading-7 lg:leading-5 lg:text-muted-foreground",
                      isFirst ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.code}
                  </span>
                  <div className="flex flex-col gap-1 lg:gap-3">
                    <h3 className="text-h3">{step.title}</h3>
                    <p className="text-body-sm text-sub">
                      <Rt value={step.description} />
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  )
}
