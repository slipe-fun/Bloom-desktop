import TextInput from "../../ui/TextInput.tsx";
import React, {useState} from "react";
import AuthContainer from "../AuthContainer.tsx";
import { keysDumpApi } from "../../../api/keysDump.ts";
import { load } from '@tauri-apps/plugin-store';
import { decryptKeys, hashPassword } from "../../../lib/skid/keyEncryption.ts";
import base64ToBytes from "../../../lib/skid/utils/base64ToBytes.ts";

interface AuthSignUpProps {
  email: string;
  onNext: () => void;
  isError: boolean;
  errorMsg: string;
  setError: (val: string | boolean) => void;
}

export default function AuthSignUp({email, onNext, isError, errorMsg, setError}: AuthSignUpProps) {
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (nickname.trim().length === 0) {
      setError("Никнейм не может быть пустым");
      return;
    }

    if (password.length < 8) {
      setError("Пароль слишком короткий (мин. 8 симв.)");
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const store = await load('store.json', { autoSave: false });
      const token = await store.get('token');

      const keys = await keysDumpApi.get(token?.value)

      const passwordHash = await hashPassword(password, keys?.salt ? base64ToBytes(keys?.salt) : undefined)

      const decryptedKeys = decryptKeys(passwordHash.hash, keys?.ciphertext, keys?.nonce)

      console.log(decryptedKeys)

      onNext();
    } catch (error: any) {
      console.log(error)
      setError(error.message || "Ошибка при сохранении данных");
    } finally {
      setIsLoading(false);
    }
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
        variant='secondary'
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
        variant='secondary'
        error={isError}
        onChange={(e) => {
          setNickname(e.target.value);
          setError(false);
        }}
      />
    </AuthContainer>
  );
}
