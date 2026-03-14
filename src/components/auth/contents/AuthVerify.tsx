import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import AuthContainer from "../AuthContainer.tsx";
import {authApi} from "../../../api/auth.ts";
import { load } from '@tauri-apps/plugin-store';

const springy = {
  type: "spring" as const,
  mass: 0.2,
  damping: 12,
  stiffness: 120,
};

interface AuthVerifyProps {
  email: string;
  onNext: () => void;
  isError: boolean;
  errorMsg: string;
  setError: (val: string | boolean) => void;
}

export default function AuthVerify({email, onNext, isError, errorMsg, setError}: AuthVerifyProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const length = 6;
  const separatorIndex = Math.floor(length / 2);

  const activeIndex = value.length;
  const indicatorIndex = Math.min(activeIndex, length - 1);
  const isComplete = activeIndex === length;

  useEffect(() => {
    if (isComplete) {
      handleSubmit();
    }
  }, [isComplete]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.length < length || isLoading) return;

    setIsLoading(true);
    setError(false);

    try {
      const authResponse = await authApi.verifyCode(email, value)

      if (authResponse) {
        const store = await load('store.json', { autoSave: false });

        await store.set('token', { value: authResponse?.token });
        await store.set('user', { value: authResponse?.user });
        await store.set('session_id', { value: authResponse?.session_id });

        await store.save();
      }

      onNext();
    } catch (error: any) {
      setError(error?.response?.status === 400 ? "Неверный код подтверждения" : (error?.response?.data?.message || error?.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, length);
    if (isError) setError(false);
    setValue(val);
  };

  return (
    <AuthContainer
      icon="id"
      title="Проверка почты"
      errorText={errorMsg}
      description="Введите 6-значный код, отправленный на вашу почту"
      onSubmit={handleSubmit}
      isError={isError}
    >
      <div className="relative flex justify-center items-center gap-sm w-full cursor-text"
           onClick={() => inputRef.current?.focus()}
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

        {Array.from({length}).map((_, i) => {
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
                      initial={{opacity: 0, scale: 0.8, y: 10}}
                      animate={{opacity: 1, scale: 1, y: 0}}
                      exit={{opacity: 0, scale: 0.8, y: -10}}
                      transition={{type: "spring", stiffness: 300, damping: 20}}
                      className={`absolute z-10 text-xxxl font-semibold pointer-events-none ${
                        isError ? 'text-red' : 'text-text-main'
                      }`}
                    >
                      {char}
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`placeholder-${i}`}
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      transition={{duration: 0.15}}
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
                      initial={{opacity: 0, scale: 0.8}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 1.2}}
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
    </AuthContainer>
  );
}
