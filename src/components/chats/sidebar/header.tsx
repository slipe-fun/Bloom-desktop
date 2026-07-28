import { useState, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Pencil from "@/assets/icons/pencil.svg?react"
import Message from "@/assets/icons/message.svg?react"
import Magnifyingglass from "@/assets/icons/magnifyingglass.svg?react"
import X from "@/assets/icons/x.svg?react"
import { Button } from "@/components/ui/button"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"
import { EASING } from "@/constants/animations-easing"

export default function SidebarHeader() {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [placeholderWidth, setPlaceholderWidth] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholderMeasureRef = useRef<HTMLSpanElement>(null)

  const isSearchActive = isFocused || searchValue !== ""

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" || e.key === "Enter") {
      inputRef.current?.blur()
    }
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setSearchValue("")
    inputRef.current?.blur()
  }

  useLayoutEffect(() => {
    const measure = () => {
      if (placeholderMeasureRef.current) {
        setPlaceholderWidth(placeholderMeasureRef.current.offsetWidth)
      }
    }

    measure()

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure)
    }
  }, [])

  return (
    <header
      style={{ paddingTop: TITLEBAR_HEIGHT }}
      className="flex w-full flex-col gap-4 border-b border-foreground/10 p-4 pb-3 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full cursor-default items-center gap-1.5">
          <Message className="size-7.5 text-foreground/40" />
          <span className="text-2xl font-bold tracking-tight">Chats</span>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="size-11 rounded-full"
          aria-label="New chat"
        >
          <Pencil className="size-6.5" />
        </Button>
      </div>

      <div
        className="relative h-11 w-full cursor-text overflow-hidden rounded-full bg-secondary"
        onClick={() => inputRef.current?.focus()}
      >
        <motion.div
          initial={false}
          animate={{
            paddingLeft: isSearchActive
              ? "calc(0% + 12px)"
              : "calc(50% + -85px)",
          }}
          transition={EASING.middleSpring}
          className="absolute inset-0 flex items-center pr-12"
        >
          <Magnifyingglass className="size-5.5 shrink-0 text-foreground/40" />

          <div className="relative z-10 ml-2 flex h-full flex-1 items-center">
            {/* Скрытый span только для измерения реальной ширины текста плейсхолдера */}
            <span
              ref={placeholderMeasureRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 text-base font-medium whitespace-nowrap"
            >
              Search across chats
            </span>

            <AnimatePresence>
              {searchValue === "" && (
                <motion.span
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={EASING.middleSpring}
                  className="pointer-events-none absolute left-0 text-base font-medium whitespace-nowrap text-foreground/40"
                >
                  Search across chats
                </motion.span>
              )}
            </AnimatePresence>

            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              aria-label="Search across chats"
              style={{
                width: isSearchActive
                  ? "100%"
                  : placeholderWidth
                    ? `${placeholderWidth}px`
                    : undefined,
              }}
              className="h-full bg-transparent text-base font-medium text-foreground outline-none"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isFocused && (
            <motion.button
              initial={{ opacity: 0, scale: 0.65, rotate: 45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.65, rotate: 45 }}
              transition={EASING.middleSpring}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              type="button"
              aria-label="Clear search"
              className="absolute top-1/2 right-3 z-20 flex -translate-y-1/2 items-center justify-center text-foreground/40 transition-colors outline-none hover:text-foreground"
            >
              <X className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
