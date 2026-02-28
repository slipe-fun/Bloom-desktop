import AuthEmail from "./contents/AuthEmail.tsx";
import AuthSignUp from "./contents/AuthSignUp.tsx";
import Icon from "../ui/Icon.tsx";
import Button from "../ui/Button.tsx";
import AuthVerify from "./contents/AuthVerify.tsx";
import {useState} from "react";

interface AuthContentProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
}

export function AuthContent({step, onNext, onPrev}: AuthContentProps) {
  const [email, setEmail] = useState("");

  return (
    <>
      {step > 0 && (
        <div className="absolute left-10 top-1/2 -translate-y-1/2">
          <Button variant="icon-secondary" onClick={onPrev}>
            <Icon size={30} icon="chevron.left"/>
          </Button>
        </div>
      )}

      {step === 0 && <AuthEmail email={email} setEmail={setEmail} onNext={onNext}/>}
      {step === 1 && <AuthVerify onNext={onNext}/>}
      {step === 2 && <AuthSignUp onNext={onNext}/>}
    </>
  );
}
