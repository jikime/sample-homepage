/**
 * 로그인 — 폼 검증 규칙.
 * 에러 문구는 "무슨 일이 / 왜 / 무엇을 하면 되는지"를 담는다(design.md §0 문구).
 * 비밀번호는 형식을 따지지 않는다(가입 때 정한 규칙을 여기서 다시 검사하면 안 된다). 비어 있는지만 본다.
 */

export interface LoginInput {
  email: string
  password: string
}

export type LoginField = keyof LoginInput
export type LoginErrors = Partial<Record<LoginField, string>>

export const LOGIN_FIELDS: LoginField[] = ["email", "password"]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateLogin(input: LoginInput): LoginErrors {
  const errors: LoginErrors = {}
  if (!input.email.trim()) {
    errors.email = "업무용 이메일을 입력해 주세요. 가입 신청 때 적은 주소예요."
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "이메일 형식이 맞지 않아요. name@agency.co.kr처럼 입력해 주세요."
  }
  if (!input.password) errors.password = "비밀번호를 입력해 주세요."
  return errors
}
