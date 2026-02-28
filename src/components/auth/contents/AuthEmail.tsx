import TextInput from "../../ui/TextInput.tsx";
import Button from "../../ui/Button.tsx";
import {useState} from "react";
import AuthTitle from "../AuthTitle.tsx";

export default function AuthEmail() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-lg">
      <AuthTitle
        icon="at"
        title="Введите почту"
      />

      <TextInput value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="example@gmail.com"/>

      <p className="text-center select-none font-medium text-md text-text-secondary w-[330px] break-words">
        После этого мы отправим 6-значный код подтверждения на вашу почту
      </p>

      <Button type="submit">
        Продолжить
      </Button>
    </div>
  )
}
