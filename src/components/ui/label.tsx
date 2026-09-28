"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label as LabelPrimitive } from "radix-ui"

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-body-sm font-semibold text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:text-disabled",
        className
      )}
      {...props}
    />
  )
}

export { Label }
