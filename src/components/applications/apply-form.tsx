"use client"

import * as React from "react"
import { LoaderCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field-error"
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

/**
 * 가입 신청 폼 — 랜딩의 신청 Dialog와 /signup 페이지가 함께 쓴다.
 * variant="dialog"는 취소 + 신청 버튼을 오른쪽 정렬로, "page"는 신청 버튼을 전체 폭으로 둔다.
 * 성공 뒤의 안내는 호출한 쪽이 정한다(onSuccess).
 */
export function ApplyForm({
  variant,
  onSuccess,
  onSubmittingChange,
}: {
  variant: "dialog" | "page"
  onSuccess: (created: ApplicationCreated) => void
  onSubmittingChange?: (submitting: boolean) => void
}) {
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

  function changeSubmitting(next: boolean) {
    setSubmitting(next)
    onSubmittingChange?.(next)
  }

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const clientErrors = validateApplication(input)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      focusFirstError(clientErrors)
      return
    }

    changeSubmitting(true)
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
      setInput(EMPTY_INPUT)
      setErrors({})
      onSuccess(created)
    } catch {
      toast.error("신청을 보내지 못했어요", {
        description: "잠시 문제가 생겼어요. 입력 내용은 그대로 있으니 다시 시도해 주세요.",
        duration: Infinity,
        closeButton: true,
      })
    } finally {
      changeSubmitting(false)
      setShowSpinner(false)
      setLongWait(false)
    }
  }

  const submitContent = (
    <>
      {showSpinner ? <LoaderCircleIcon className="animate-spin" strokeWidth={1.75} aria-hidden /> : null}
      신청하기
    </>
  )

  return (
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
        {variant === "dialog" ? (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" size="md" disabled={submitting}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" aria-disabled={submitting || undefined} className="min-w-28">
              {submitContent}
            </Button>
          </DialogFooter>
        ) : (
          <Button type="submit" size="lg" aria-disabled={submitting || undefined} className="w-full">
            {submitContent}
          </Button>
        )}
        <p
          role="status"
          className={`text-body-sm text-muted-foreground empty:hidden ${variant === "dialog" ? "text-right" : "text-center"}`}
        >
          {longWait ? "처리 중이에요" : ""}
        </p>
      </div>
    </form>
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
