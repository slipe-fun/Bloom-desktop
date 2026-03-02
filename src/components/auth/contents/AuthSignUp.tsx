import TextInput from "../../ui/TextInput.tsx";
import Button from "../../ui/Button.tsx";
import React, {useState} from "react";
import AuthTitle from "../AuthTitle.tsx";
import { useNavigate } from 'react-router';

interface AuthSignUpProps {
  onNext: () => void;
}

export default function AuthSignUp({onNext}: AuthSignUpProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // TODO: Api call and register
    // onNext();
    navigate("/chat", { replace: true })
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center items-center gap-lg w-[356px]">
      <AuthTitle icon="lock" title="Пароль и ник"/>

      <TextInput
        value={password}
        icon="lock"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />

      <TextInput
        value={nickname}
        icon="person"
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Никнейм"
        required
      />

      <p className="text-center select-none text-md text-text-secondary w-full break-words">
        Пароль должен состоять из 8-64 любых символов. Он будет использоваться для <a href="#"
                                                                                      className="text-primary cursor-pointer font-semibold">облачного
        хранения ключей</a>
      </p>

      <Button type="submit">
        Подтвердить
      </Button>
    </form>
  );
}
