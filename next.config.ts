import type { NextConfig } from "next"

import { ARTWORKS_BUCKET } from "./src/lib/supabase/storage"

// Supabase Storage 공개 bucket의 작품 이미지만 next/image 최적화를 허용한다(.env의 프로젝트 URL 기준).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/${ARTWORKS_BUCKET}/**`)] : [],
  },
}

export default nextConfig
