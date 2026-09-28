"use client"

import * as React from "react"
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  APPLICATION_FIELDS,
  validateApplication,
  type ApplicationCreated,
  type ApplicationErrors,
  type ApplicationField,
  type ApplicationInput,
} from "@/lib/applications/schema"

// design.md §7 피드백 타이밍
const DELAY_SPINNER_MS = 400
const DELAY_LONG_WAIT_MS = 3000

const EMPTY_INPUT: ApplicationInput = { company: "", name: "", email: "", agreePrivacy: false }

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
  const [input, setInput] = React.useState<ApplicationInput>(EMPTY_INPUT)
  const [errors, setErrors] = React.useState<ApplicationErrors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [showSpinner, setShowSpinner] = React.useState(false)
  const [longWait, setLongWait] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (!submitting) return
    const spinnerTimer = window.setTimeout(() => setShowSpinner(true), DELAY_SPINNER_MS)
    const longWaitTimer = window.setTimeout(() => setLongWait(true), DELAY_LONG_WAIT_MS)
    return () => {
      window.clearTimeout(spinnerTimer)
      window.clearTimeout(longWaitTimer)
    }
  }, [submitting])

  function update<K extends ApplicationField>(field: K, value: ApplicationInput[K]) {
    setInput((previous) => ({ ...previous, [field]: value }))
    if (!errors[field]) return
    setErrors((previous) => {
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function focusFirstError(nextErrors: ApplicationErrors) {
    const first = APPLICATION_FIELDS.find((field) => nextErrors[field])
    if (!first) return
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  function handleOpenChange(next: boolean) {
    if (submitting) return
    onOpenChange(next)
    if (!next) {
      setInput(EMPTY_INPUT)
      setErrors({})
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const clientErrors = validateApplication(input)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      focusFirstError(clientErrors)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (response.status === 409 || response.status === 422) {
        const { errors: serverErrors } = (await response.json()) as { errors: ApplicationErrors }
        setErrors(serverErrors)
        focusFirstError(serverErrors)
        return
      }
      if (!response.ok) throw new Error(`Unexpected status ${response.status}`)

      const created = (await response.json()) as ApplicationCreated
      onOpenChange(false)
      setInput(EMPTY_INPUT)
      setErrors({})
      toast.success("가입 신청을 받았어요", {
        description: `신청 번호 ${created.id} · 영업일 1일 안에 검토해 이메일로 알려드릴게요.`,
      })
    } catch {
      toast.error("신청을 보내지 못했어요", {
        description: "잠시 문제가 생겼어요. 입력 내용은 그대로 있으니 다시 시도해 주세요.",
        duration: Infinity,
        closeButton: true,
      })
    } finally {
      setSubmitting(false)
      setShowSpinner(false)
      setLongWait(false)
    }
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

        <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-6" aria-busy={submitting}>
          <div className="flex flex-col gap-5">
            <TextField
              name="company"
              label="회사명"
              autoComplete="organization"
              value={input.company}
              error={errors.company}
              onChange={(value) => update("company", value)}
            />
            <TextField
              name="name"
              label="담당자 이름"
              autoComplete="name"
              value={input.name}
              error={errors.name}
              onChange={(value) => update("name", value)}
            />
            <TextField
              name="email"
              type="email"
              label="업무용 이메일"
              autoComplete="email"
              inputMode="email"
              placeholder="name@agency.co.kr"
              hint="승인 결과를 이 주소로 보내드려요."
              value={input.email}
              error={errors.email}
              onChange={(value) => update("email", value)}
            />
            <div className="flex flex-col gap-1">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
                <Checkbox
                  name="agreePrivacy"
                  checked={input.agreePrivacy}
                  onCheckedChange={(checked) => update("agreePrivacy", checked === true)}
                  aria-invalid={errors.agreePrivacy ? true : undefined}
                  aria-describedby={errors.agreePrivacy ? "agreePrivacy-error" : "agreePrivacy-hint"}
                />
                <span>
                  개인정보 수집·이용에 동의해요 <span className="text-muted-foreground">(필수)</span>
                </span>
              </label>
              {errors.agreePrivacy ? (
                <FieldError id="agreePrivacy-error">{errors.agreePrivacy}</FieldError>
              ) : (
                <p id="agreePrivacy-hint" className="pl-8 text-caption text-muted-foreground">
                  회사명·담당자 이름·이메일은 가입 심사에만 써요.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="md" disabled={submitting}>
                  취소
                </Button>
              </DialogClose>
              <Button type="submit" aria-disabled={submitting || undefined} className="min-w-28">
                {showSpinner ? <LoaderCircleIcon className="animate-spin" strokeWidth={1.75} aria-hidden /> : null}
                신청하기
              </Button>
            </DialogFooter>
            <p role="status" className="text-right text-body-sm text-muted-foreground empty:hidden">
              {longWait ? "처리 중이에요" : ""}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TextField({
  name,
  label,
  value,
  error,
  hint,
  onChange,
  ...inputProps
}: Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "name"> & {
  name: ApplicationField
  label: string
  value: string
  error?: string
  hint?: string
  onChange: (value: string) => void
}) {
  const id = `apply-${name}`
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label} <span className="font-normal text-muted-foreground">(필수)</span>
      </Label>
      <Input
        id={id}
        name={name}
        value={value}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
      />
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1 text-body-sm text-error">
      <CircleAlertIcon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="pt-px">{children}</span>
    </p>
  )
}
