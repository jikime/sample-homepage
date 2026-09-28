import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"
import { Wordmark } from "@/components/brand/wordmark"

export const metadata: Metadata = {
  title: "로그인 — 디지털플레이스",
  description: "승인된 에이전시 계정으로 로그인해 브리프와 후보를 확인해요.",
}

/** 로그인 — 이메일 · 비밀번호. 단일 카드(surface · radius-lg · 1px border)를 가운데 두고, 그림자는 쓰지 않는다. */
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" aria-label="디지털플레이스 홈" className="flex min-h-11 items-center rounded-md">
        <Wordmark />
      </Link>

      <section
        aria-labelledby="login-title"
        className="flex w-full max-w-100 flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex flex-col gap-2">
          <h1 id="login-title" className="text-h2">
            로그인
          </h1>
          <p className="text-body text-sub">승인된 에이전시 계정으로 로그인해요.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
