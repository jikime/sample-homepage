import type { LandingContent } from "@/lib/landing/types"

import { Container, SectionHeading } from "./primitives"
import { Reveal } from "./reveal"

/** ② 문제 — 카드 3개(모바일은 해결 문장만) */
export function ProblemSection({ problem }: { problem: LandingContent["problem"] }) {
  return (
    <section aria-labelledby="why-title" className="pb-16 lg:pb-24">
      <Container className="flex flex-col gap-6 lg:gap-12">
        <Reveal>
          <SectionHeading heading={problem.heading} titleId="why-title" />
        </Reveal>
        <Reveal index={1}>
          <ul className="grid gap-6 md:grid-cols-3">
            {problem.items.map((item) => (
              <li
                key={item.code}
                className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 md:gap-4 md:p-6"
              >
                <span className="font-mono text-mono text-muted-foreground">
                  {item.code} · {item.label}
                </span>
                <h3 className="text-h3">{item.title}</h3>
                <p className="text-body text-sub max-md:hidden">{item.problem}</p>
                <p className="text-body text-sub md:mt-auto md:border-t md:border-border md:pt-4 md:text-body-sm md:text-foreground">
                  {item.solution}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
