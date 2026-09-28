"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon } from "lucide-react"

import { ApplyForm } from "@/components/applications/apply-form"
import { Button } from "@/components/ui/button"
import type { ApplicationCreated } from "@/lib/applications/schema"

/**
 * 가입 신청 카드 안쪽 — 신청 폼, 접수되면 접수 안내로 바뀐다.
 * 접수 안내로 바뀌면 제목으로 포커스를 옮겨 스크린리더가 바뀐 내용을 읽게 한다.
 */
export function SignupPanel() {
  const [created, setCreated] = React.useState<ApplicationCreated | null>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (created) titleRef.current?.focus()
  }, [created])

  if (created) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <CircleCheckIcon className="size-10 text-success" strokeWidth={1.75} aria-hidden />
          <div className="flex flex-col gap-2">
            <h1 id="signup-title" ref={titleRef} tabIndex={-1} className="text-h2 outline-none">
              가입 신청을 받았어요
            </h1>
            <p className="text-body text-sub">영업일 1일 안에 검토해 입력한 이메일로 결과를 알려드릴게요.</p>
          </div>
          <p className="rounded-md border border-border px-4 py-3 text-body-sm text-sub">
            신청 번호 <span className="font-semibold text-foreground">{created.id}</span>
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href="/">홈으로</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 id="signup-title" className="text-h2">
          가입 신청
        </h1>
        <p className="text-body text-sub">
          승인된 에이전시만 브리프를 보낼 수 있어요. 영업일 1일 안에 검토해 이메일로 알려드려요.
        </p>
      </div>
      <ApplyForm variant="page" onSuccess={setCreated} />
      <p className="flex flex-wrap items-center justify-center gap-x-2 border-t border-border pt-5 text-body-sm text-sub">
        이미 승인된 계정이 있나요?
        <Button asChild variant="link" className="min-h-11 text-body-sm">
          <Link href="/login">로그인하기</Link>
        </Button>
      </p>
    </>
  )
}
