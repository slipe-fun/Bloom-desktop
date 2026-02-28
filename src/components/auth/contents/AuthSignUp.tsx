import TextInput from "../../ui/TextInput.tsx";
import Button from "../../ui/Button.tsx";
import {useState} from "react";
import AuthTitle from "../AuthTitle.tsx";

export default function AuthSignUp() {
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-lg">
      <AuthTitle
        icon="lock"
        title="Пароль и ник"
      />

      <TextInput value={password} icon="lock" type="password"
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Пароль"/>

      <TextInput value={nickname} icon="person"
                 onChange={(e) => setNickname(e.target.value)}
                 placeholder="Никнейм"/>

      <p className="text-center select-none text-md text-text-secondary w-[330px] break-words">
        Пароль должен состоять из 8-64 любых символов. Он будет использоваться для <a href=""
                                                                                      className="text-primary cursor-pointer font-semibold">
        облачного хранения ключей
      </a>
      </p>

      <Button type="submit">
        Подтвердить
      </Button>
    </div>
  )
}
