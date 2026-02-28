import React, {useEffect, useRef, useState} from "react";
import AuthTitle from "../AuthTitle.tsx";
import VerifyInput from "../VerifyInput.tsx";

export default function AuthVerify() {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isError, setIsError] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const currentCode = code.join('');

    if (currentCode.length === 6) {
      verifyCode(currentCode);
    }
  }, [code]);

  const verifyCode = (fullCode: string) => {
    if (fullCode !== "123456") {
      setIsError(true);
    } else {
      setIsError(false);
      alert("ok");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    if (isError) setIsError(false);

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (isError) setIsError(false);

      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isError) setIsError(false);

    const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');

    if (pasteData) {
      const newCode = [...code];
      pasteData.split('').forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);

      const focusIndex = Math.min(pasteData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-lg">
      <AuthTitle
        icon="id"
        title="Проверка почты"
      />
      <div className="flex justify-center items-center gap-sm w-[356px]">
        {code.map((digit, index) => (
          <React.Fragment key={index}>
            <VerifyInput
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              placeholder="0"
              inputMode="numeric"
              autoComplete="one-time-code"
              error={isError}
            />
            {index === 2 && (
              <span
                className={`text-xl font-light mx-1 transition-colors ${isError ? 'text-red' : 'text-text-secondary'}`}>
                —
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
