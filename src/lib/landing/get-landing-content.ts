import "server-only"

import { getSupabasePublicConfig } from "@/lib/supabase/env"

import { landingMock } from "./mock-data"
import { fetchLandingContent } from "./supabase-repository"
import type { LandingContent } from "./types"

let warnedMockMode = false

/**
 * 랜딩 콘텐츠를 가져온다.
 * - .env에 Supabase 값이 있으면 Supabase 테이블에서 읽는다.
 * - 값이 모두 비어 있으면 목업 데이터(mock-data.ts)를 돌려준다.
 */
export async function getLandingContent(): Promise<LandingContent> {
  const config = getSupabasePublicConfig()
  if (!config) {
    if (!warnedMockMode && process.env.NODE_ENV !== "test") {
      warnedMockMode = true
      console.info("[landing] Supabase 환경변수가 비어 있어 목업 데이터로 렌더링해요.")
    }
    return landingMock
  }
  return fetchLandingContent(config)
}
