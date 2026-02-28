import TextInput from "../../ui/TextInput.tsx";
import Button from "../../ui/Button.tsx";
import AuthTitle from "../AuthTitle.tsx";
import React from "react";

interface AuthEmailProps {
  email: string;
  setEmail: (val: string) => void;
  onNext: () => void;
}

export default function AuthEmail({email, setEmail, onNext}: AuthEmailProps) {
  const isValid = email.trim().length > 0 && email.includes('@');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center items-center gap-lg">
      <AuthTitle icon="at" title="Введите почту"/>

      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@gmail.com"
        type="email"
      />

      <p className="text-center select-none font-medium text-md text-text-secondary w-[330px] break-words">
        После этого мы отправим 6-значный код подтверждения на вашу почту
      </p>

      <Button type="submit" disabled={!isValid}>
        Продолжить
      </Button>
    </form>
  );
}
