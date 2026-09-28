import { cn } from "@/lib/utils"

/**
 * Wordmark — 로고 확정 전 임시 워드마크(A-20).
 * "digital place" Pretendard 800 · 자간 -0.03em + 8px 라임 점. 점만 따로 쓰지 않는다.
 * 크기는 P-01 목업 값(상단 바 20→22px, 푸터 18→20px)을 따른다.
 */
export function Wordmark({ placement = "header", className }: { placement?: "header" | "footer"; className?: string }) {
  const isHeader = placement === "header"
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-foreground lg:gap-2", className)}>
      <span
        className={cn(
          "font-extrabold tracking-[-0.03em]",
          isHeader ? "text-h3 lg:text-[1.375rem]" : "text-[1.125rem] leading-6 lg:text-h3"
        )}
      >
        digital place
      </span>
      <span
        aria-hidden
        className={cn("size-2 rounded-full bg-primary", isHeader ? "mt-1.5 lg:mt-2" : "mt-1 lg:mt-1.5")}
      />
    </span>
  )
}
