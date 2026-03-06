import React, {useEffect, useState} from "react";
import {AnimatePresence, motion, Variants} from "framer-motion";
import TextInput from "../../ui/TextInput.tsx";
import AuthContainer from "../AuthContainer.tsx";
import Icon from "../../ui/Icon.tsx";
import parseEmail from "../../../lib/parseEmail.ts";
import {PROVIDERS_LOGOS} from "../../../constants/providerLogos.ts";
import axios from "axios";
import {API_URL} from "../../../constants/api_url.ts";

const ENABLE_API = import.meta.env.VITE_ENABLE_API === 'true';

interface AuthEmailProps {
  email: string;
  setEmail: (val: string) => void;
  onNext: () => void;
  setError: (val: string | boolean) => void;
  setLoading: (val: boolean) => void;
  isError: boolean;
  errorMsg: string;
}

const animVariants: Variants = {
  initial: {opacity: 0, scale: 0.5},
  animate: {
    opacity: 1,
    scale: 1,
    transition: {duration: 0.15, ease: "circOut"}
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: {duration: 0.15, ease: "circOut"}
  }
};


export default function AuthEmail({
                                    email,
                                    setEmail,
                                    onNext,
                                    setError,
                                    setLoading,
                                    isError,
                                    errorMsg
                                  }: AuthEmailProps) {
  const [provider, setProvider] = useState<keyof typeof PROVIDERS_LOGOS | 'unknown'>('unknown');
  const isValid = email.trim().length > 0 && email.includes('@');

  useEffect(() => {
    const {provider: parsedProvider} = parseEmail(email);
    setProvider(parsedProvider);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setError("Пожалуйста, введите корректный адрес почты");
      return;
    }

    setLoading(true);
    setError(false);

    if (!ENABLE_API) {
      console.log("[DEV] API disabled. Mocking success for:", email);
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoading(false);
      onNext();
      return;
    }

    try {
      const existsRes = await axios.get(`${API_URL}/user/exists`, {
        params: {email}
      });

      const exists = existsRes.data?.exists;

      if (exists) {
        await axios.post(`${API_URL}/auth/request-code`, {email});
      } else {
        const regRes = await axios.post(`${API_URL}/auth/register`, {email});
        if (regRes.data?.error) {
          throw new Error('Failed to register');
        }
        onNext();
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      setError("Ошибка соединения с сервером. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const animatedIcon = (
    <AnimatePresence mode="wait" initial={false}>
      {provider === 'unknown' ? (
        <motion.div
          key="icon-at"
          variants={animVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-center w-full h-full absolute inset-0"
        >
          <Icon icon="at" size={24} className={isError ? "text-red" : "text-text-secondary"}/>
        </motion.div>
      ) : (
        <motion.div
          key={`provider-${provider}`}
          variants={animVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-center w-full h-full absolute inset-0"
        >
          <img
            src={PROVIDERS_LOGOS[provider]}
            alt={provider}
            className="w-6 h-6 object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <AuthContainer
      icon="at"
      title="Введите почту"
      errorText={errorMsg}
      description="После этого мы отправим 6-значный код подтверждения на вашу почту"
      onSubmit={handleSubmit}
      isError={isError}
    >
      <TextInput
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (isError) setError(false);
        }}
        variant='secondary'
        placeholder="example@gmail.com"
        type="email"
        error={isError}
        leftElement={animatedIcon}
      />
    </AuthContainer>
  );
}
