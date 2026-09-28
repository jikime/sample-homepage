import * as React from "react"
import { CircleAlertIcon } from "lucide-react"

/** 필드 아래 에러 문구 — error 색 + 아이콘(색만으로 구분하지 않는다). 입력의 aria-describedby가 id를 가리킨다. */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1 text-body-sm text-error">
      <CircleAlertIcon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="pt-px">{children}</span>
    </p>
  )
}

export { FieldError }
