import { useState } from "react"
import { cn } from "@/lib/utils"
import { authStore, authActions, SEED_PHRASE_LENGTH } from "@/store/auth.store"
import { useSnapshot } from "valtio/react"
import { motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"

interface SeedPhraseInputProps {
  onChange?: (words: string[]) => void
  readOnly?: boolean
}

interface SeedWordFieldProps {
  index: number
  value: string
  onChange: (val: string) => void
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  readOnly?: boolean
}

export function SeedPhraseInput({
  onChange,
  readOnly = false,
}: SeedPhraseInputProps) {
  const { seedPhrase, loading } = useSnapshot(authStore)

  const handleWordChange = (index: number, val: string) => {
    if (readOnly) return
    const cleanValue = val.replace(/\s/g, "").toLowerCase()
    authActions.setSeedWord(index, cleanValue)

    if (onChange) {
      const updatedWords = [...seedPhrase]
      updatedWords[index] = cleanValue
      onChange(updatedWords)
    }
  }

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    startIndex: number
  ) => {
    if (readOnly) return
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const parsedWords = pastedText.trim().split(/\s+/)

    if (parsedWords.length > 1) {
      const updatedWords = [...seedPhrase]
      for (let i = 0; i < parsedWords.length; i++) {
        if (startIndex + i < SEED_PHRASE_LENGTH) {
          updatedWords[startIndex + i] = parsedWords[i].toLowerCase()
        }
      }
      authActions.setSeedPhrase(updatedWords)
      onChange?.(updatedWords)
    } else {
      handleWordChange(startIndex, parsedWords[0] || "")
    }
  }

  return (
    <motion.div
      className="grid w-full max-w-100 grid-cols-2 gap-3"
      transition={EASING.normalSpring}
      animate={{
        filter: loading ? "blur(8px)" : "blur(0px)",
        opacity: loading ? 0.5 : 1,
      }}
    >
      {Array.from({ length: SEED_PHRASE_LENGTH }).map((_, index) => (
        <SeedWordField
          key={index}
          index={index}
          value={seedPhrase[index]}
          onChange={(val) => handleWordChange(index, val)}
          onPaste={(e) => handlePaste(e, index)}
          readOnly={readOnly}
        />
      ))}
    </motion.div>
  )
}

function SeedWordField({
  index,
  value,
  onChange,
  onPaste,
  readOnly,
}: SeedWordFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isHighlighted = isFocused || value?.length > 0

  return (
    <div
      className={cn(
        "relative flex h-12 w-full items-center overflow-hidden rounded-lg border border-transparent bg-secondary px-4 transition-all duration-200 shadow-[0_0px_24px_4px_rgba(0,0,0,0.04)",
        !readOnly &&
          "focus-within:border-transparent focus-within:ring-2 focus-within:ring-selection-background/50",
        readOnly && "bg-popover-secondary"
      )}
    >
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onPaste={onPaste}
        onFocus={() => !readOnly && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "h-full w-full bg-transparent pr-12 text-base font-semibold text-foreground placeholder:text-muted-foreground/30 focus:outline-none",
          readOnly ? "cursor-default select-none" : "cursor-text"
        )}
      />

      <span
        className={cn(
          "pointer-events-none absolute right-1.25 -bottom-1.5 text-3xl leading-none font-bold italic transition-colors select-none",
          isHighlighted && !readOnly ? "text-foreground" : "text-foreground/40"
        )}
      >
        {index + 1}
      </span>
    </div>
  )
}
