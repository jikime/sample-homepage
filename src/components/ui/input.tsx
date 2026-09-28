import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Input — design.md §12
 * 높이 44 · 좌우 12 · radius-md · 글자 16px(iOS 확대 방지).
 * 기본 border-strong → hover text-sub → focus 2px 링이 테두리를 대체 → error 1px error.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-border-strong bg-surface px-3 text-body text-foreground transition-colors duration-120 ease-enter placeholder:text-muted-foreground hover:border-sub focus-visible:border-transparent focus-visible:outline-offset-0 disabled:pointer-events-none disabled:bg-background disabled:text-disabled aria-invalid:border-error",
        className
      )}
      {...props}
    />
  )
}

export { Input }
