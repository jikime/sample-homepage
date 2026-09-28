"use client"

import * as React from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LOGIN_FIELDS, validateLogin, type LoginErrors, type LoginField, type LoginInput } from "@/lib/auth/schema"

const EMPTY_INPUT: LoginInput = { email: "", password: "" }

/** 로그인 폼 — 이메일 · 비밀번호. 검증은 제출할 때 한 번에 하고, 첫 에러 필드로 포커스를 옮긴다. */
export function LoginForm() {
  const [input, setInput] = React.useState<LoginInput>(EMPTY_INPUT)
  const [errors, setErrors] = React.useState<LoginErrors>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  function update(field: LoginField, value: string) {
    setInput((previous) => ({ ...previous, [field]: value }))
    if (!errors[field]) return
    setErrors((previous) => {
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateLogin(input)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const first = LOGIN_FIELDS.find((field) => nextErrors[field])
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    // 인증 백엔드가 아직 없다 — 로그인을 연결하기 전까지는 입력을 어디로도 보내지 않는다.
    toast("아직 로그인을 열지 않았어요", {
      description: "승인된 에이전시부터 순서대로 열어요. 가입 신청 결과는 이메일로 알려드려요.",
    })
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-email">업무용 이메일</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@agency.co.kr"
            value={input.email}
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? <FieldError id="login-email-error">{errors.email}</FieldError> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password">비밀번호</Label>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={input.password}
              required
              className="pr-12"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              onChange={(event) => update("password", event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? (
                <EyeOffIcon className="size-5" strokeWidth={1.75} aria-hidden />
              ) : (
                <EyeIcon className="size-5" strokeWidth={1.75} aria-hidden />
              )}
            </Button>
          </div>
          {errors.password ? <FieldError id="login-password-error">{errors.password}</FieldError> : null}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        로그인
      </Button>

      <p className="flex flex-wrap items-center justify-center gap-x-2 border-t border-border pt-5 text-body-sm text-sub">
        아직 계정이 없나요?
        <Button asChild variant="link" className="min-h-11 text-body-sm">
          <Link href="/#apply">가입 신청하기</Link>
        </Button>
      </p>
    </form>
  )
}
