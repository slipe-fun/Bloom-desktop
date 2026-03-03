import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import AuthEmail from "./contents/AuthEmail.tsx";
import AuthSignUp from "./contents/AuthSignUp.tsx";
import AuthVerify from "./contents/AuthVerify.tsx";
import Icon from "../ui/Icon.tsx";
import Button from "../ui/Button.tsx";

interface AuthContentProps {
  step: number;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export function AuthContent({step, direction, onNext, onPrev}: AuthContentProps) {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {step === 1 && (
        <div className="absolute left-1/5 top-1/2 -translate-y-1/2 z-10">
          <Button variant="icon-secondary" onClick={onPrev}>
            <Icon size={30} icon="chevron.left"/>
          </Button>
        </div>
      )}

      {step <= 2 && (
        <div className="absolute right-1/5 top-1/2 -translate-y-1/2 z-10">
          <Button
            type="submit"
            form="auth-step-form"
            variant={step === 1 ? "icon-secondary" : "icon-primary"}
            error={isError}
            disabled={isLoading}
          >
            <Icon size={30} icon="chevron.right"/>
          </Button>
        </div>
      )}

      <div className="grid h-full">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {type: "spring", stiffness: 300, damping: 30},
              opacity: {duration: 0.2}
            }}
            className="col-start-1 row-start-1 h-full w-auto flex flex-col justify-center"
          >
            {step === 0 && (
              <AuthEmail
                email={email}
                setEmail={setEmail}
                onNext={onNext}
                setError={setIsError}
                setLoading={setIsLoading}
                isError={isError}
              />
            )}
            {step === 1 && (
              <AuthVerify
                onNext={onNext}
                isError={isError}
                setIsError={setIsError}
              />
            )}
            {step === 2 && (
              <AuthSignUp
                onNext={onNext}
                isError={isError}
                setIsError={setIsError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
