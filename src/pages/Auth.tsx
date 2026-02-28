import {useState} from "react";
import AuthHeader from "../components/auth/AuthHeader.tsx";
import {AuthFooter} from "../components/auth/AuthFooter.tsx";
import {AuthContent} from "../components/auth/AuthContent.tsx";

export function Auth() {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <main className="size-full flex flex-col justify-center items-center relative">
      <AuthHeader/>
      <AuthContent step={step} onNext={handleNext} onPrev={handlePrev}/>
      <AuthFooter step={step}/>
    </main>
  );
}
