import TextInput from "../../ui/TextInput.tsx";
import React, {useState} from "react";
import AuthContainer from "../AuthContainer.tsx";

interface AuthSignUpProps {
  onNext: () => void;
  isError: boolean;
  errorMsg: string;
  setError: (val: string | boolean) => void;
}

export default function AuthSignUp({onNext, isError, errorMsg, setError}: AuthSignUpProps) {
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isNicknameValid = nickname.trim().length > 0;

    if (!isNicknameValid) {
      setError("Никнейм не может быть пустым");
      return;
    }

    if (password.length < 8) {
      setError("Пароль слишком короткий (мин. 8 симв.)");
      return;
    }

    // TODO: Api call and register
    onNext();
  };

  return (
    <AuthContainer
      icon="lock"
      title="Пароль и ник"
      errorText={errorMsg}
      onSubmit={handleSubmit}
      isError={isError}
      description={
        <>
          Пароль должен состоять из 8-64 любых символов. Он будет использоваться для{" "}
          <a href="#" className="text-primary font-semibold">облачного хранения ключей</a>
        </>
      }
    >
      <TextInput
        value={password}
        type="password"
        placeholder="Пароль"
        icon="lock"
        error={isError}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(false);
        }}
      />
      <TextInput
        value={nickname}
        placeholder="Никнейм"
        icon="person"
        error={isError}
        onChange={(e) => {
          setNickname(e.target.value);
          setError(false);
        }}
      />
    </AuthContainer>
  );
}
