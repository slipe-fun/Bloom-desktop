import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthTitle from "../AuthTitle.tsx"; // Проверьте путь

const springy = {
  type: "spring" as const,
  mass: 0.2,
  damping: 12,
  stiffness: 120,
};

interface AuthVerifyProps {
  onNext: () => void;
}

export default function AuthVerify({ onNext }: AuthVerifyProps) {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const length = 6;
  const separatorIndex = Math.floor(length / 2);

  const activeIndex = value.length;
  const indicatorIndex = Math.min(activeIndex, length - 1);
  const isComplete = activeIndex === length;

  useEffect(() => {
    if (isComplete) {
      if (value !== "123456") {
        setIsError(true);
      } else {
        setIsError(false);
        onNext();
      }
    }
  }, [value, isComplete, onNext]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, length);
    if (isError) setIsError(false);
    setValue(val);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-lg w-[356px]">
      <AuthTitle icon="id" title="Проверка почты" />

      <div
        className="relative flex justify-center items-center gap-sm w-full cursor-text"
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-50"
          maxLength={length}
        />

        {Array.from({ length }).map((_, i) => {
          const char = value[i];
          const isPlaceholder = !char;
          const isActiveIndicator = i === indicatorIndex;

          return (
            <React.Fragment key={`cell-fragment-${i}`}>
              {i === separatorIndex && (
                <div 
                  className={`h-[2px] w-4 rounded-full transition-colors ${
                    isError ? 'bg-red' : 'bg-text-secondary'
                  }`} 
                />
              )}

              <div 
                className={`relative w-12 h-16 flex items-center justify-center rounded-sm bg-foreground-soft transition-all duration-300 ${
                  isActiveIndicator ? 'z-20' : 'z-0'
                }`}
              >
                <AnimatePresence>
                  {!isPlaceholder ? (
                    <motion.span
                      key={`char-${char}-${i}`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`absolute z-10 text-xxxl font-semibold pointer-events-none ${
                        isError ? 'text-red' : 'text-text-main'
                      }`}
                    >
                      {char}
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`placeholder-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-0 text-xxxl font-semibold text-text-secondary pointer-events-none"
                    >
                      0
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isFocused && isActiveIndicator && !isComplete && (
                    <motion.div
                      layoutId="otp-indicator"
                      transition={springy}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className={`absolute inset-0 border-2 rounded-sm pointer-events-none z-20 ${
                        isError ? 'border-red ring-2 ring-backdrop-red/20' : 'border-primary'
                      }`}
                    />
                  )}
                </AnimatePresence>
                
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <p className="text-center select-none font-medium text-md text-text-secondary w-full break-words">
        Введите 6-значный код, отправленный на вашу почту
      </p>
    </div>
  );
}
