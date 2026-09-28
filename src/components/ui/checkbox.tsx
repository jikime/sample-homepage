"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

/**
 * Checkbox — design.md §12
 * 20px 박스 · border-strong 1px · checked accent 배경 + on-accent 체크 · radius-sm.
 * 라벨과 함께 44×44 터치 영역을 확보하는 건 감싸는 쪽(label)의 몫이다.
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface transition-colors duration-120 ease-enter disabled:cursor-not-allowed disabled:border-border aria-invalid:border-error data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-4" strokeWidth={2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
