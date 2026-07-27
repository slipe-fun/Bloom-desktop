import { invoke } from "@tauri-apps/api/core"
import { secureStorage } from "@/lib/secure-storage"
import { RECOVERY_KEY_STORAGE } from "@/constants/stores"
import { authActions } from "@/store/auth.store"
import { hexToBytes } from "../utils"

export const handleRegister = async () => {
  try {
    const res = await invoke("register_user") as string
    const parsedRes = JSON.parse(res)
    
    secureStorage.setItem(RECOVERY_KEY_STORAGE, parsedRes.raw_recovery_key)

    const phrase = await invoke<string>('gen_mnemonic', { 
      key: Array.from(hexToBytes(parsedRes.raw_recovery_key))
    })
    
    authActions.setSeedPhrase(phrase.split(' '))
  } catch (err) {
    console.error(err)
  }
}

