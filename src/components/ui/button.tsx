import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Button — design.md §12
 * primary는 뷰포트당 1개(accent 배경 요소 ≤ 1). 나머지는 secondary·ghost로 물러선다.
 * disabled는 opacity가 아니라 surface-raised 배경 + text-disabled 글자로 표현한다.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-body font-semibold whitespace-nowrap transition-colors duration-120 ease-enter select-none disabled:pointer-events-none aria-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed active:duration-100 disabled:bg-surface-raised disabled:text-disabled aria-disabled:bg-surface-raised aria-disabled:text-disabled",
        secondary:
          "border-border-strong bg-transparent text-foreground hover:bg-surface-raised disabled:border-border disabled:text-disabled aria-disabled:border-border aria-disabled:text-disabled",
        ghost:
          "text-sub hover:bg-surface-raised hover:text-foreground disabled:text-disabled aria-disabled:text-disabled",
        nav: "font-normal text-sub hover:bg-surface-raised hover:text-foreground",
        danger: "bg-error text-primary-foreground disabled:bg-surface-raised disabled:text-disabled",
        link: "h-auto min-h-11 px-0 text-primary hover:text-primary-hover",
      },
      size: {
        md: "h-11 px-5",
        lg: "h-13 px-5",
        nav: "h-11 px-3",
        ghost: "h-10 px-3",
        icon: "size-11",
        none: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
