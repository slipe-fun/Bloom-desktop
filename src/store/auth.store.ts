import { proxy } from "valtio"

type AuthMethod = "seed" | "qr" | "success" | "signUp"

interface AuthStore {
  seedPhrase: string[]
  method: AuthMethod
  loading: boolean
  seedPhraseDialog: boolean
}

export const authStore = proxy<AuthStore>({
  seedPhrase: Array(12).fill(""),
  method: "qr",
  loading: false,
  seedPhraseDialog: false,
})

export const authActions = {
  setAuthMethod: (method: AuthMethod) => {
    authStore.method = method
  },
  setSeedPhrase: (seedPhrase: string[]) => {
    authStore.seedPhrase = seedPhrase
  },
  setLoading: (loading: boolean) => {
    authStore.loading = loading
  },
  setSeedPhraseDialog: (seedPhraseDialog: boolean) => {
    authStore.seedPhraseDialog = seedPhraseDialog
  }
}
