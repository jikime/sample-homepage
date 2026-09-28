/**
 * Supabase 환경변수. 값은 .env(또는 .env.local)에 넣는다 — .env.example 참고.
 * 세 값이 모두 비어 있으면 목업 데이터로 동작하고, 일부만 채워져 있으면 설정 실수로 보고 에러를 낸다.
 */

export interface SupabasePublicConfig {
  url: string
  publishableKey: string
}

export interface SupabaseSecretConfig {
  url: string
  secretKey: string
}

function read(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

function readAll() {
  return {
    url: read("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    secretKey: read("SUPABASE_SECRET_KEY"),
  }
}

/** Supabase 값을 하나라도 넣었는지 — false면 목업 모드 */
export function isSupabaseConfigured(): boolean {
  const { url, publishableKey, secretKey } = readAll()
  return Boolean(url || publishableKey || secretKey)
}

/** 공개 읽기용(publishable key). 목업 모드면 null */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  if (!isSupabaseConfigured()) return null
  const { url, publishableKey } = readAll()
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase 설정이 덜 채워졌어요. .env의 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 모두 넣어 주세요."
    )
  }
  return { url, publishableKey }
}

/** 서버 전용 쓰기용(secret key). 목업 모드면 null */
export function getSupabaseSecretConfig(): SupabaseSecretConfig | null {
  if (!isSupabaseConfigured()) return null
  const { url, secretKey } = readAll()
  if (!url || !secretKey) {
    throw new Error(
      "Supabase 설정이 덜 채워졌어요. 가입 신청을 저장하려면 .env의 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SECRET_KEY를 모두 넣어 주세요."
    )
  }
  return { url, secretKey }
}
