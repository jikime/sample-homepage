/**
 * public/images/samples 의 작품 이미지를 Supabase Storage bucket "artworks"의 samples/ 폴더로 올린다.
 *   pnpm storage:upload
 * 같은 이름이 있으면 덮어쓴다(upsert). bucket은 migration(20260928010000_artworks_storage.sql)이 만든다.
 * 필요한 값: .env 의 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { createClient } from "@supabase/supabase-js"

import { ARTWORKS_BUCKET, toArtworkStoragePath } from "../src/lib/supabase/storage"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE_DIR = resolve(root, "public/images/samples")
const CACHE_CONTROL_SECONDS = "86400"
const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
}

for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file)
  if (existsSync(path)) process.loadEnvFile(path)
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim()
  if (!url || !secretKey) {
    throw new Error(".env의 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SECRET_KEY가 필요해요.")
  }

  const supabase = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error: bucketError } = await supabase.storage.getBucket(ARTWORKS_BUCKET)
  if (bucketError) {
    throw new Error(`bucket "${ARTWORKS_BUCKET}"이 없어요. 먼저 pnpm db:push로 migration을 반영해 주세요. (${bucketError.message})`)
  }

  const files = readdirSync(SOURCE_DIR)
    .filter((name) => CONTENT_TYPES[extname(name).toLowerCase()])
    .sort()
  if (files.length === 0) throw new Error(`${SOURCE_DIR}에 올릴 이미지가 없어요.`)

  const bucket = supabase.storage.from(ARTWORKS_BUCKET)
  for (const name of files) {
    const storagePath = toArtworkStoragePath(name)
    const body = readFileSync(resolve(SOURCE_DIR, name))
    const { error } = await bucket.upload(storagePath, body, {
      contentType: CONTENT_TYPES[extname(name).toLowerCase()],
      cacheControl: CACHE_CONTROL_SECONDS,
      upsert: true,
    })
    if (error) throw new Error(`${storagePath} 업로드 실패: ${error.message}`)
    console.log(`업로드 ${storagePath} (${Math.round(body.length / 1024)}KB) → ${bucket.getPublicUrl(storagePath).data.publicUrl}`)
  }
  console.log(`완료: ${files.length}개 파일을 bucket "${ARTWORKS_BUCKET}"에 올렸어요.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
