import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"

// JetBrains Mono — 프로젝트 코드·규격·금액 전용(latin 서브셋, SIL OFL)
const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
})

export const metadata: Metadata = {
  title: "디지털플레이스 — 브리프 하나로, 48시간 안에 검토된 후보를",
  description:
    "광고대행사를 위한 AI 이미지 광고 소재 관리형 제작 서비스. 캠페인 조건을 보내면 운영팀이 검토한 후보를 같은 기준으로 비교해 드려요.",
}

export const viewport: Viewport = {
  themeColor: "#0B0C0F",
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`dark ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
