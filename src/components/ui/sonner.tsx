"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"

/**
 * Toast — design.md §12
 * 배경은 늘 surface-raised + shadow-overlay, 상태는 아이콘 색 + 문구로 전한다.
 * 데스크톱 우하단 · 모바일 하단 중앙(sonner 기본 동작), z-toast.
 * success·info는 4초 뒤 자동 닫힘, error는 호출하는 쪽에서 duration: Infinity로 수동 닫기.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      duration={4000}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" strokeWidth={1.75} />,
        info: <InfoIcon className="size-5 text-info" strokeWidth={1.75} />,
        warning: <TriangleAlertIcon className="size-5 text-warning" strokeWidth={1.75} />,
        error: <CircleAlertIcon className="size-5 text-error" strokeWidth={1.75} />,
        loading: <LoaderCircleIcon className="size-5 animate-spin text-sub" strokeWidth={1.75} />,
      }}
      style={
        {
          "--normal-bg": "var(--dp-surface-raised)",
          "--normal-text": "var(--dp-text)",
          "--normal-border": "var(--dp-border)",
          "--border-radius": "16px",
          zIndex: "var(--z-toast)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "shadow-overlay! gap-3! p-4! font-sans!",
          title: "text-body! font-semibold!",
          description: "text-body-sm! text-sub!",
          closeButton: "bg-surface-raised! border-border! text-sub!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
