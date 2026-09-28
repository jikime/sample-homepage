/**
 * 에이전시 가입 신청 — 클라이언트 폼과 목업 API가 같은 규칙을 쓴다.
 * 에러 문구는 "무슨 일이 / 왜 / 무엇을 하면 되는지"를 담는다(design.md §0 문구).
 */

export interface ApplicationInput {
  company: string
  name: string
  email: string
  agreePrivacy: boolean
}

export type ApplicationField = keyof ApplicationInput
export type ApplicationErrors = Partial<Record<ApplicationField, string>>

export interface ApplicationCreated {
  id: string
  status: "submitted"
}

export const APPLICATION_FIELDS: ApplicationField[] = ["company", "name", "email", "agreePrivacy"]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateApplication(input: ApplicationInput): ApplicationErrors {
  const errors: ApplicationErrors = {}
  if (!input.company.trim()) errors.company = "회사명을 입력해 주세요."
  if (!input.name.trim()) errors.name = "담당자 이름을 입력해 주세요."
  if (!input.email.trim()) {
    errors.email = "업무용 이메일을 입력해 주세요. 승인 결과를 이 주소로 보내드려요."
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "이메일 형식이 맞지 않아요. name@agency.co.kr처럼 입력해 주세요."
  }
  if (!input.agreePrivacy) errors.agreePrivacy = "개인정보 수집·이용에 동의해야 신청할 수 있어요."
  return errors
}

export function toApplicationInput(value: unknown): ApplicationInput {
  const record = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>
  return {
    company: typeof record.company === "string" ? record.company : "",
    name: typeof record.name === "string" ? record.name : "",
    email: typeof record.email === "string" ? record.email : "",
    agreePrivacy: record.agreePrivacy === true,
  }
}
