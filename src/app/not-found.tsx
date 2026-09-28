import Link from "next/link"
import { FileQuestionIcon } from "lucide-react"

import { Wordmark } from "@/components/brand/wordmark"
import { Button } from "@/components/ui/button"

/** 404 — design.md §12 빈 · 에러 · 로딩 문구 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Link href="/" aria-label="디지털플레이스 홈" className="rounded-md">
        <Wordmark />
      </Link>
      <FileQuestionIcon className="size-12 text-muted-foreground" strokeWidth={1.75} aria-hidden />
      <div className="flex flex-col gap-2">
        <h1 className="text-h3">페이지를 찾을 수 없어요</h1>
        <p className="text-body-sm text-sub">주소가 바뀌었거나 아직 준비 중인 페이지예요. 홈에서 다시 찾아 주세요.</p>
      </div>
      <Button asChild variant="secondary">
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  )
}
