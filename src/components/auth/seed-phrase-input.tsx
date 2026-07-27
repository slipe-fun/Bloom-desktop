import { useState } from "react"
import { cn } from "@/lib/utils"
import { authStore, authActions } from "@/store/auth.store"
import { useSnapshot } from "valtio/react"

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

export function SeedPhraseInput({ onChange, readOnly = false }: SeedPhraseInputProps) {
  const { seedPhrase } = useSnapshot(authStore)

  const handleWordChange = (index: number, val: string) => {
    if (readOnly) return
    const cleanValue = val.replace(/\s/g, "").toLowerCase()
    const updatedWords = [...seedPhrase]
    updatedWords[index] = cleanValue
    authActions.setSeedPhrase(updatedWords)
    onChange?.(updatedWords)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    if (readOnly) return
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const parsedWords = pastedText.trim().split(/\s+/)

    if (parsedWords.length > 1) {
      const updatedWords = [...seedPhrase]
      for (let i = 0; i < parsedWords.length; i++) {
        if (startIndex + i < 12) {
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
    <div className="w-full max-w-100">
      <div className="grid grid-cols-2 gap-3">
        {seedPhrase.map((word, index) => (
          <SeedWordField
            key={index}
            index={index}
            value={word}
            onChange={(val) => handleWordChange(index, val)}
            onPaste={(e) => handlePaste(e, index)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  )
}

function SeedWordField({ index, value, onChange, onPaste, readOnly }: SeedWordFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isHighlighted = isFocused || value.length > 0

  return (
    <div
      className={cn(
        "relative flex h-12 overflow-hidden w-full items-center rounded-lg bg-secondary px-4 transition-all duration-200 border border-transparent",
        !readOnly && "focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-transparent"
      )}
    >
      <input
        type="text"
        value={value}
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
          "w-full h-full bg-transparent font-semibold text-foreground placeholder:text-muted-foreground/30 focus:outline-none pr-12 text-base",
          readOnly ? "cursor-default select-none" : "cursor-text"
        )}
      />
      
      <span
        className={cn(
          "absolute right-1.25 -bottom-1.5 text-3xl font-bold italic select-none pointer-events-none leading-none transition-colors",
          isHighlighted && !readOnly
            ? "text-foreground" 
            : "text-foreground/40"
        )}
      >
        {index + 1}
      </span>
    </div>
  )
}