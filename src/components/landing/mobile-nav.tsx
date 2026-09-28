"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, MenuIcon } from "lucide-react"

import { Wordmark } from "@/components/brand/wordmark"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { NavItem } from "@/lib/landing/types"

import { useApplyDialog } from "./apply-dialog"

/** 모바일 상단 바 메뉴(< lg). 메뉴가 닫힌 뒤에 섹션으로 이동해 스크롤 잠금과 충돌하지 않게 한다. */
export function MobileNav({ items, loginHref, ctaLabel }: { items: NavItem[]; loginHref: string; ctaLabel: string }) {
  const [open, setOpen] = React.useState(false)
  const pendingHash = React.useRef<string | null>(null)
  const pendingApply = React.useRef(false)
  const { openApply } = useApplyDialog()

  function handleCloseAutoFocus(event: Event) {
    const hash = pendingHash.current
    if (hash) {
      event.preventDefault()
      pendingHash.current = null
      const target = document.querySelector<HTMLElement>(hash)
      target?.scrollIntoView()
      window.history.pushState(null, "", hash)
    }
    if (pendingApply.current) {
      event.preventDefault()
      pendingApply.current = false
      openApply()
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground" aria-label="메뉴 열기">
          <MenuIcon className="size-6" strokeWidth={1.75} aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" onCloseAutoFocus={handleCloseAutoFocus}>
        <SheetHeader className="h-14 justify-center border-b border-border py-0">
          <SheetTitle className="sr-only">메뉴</SheetTitle>
          <SheetDescription className="sr-only">디지털플레이스 랜딩 페이지 메뉴</SheetDescription>
          <Wordmark />
        </SheetHeader>
        <nav aria-label="모바일 메뉴" className="flex flex-col p-2">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault()
                pendingHash.current = item.href
                setOpen(false)
              }}
              className="flex min-h-12 items-center rounded-md px-3 text-body-lg text-foreground transition-colors duration-120 hover:bg-surface"
            >
              {item.label}
            </a>
          ))}
          <Link
            href={loginHref}
            prefetch={false}
            className="flex min-h-12 items-center rounded-md px-3 text-body-lg text-foreground transition-colors duration-120 hover:bg-surface"
          >
            로그인
          </Link>
        </nav>
        <div className="mt-auto border-t border-border p-4">
          <Button
            size="lg"
            className="w-full"
            aria-haspopup="dialog"
            onClick={() => {
              pendingApply.current = true
              setOpen(false)
            }}
          >
            {ctaLabel}
            <ArrowRightIcon className="size-5" strokeWidth={1.75} aria-hidden />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
