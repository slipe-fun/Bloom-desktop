import TextInput from "../../ui/TextInput.tsx";
import React, { useEffect, useState } from "react";
import AuthContainer from "../AuthContainer.tsx";
import { keysDumpApi } from "../../../api/keysDump.ts";
import { load } from '@tauri-apps/plugin-store';
import { decryptKeys, hashPassword } from "../../../lib/skid/keyEncryption.ts";
import base64ToBytes from "../../../lib/skid/utils/base64ToBytes.ts";
import {
  getSecretBytes,
  getSecureStorageStatus,
  initializeSecureStorage,
  setSecret,
  unlockSecureStorage,
} from "../../../lib/native/secureStorage.ts";
import bytesToBase64 from "../../../lib/skid/utils/bytesToBase64.ts";
import generateKeys from "../../../lib/skid/generateKeys.ts";
import { sessionApi } from "../../../api/session.ts";
import { userApi } from "../../../api/user.ts";

interface AuthSignUpProps {
  email: string;
  onNext: () => void;
  isError: boolean;
  errorMsg: string;
  setError: (val: string | boolean) => void;
}

export default function AuthSignUp({ email, onNext, isError, errorMsg, setError }: AuthSignUpProps) {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (nickname.trim().length === 0 && user?.username?.length == 0) {
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
      const store = await load('store.json', { autoSave: false, defaults: {} });
      const token = await store.get('token');

      const keys = await keysDumpApi.get(token?.value)

      const passwordHash = await hashPassword(password, keys?.salt ? base64ToBytes(keys?.salt) : undefined)

      const decryptedKeys = decryptKeys(passwordHash.hash, keys?.ciphertext, keys?.nonce)

      if (decryptedKeys) {
        const secureStorageStatus = await getSecureStorageStatus();

        if (secureStorageStatus.initialized) {
          await unlockSecureStorage(password);
        } else {
          await initializeSecureStorage(password);
        }

        await Promise.all(
          decryptedKeys.map((chat) =>
            setSecret(`chat:${chat.id}`, "chat_key", base64ToBytes(chat.key))
          )
        );

        await setSecret("user", "pbkdf2_password", bytesToBase64(passwordHash.hash))
        await setSecret("user", "pbkdf2_salt", bytesToBase64(passwordHash.salt))
      }

      const session = await sessionApi.get(token?.value)

      if (!session?.identity_pub && !session?.ecdh_pub && !session?.kyber_pub) {
        const ns = "user"
        const sessionKeys = generateKeys()

        const uploadKeys = await sessionApi.uploadSessionKeys(token?.value, sessionKeys)
        if (uploadKeys) {
          await Promise.all([
            setSecret(ns, 'ed25519_public', sessionKeys.ed_public_key),
            setSecret(ns, 'ed25519_private', sessionKeys.ed_secret_key),
            setSecret(ns, 'kyber_public', sessionKeys.kyber_public_key),
            setSecret(ns, 'kyber_private', sessionKeys.kyber_secret_key),
            setSecret(ns, 'ecdh_public', sessionKeys.ecdh_public_key),
            setSecret(ns, 'ecdh_private', sessionKeys.ecdh_secret_key),
          ])
        }
      }

      //await userApi.editUsername(token?.value, user?.username?.length > 0 ? user?.username : nickname)
      await userApi.editUsername(token?.value, nickname)

      onNext();
    } catch (error: any) {
      setError(error.message || error || "Ошибка при сохранении данных");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const store = await load('store.json', { autoSave: false, defaults: {} });
      const user = await store.get('user');
      setUser(user?.value)
    })()
  }, [])

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
      {user?.username?.length == 0 ?
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
      /> : null }
    </AuthContainer>
  );
}
