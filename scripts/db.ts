/**
 * .env 의 SUPABASE_DB_URL 로 원격 Supabase DB를 다룬다(Supabase CLI 필요).
 *   pnpm db:push            마이그레이션(테이블) + seed.sql(목업 데이터) 반영 후 Data API 스키마 캐시 갱신
 *   pnpm db:push --dry-run  무엇이 반영될지만 확인
 *   pnpm db:seed            seed.sql을 다시 넣는다(목업을 고친 뒤). db:push는 이미 넣은 seed를 다시 실행하지 않는다
 *   pnpm db:types           클라우드 프로젝트 스키마로 src/lib/supabase/database.types.ts 다시 생성
 *                           (Docker 불필요, 처음 한 번 `supabase login` 또는 SUPABASE_ACCESS_TOKEN 필요)
 */
import { spawnSync } from "node:child_process"
import { existsSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

// Next.js와 같은 우선순위: .env.local 이 .env 보다 먼저(이미 읽은 값은 덮어쓰지 않음)
for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file)
  if (existsSync(path)) process.loadEnvFile(path)
}

const [command, ...extraArgs] = process.argv.slice(2)

function requireDbUrl(): string {
  const dbUrl = process.env.SUPABASE_DB_URL?.trim()
  if (!dbUrl) {
    console.error("SUPABASE_DB_URL이 비어 있어요. .env에 DB 연결 문자열(Connect → Session pooler)을 넣어 주세요.")
    process.exit(1)
  }
  return dbUrl
}

/** https://<project-ref>.supabase.co → project-ref */
function requireProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
  const ref = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/)?.[1]
  if (!ref) {
    console.error("NEXT_PUBLIC_SUPABASE_URL에서 프로젝트 ID를 찾지 못했어요. https://<프로젝트ID>.supabase.co 형식인지 확인해 주세요.")
    process.exit(1)
  }
  return ref
}

function supabase(args: string[], capture = false) {
  const result = spawnSync("supabase", args, {
    cwd: root,
    stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
  })
  if (result.error) {
    console.error("Supabase CLI를 실행하지 못했어요. `brew install supabase/tap/supabase`로 설치해 주세요.")
    process.exit(1)
  }
  if (result.status !== 0) {
    if (capture) console.error("로그인이 필요하면 `supabase login`을 한 번 실행하거나 SUPABASE_ACCESS_TOKEN을 설정해 주세요.")
    process.exit(result.status ?? 1)
  }
  return result.stdout
}

/**
 * 새 테이블이 Data API(PostgREST)에 바로 보이도록 스키마 캐시를 다시 읽게 한다.
 * 이게 늦으면 앱에서 "Could not find the table ... in the schema cache"(PGRST205)가 난다.
 */
function reloadSchemaCache(dbUrl: string) {
  const result = spawnSync("psql", [dbUrl, "-X", "-q", "-c", "notify pgrst, 'reload schema'"], {
    stdio: ["ignore", "ignore", "pipe"],
    encoding: "utf8",
    env: { ...process.env, PGCONNECT_TIMEOUT: "15" },
  })
  if (result.error || result.status !== 0) {
    console.warn("스키마 캐시 갱신을 건너뛰었어요(psql 없음 또는 연결 실패). 대시보드 SQL Editor에서 `notify pgrst, 'reload schema';`를 실행해 주세요.")
    return
  }
  console.log("Data API 스키마 캐시를 갱신했어요.")
}

switch (command) {
  case "push": {
    const dbUrl = requireDbUrl()
    supabase(["db", "push", "--db-url", dbUrl, "--include-seed", "--yes", ...extraArgs])
    if (!extraArgs.includes("--dry-run")) reloadSchemaCache(dbUrl)
    break
  }
  case "seed": {
    const result = spawnSync("psql", [requireDbUrl(), "-X", "-q", "-v", "ON_ERROR_STOP=1", "-1", "-f", resolve(root, "supabase/seed.sql")], {
      stdio: "inherit",
      env: { ...process.env, PGCONNECT_TIMEOUT: "15" },
    })
    if (result.error) {
      console.error("psql을 찾지 못했어요. `brew install libpq`로 설치하거나 SQL Editor에서 supabase/seed.sql을 실행해 주세요.")
      process.exit(1)
    }
    if (result.status !== 0) process.exit(result.status ?? 1)
    console.log("seed.sql을 다시 넣었어요(랜딩 home 페이지는 지우고 새로 넣음, 작품은 upsert).")
    break
  }
  case "types": {
    const types = supabase(["gen", "types", "typescript", "--project-id", requireProjectRef(), "--schema", "public"], true)
    const output = resolve(root, "src/lib/supabase/database.types.ts")
    writeFileSync(output, types)
    console.log(`타입 생성: ${output}`)
    break
  }
  default:
    console.error("사용법: tsx scripts/db.ts <push|seed|types> [추가 인자]")
    process.exit(1)
}
