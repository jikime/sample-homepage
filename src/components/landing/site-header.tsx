import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { Button } from "@/components/ui/button"
import type { NavItem } from "@/lib/landing/types"

import { HeaderCta } from "./header-cta"
import { MobileNav } from "./mobile-nav"
import { Container } from "./primitives"

/** 상단 바 — 데스크톱 72 · 모바일 56, z-nav. 배경은 bg 단색(블러 금지). */
export function SiteHeader({ nav, loginHref, ctaLabel }: { nav: NavItem[]; loginHref: string; ctaLabel: string }) {
  return (
    <header className="sticky top-0 z-(--z-nav) h-14 border-b border-border bg-background lg:h-18">
      <Container className="flex h-full items-center justify-between">
        <a href="#top" aria-label="디지털플레이스 홈" className="flex min-h-11 items-center rounded-md">
          <Wordmark />
        </a>

        <nav aria-label="주요 메뉴" className="flex items-center gap-1 max-lg:hidden">
          {nav.map((item) => (
            <Button key={item.href} asChild variant="nav" size="nav">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
          <Button asChild variant="nav" size="nav">
            <Link href={loginHref} prefetch={false}>로그인</Link>
          </Button>
          <HeaderCta label={ctaLabel} className="ml-3" />
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <Button asChild variant="nav" size="nav">
            <Link href={loginHref} prefetch={false}>로그인</Link>
          </Button>
          <MobileNav items={nav} loginHref={loginHref} ctaLabel={ctaLabel} />
        </div>
      </Container>
    </header>
  )
}
