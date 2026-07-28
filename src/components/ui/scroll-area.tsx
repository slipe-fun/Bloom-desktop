import { useCallback } from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group flex touch-none p-0.75 transition-colors select-none",
        "data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:items-center data-horizontal:border-t data-horizontal:border-t-transparent",
        "data-vertical:h-full data-vertical:w-2.5 data-vertical:justify-center",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full transition-[background-color,width] duration-150 ease-out",
          "bg-foreground/10 group-hover:bg-foreground/25",
          "data-horizontal:h-1 data-vertical:w-1"
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

function VirtuosoScrollArea({
  className,
  style,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>) {
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return

      let cleanup: void | (() => void)
      if (typeof ref === "function") cleanup = ref(node)
      else if (ref) ref.current = node

      let lastScrollHeight = node.scrollHeight
      const observer = new MutationObserver(() => {
        if (node.scrollHeight !== lastScrollHeight) {
          lastScrollHeight = node.scrollHeight
          node.dispatchEvent(new Event("scroll"))
        }
      })

      observer.observe(node, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
      })

      return () => {
        observer.disconnect()
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) ref.current = null
      }
    },
    [ref]
  )

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <ScrollAreaPrimitive.Viewport
        ref={mergedRef}
        style={style}
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none"
        {...props}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
VirtuosoScrollArea.displayName = "VirtuosoScrollArea"

export { ScrollArea, ScrollBar, VirtuosoScrollArea }
