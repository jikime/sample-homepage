import "server-only"

import { createClient } from "@supabase/supabase-js"

import type { Database } from "./database.types"
import type { SupabasePublicConfig, SupabaseSecretConfig } from "./env"

// 로그인 세션을 쓰지 않는 서버 요청이라 세션 저장·갱신을 끈다.
const serverAuthOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
} as const

/** 공개 콘텐츠 읽기 — publishable key, RLS "공개 읽기" 정책을 따른다. */
export function createSupabaseReader(config: SupabasePublicConfig) {
  return createClient<Database>(config.url, config.publishableKey, { auth: serverAuthOptions })
}

/** 서버 전용 쓰기 — secret key는 RLS를 우회하므로 Route Handler·서버 코드에서만 쓴다. */
export function createSupabaseAdmin(config: SupabaseSecretConfig) {
  return createClient<Database>(config.url, config.secretKey, { auth: serverAuthOptions })
}
