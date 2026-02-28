import TextInput from "../../ui/TextInput.tsx";
import Button from "../../ui/Button.tsx";
import {useState} from "react";
import AuthTitle from "../AuthTitle.tsx";

export default function AuthSignIn() {
  const [password, setPassword] = useState("");

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-lg">
      <AuthTitle
        icon="lock"
        title="Привет User"
      />

      <TextInput value={password} icon="lock" type="password"
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Пароль"/>

      <Button type="submit">
        Подтвердить
      </Button>
    </div>
  )
}
