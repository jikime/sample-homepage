import type { Metadata } from "next"
import Link from "next/link"

import { SignupPanel } from "@/components/auth/signup-panel"
import { Wordmark } from "@/components/brand/wordmark"

export const metadata: Metadata = {
  title: "가입 신청 — 디지털플레이스",
  description: "에이전시 가입을 신청해요. 영업일 1일 안에 검토해 이메일로 결과를 알려드려요.",
}

/** 가입 신청 — 로그인과 같은 단일 카드(surface · radius-lg · 1px border)를 가운데 두고, 그림자는 쓰지 않는다. */
export default function SignupPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" aria-label="디지털플레이스 홈" className="flex min-h-11 items-center rounded-md">
        <Wordmark />
      </Link>

      <section
        aria-labelledby="signup-title"
        className="flex w-full max-w-100 flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8"
      >
        <SignupPanel />
      </section>
    </main>
  )
}
