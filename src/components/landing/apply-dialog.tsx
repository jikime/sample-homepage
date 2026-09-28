"use client"

import * as React from "react"
import { toast } from "sonner"

import { ApplyForm } from "@/components/applications/apply-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ApplicationCreated } from "@/lib/applications/schema"

const ApplyDialogContext = React.createContext<{ openApply: () => void } | null>(null)

export function useApplyDialog() {
  const context = React.useContext(ApplyDialogContext)
  if (!context) throw new Error("useApplyDialog must be used within ApplyDialogProvider")
  return context
}

/** 랜딩의 모든 "브리프 보내기"가 여는 가입 신청 Dialog를 한 곳에서 관리한다. */
export function ApplyDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const value = React.useMemo(() => ({ openApply: () => setOpen(true) }), [])

  return (
    <ApplyDialogContext.Provider value={value}>
      {children}
      <ApplyDialog open={open} onOpenChange={setOpen} />
    </ApplyDialogContext.Provider>
  )
}

/** "브리프 보내기" 버튼 — 로그인 전 방문자는 가입 신청부터 한다. */
export function ApplyButton({ onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { openApply } = useApplyDialog()
  return (
    <Button
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) openApply()
      }}
      {...props}
    />
  )
}

function ApplyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [submitting, setSubmitting] = React.useState(false)

  // 전송 중에는 닫지 않는다. 닫으면 폼이 사라져 입력과 에러 상태도 함께 초기화된다.
  function handleOpenChange(next: boolean) {
    if (submitting) return
    onOpenChange(next)
  }

  function handleSuccess(created: ApplicationCreated) {
    onOpenChange(false)
    toast.success("가입 신청을 받았어요", {
      description: `신청 번호 ${created.id} · 영업일 1일 안에 검토해 이메일로 알려드릴게요.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>가입 신청</DialogTitle>
          <DialogDescription>
            승인된 에이전시만 브리프를 보낼 수 있어요. 영업일 1일 안에 검토해 이메일로 알려드려요.
          </DialogDescription>
        </DialogHeader>
        <ApplyForm variant="dialog" onSuccess={handleSuccess} onSubmittingChange={setSubmitting} />
      </DialogContent>
    </Dialog>
  )
}
