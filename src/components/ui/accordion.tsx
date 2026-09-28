"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { MinusIcon, PlusIcon } from "lucide-react"

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex w-full flex-col", className)} {...props} />
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-border", className)} {...props} />
}

/** 목업 FAQ 규칙: 닫힘 `+` · 열림 `−`, 아이콘 20px text-muted, hover 행 surface-raised */
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-4 rounded-md text-left transition-colors duration-120 ease-enter hover:bg-surface-raised",
          className
        )}
        {...props}
      >
        {children}
        <PlusIcon
          className="size-5 shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:hidden"
          strokeWidth={1.75}
          aria-hidden
        />
        <MinusIcon
          className="hidden size-5 shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:block"
          strokeWidth={1.75}
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden duration-180 data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn(className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
