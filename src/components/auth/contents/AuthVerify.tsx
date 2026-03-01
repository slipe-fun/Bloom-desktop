import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthTitle from "../AuthTitle.tsx";

const quickSpring = {
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

  useEffect(() => {
    if (value.length === length) {
      if (value !== "123456") {
        setIsError(true);
      } else {
        setIsError(false);
        onNext();
      }
    }
  }, [value, onNext]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, length);
    if (isError) setIsError(false);
    setValue(val);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };
  const activeIndex = Math.min(value.length, length - 1);
  const showIndicator = isFocused && value.length < length;

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
          className="absolute inset-0 opacity-0 cursor-default"
          style={{ zIndex: -1 }}
          maxLength={6}
        />

        <AnimatePresence>
          {showIndicator && (
            <motion.div
              layoutId="otp-indicator"
              className={`absolute z-10 border-2 rounded-sm pointer-events-none box-border
                ${isError ? 'border-red ring-2 ring-backdrop-red/20' : 'border-primary'}
              `}
              initial={false}
              animate={{
                x: activeIndex * (48 + 8) + (activeIndex >= 3 ? 28 : 0),
                width: 48,
                height: 64,
              }}
              transition={quickSpring}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          )}
        </AnimatePresence>

        {Array.from({ length }).map((_, i) => {
          const char = value[i];
          const isSeparator = i === 3;

          return (
            <React.Fragment key={i}>
              {isSeparator && (
                <span className={`text-xl font-light mx-1 transition-colors ${isError ? 'text-red' : 'text-text-secondary'}`}>
                  —
                </span>
              )}

              <div
                className="relative w-12 h-16 flex items-center justify-center rounded-sm bg-foreground-soft"
              >
                {char ? (
                  <span className={`text-xxxl font-semibold ${isError ? 'text-red' : 'text-text-main'}`}>
                    {char}
                  </span>
                ) : (
                  <span className="text-xxxl font-semibold text-text-secondary">
                    0
                  </span>
                )}
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