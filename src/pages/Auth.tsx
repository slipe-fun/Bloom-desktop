import {useState} from "react";
import AuthHeader from "../components/auth/AuthHeader.tsx";
import {AuthFooter} from "../components/auth/AuthFooter.tsx";
import {AuthContent} from "../components/auth/AuthContent.tsx";
import {useNavigate} from "react-router-dom";

export function Auth() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 2) {
      navigate("/main");
      return;
    }

    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="size-full flex flex-col justify-center items-center relative overflow-hidden">
      <AuthHeader/>
      <AuthContent
        step={step}
        direction={direction}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      <AuthFooter step={step}/>
    </main>
  );
}
