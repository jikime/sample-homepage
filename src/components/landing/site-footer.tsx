import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import type { FooterContent } from "@/lib/landing/types"

import { Container } from "./primitives"

const footerLink =
  "flex min-h-11 items-center rounded-sm text-body-sm text-sub underline underline-offset-4 transition-colors duration-120 hover:text-foreground"

/** 푸터 — 데스크톱 좌 브랜드 · 우 문의/정책, 모바일 세로 스택 */
export function SiteFooter({ footer }: { footer: FooterContent }) {
  const { creatorContact, policies } = footer

  return (
    <footer className="mt-auto border-t border-border">
      <Container className="flex flex-col gap-4 pt-8 pb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:pt-10 lg:pb-12">
        <div className="flex flex-col gap-4 lg:gap-3">
          <Wordmark placement="footer" />
          <p className="text-body-sm text-muted-foreground max-lg:hidden">{footer.tagline}</p>
          <p className="text-caption text-muted-foreground max-lg:hidden">{footer.copyright}</p>
        </div>

        {/* 데스크톱 */}
        <div className="flex gap-12 max-lg:hidden">
          <div className="flex flex-col gap-1">
            <span className="text-caption font-semibold text-muted-foreground">{creatorContact.label}</span>
            <a href={creatorContact.href} className={footerLink}>
              {creatorContact.linkLabel.base}
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-caption font-semibold text-muted-foreground">정책</span>
            <div className="flex gap-4">
              {policies.map((policy) => (
                <Link key={policy.href} href={policy.href} prefetch={false} className={footerLink}>
                  {policy.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 */}
        <div className="flex flex-wrap gap-x-4 lg:hidden">
          <a href={creatorContact.href} className={footerLink}>
            {creatorContact.linkLabel.mobile ?? creatorContact.linkLabel.base}
          </a>
          {policies.map((policy) => (
            <Link key={policy.href} href={policy.href} prefetch={false} className={footerLink}>
              {policy.label}
            </Link>
          ))}
        </div>
        <p className="text-caption text-muted-foreground lg:hidden">{footer.copyright}</p>
      </Container>
    </footer>
  )
}
