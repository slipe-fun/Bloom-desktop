import { proxy } from "valtio"

export type AuthMethod = "seed" | "qr" | "success" | "signUp"

export const SEED_PHRASE_LENGTH = 12

interface AuthStore {
  seedPhrase: string[]
  method: AuthMethod
  loading: boolean
  isPhraseDialog: boolean
  isAuthenticated: boolean
}

export const authStore = proxy<AuthStore>({
  seedPhrase: Array(SEED_PHRASE_LENGTH).fill(""),
  method: "qr",
  loading: false,
  isPhraseDialog: false,
  isAuthenticated: false
})

export const authActions = {
  setAuthMethod: (method: AuthMethod) => {
    authStore.method = method
  },
  setSeedPhrase: (seedPhrase: string[]) => {
    authStore.seedPhrase = seedPhrase
  },
  setSeedWord: (index: number, word: string) => {
    if (index < 0 || index >= SEED_PHRASE_LENGTH) return
    authStore.seedPhrase[index] = word
  },
  resetSeedPhrase: () => {
    authStore.seedPhrase = Array(SEED_PHRASE_LENGTH).fill("")
  },
  setLoading: (loading: boolean) => {
    authStore.loading = loading
  },
  setIsPhraseDialog: (isPhraseDialog: boolean) => {
    authStore.isPhraseDialog = isPhraseDialog
  },
  setIsAuthenticated: (isAuthenticated: boolean) => {
    authStore.isAuthenticated = isAuthenticated
  }
}

export const isSeedPhraseComplete = (seedPhrase: readonly string[]) =>
  seedPhrase.length === SEED_PHRASE_LENGTH &&
  seedPhrase.every((word) => word.trim().length > 0)