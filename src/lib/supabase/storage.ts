/**
 * Supabase Storage — 작품 이미지 bucket.
 * 앱 · seed 생성 · 업로드 스크립트가 같은 규칙을 쓴다.
 */
export const ARTWORKS_BUCKET = "artworks"

/** 공개 샘플이 들어가는 폴더 */
export const ARTWORK_SAMPLES_PREFIX = "samples"

/** 목업의 로컬 경로(/images/samples/x.webp) → bucket 안 경로(samples/x.webp) */
export function toArtworkStoragePath(localSrc: string): string {
  const fileName = localSrc.split("/").pop()
  if (!fileName) throw new Error(`작품 이미지 경로가 올바르지 않아요: ${localSrc}`)
  return `${ARTWORK_SAMPLES_PREFIX}/${fileName}`
}
