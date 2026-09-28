import {
  toApplicationInput,
  validateApplication,
  type ApplicationCreated,
  type ApplicationErrors,
  type ApplicationInput,
} from "@/lib/applications/schema"
import { getSupabaseSecretConfig } from "@/lib/supabase/env"
import { createSupabaseAdmin } from "@/lib/supabase/server"

/**
 * 에이전시 가입 신청.
 * - .env에 Supabase 값이 있으면 agency_applications 테이블에 저장한다(secret key, 서버 전용).
 * - 값이 모두 비어 있으면 메모리에만 저장하는 목업으로 동작한다(서버를 다시 켜면 사라짐).
 * - demo@agency.co.kr 는 두 모드 모두 "이미 신청한 이메일"(409) 흐름 확인용이다.
 */
const DUPLICATE_EMAIL_ERROR: ApplicationErrors = {
  email: "이미 가입 신청한 이메일이에요. 검토 결과를 이 주소로 보내드릴게요.",
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: "요청 형식이 올바르지 않아요." }, { status: 400 })
  }

  const input = toApplicationInput(body)
  const errors = validateApplication(input)
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 })
  }

  const config = getSupabaseSecretConfig()
  return config ? saveToSupabase(input, config) : saveToMemory(input)
}

// Postgres unique_violation — agency_applications_email_key(lower(email))
const UNIQUE_VIOLATION = "23505"

async function saveToSupabase(input: ApplicationInput, config: NonNullable<ReturnType<typeof getSupabaseSecretConfig>>) {
  const supabase = createSupabaseAdmin(config)
  const { data, error } = await supabase
    .from("agency_applications")
    .insert({
      company: input.company.trim(),
      contact_name: input.name.trim(),
      email: input.email.trim(),
      agree_privacy: input.agreePrivacy,
    })
    .select("code")
    .single()

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return Response.json({ errors: DUPLICATE_EMAIL_ERROR }, { status: 409 })
    }
    console.error("[applications] Supabase insert failed", error)
    return Response.json({ message: "신청을 저장하지 못했어요." }, { status: 500 })
  }

  const created: ApplicationCreated = { id: data.code, status: "submitted" }
  return Response.json(created, { status: 201 })
}

const submittedEmails = new Set<string>(["demo@agency.co.kr"])
let sequence = 41
const MOCK_LATENCY_MS = 700

async function saveToMemory(input: ApplicationInput) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

  const email = input.email.trim().toLowerCase()
  if (submittedEmails.has(email)) {
    return Response.json({ errors: DUPLICATE_EMAIL_ERROR }, { status: 409 })
  }

  submittedEmails.add(email)
  sequence += 1
  const created: ApplicationCreated = {
    id: `APP-2026-${String(sequence).padStart(4, "0")}`,
    status: "submitted",
  }
  return Response.json(created, { status: 201 })
}
