import TextInput from "../../ui/TextInput.tsx";
import React, {useState} from "react";
import AuthTitle from "../AuthTitle.tsx";

interface AuthSignUpProps {
  onNext: () => void;
  isError: boolean;
  setIsError: (val: boolean) => void;
}

export default function AuthSignUp({onNext, isError, setIsError}: AuthSignUpProps) {
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPasswordValid = password.length >= 8;
    const isNicknameValid = nickname.trim().length > 0;
    
    if (!isPasswordValid || !isNicknameValid) {
      setIsError(true);
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      return;
    }

    // TODO: Api call and register
    onNext();
  };

  return (
    <form
      id="auth-step-form"
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col justify-center items-center gap-lg w-[356px]"
    >
      <AuthTitle icon="lock" title="Пароль и ник"/>

      <TextInput
        value={password}
        icon="lock"
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
          if (isError) setIsError(false);
        }}
        placeholder="Пароль"
        error={isError}
        required
      />

      <TextInput
        value={nickname}
        icon="person"
        onChange={(e) => {
          setNickname(e.target.value);
          if (isError) setIsError(false);
        }}
        placeholder="Никнейм"
        required
      />

      <p className="text-center select-none text-md text-text-secondary w-full break-words">
        Пароль должен состоять из 8-64 любых символов. Он будет использоваться для <a href="#"
                                                                                      className="text-primary cursor-pointer font-semibold">облачного
        хранения ключей</a>
      </p>

      <button type="submit" className="hidden"/>
    </form>
  );
}
