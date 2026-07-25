import { proxy } from "valtio"

type AuthMethod = "seed" | "qr" | "success" | "signUp"

interface AuthStore {
  seedPhrase: string[]
  method: AuthMethod
}

export const authStore = proxy<AuthStore>({
  seedPhrase: Array(12).fill(""),
  method: "qr",
})

export const authActions = {
  setAuthMethod: (method: AuthMethod) => {
    authStore.method = method
  },
  setSeedPhrase: (seedPhrase: string[]) => {
    authStore.seedPhrase = seedPhrase
  },
}
