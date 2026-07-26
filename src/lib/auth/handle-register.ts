import { invoke } from "@tauri-apps/api/core"
import { base64ToJson } from "@/lib/utils"
import { secureStorage } from "@/lib/secure-storage"
import { RECOVERY_KEY_STORAGE } from "@/constants/stores"

export const handleRegister = async () => {
  try {
    const res = await invoke("register_user") as string
    const parsedRes = JSON.parse(res)
    
    secureStorage.setItem(RECOVERY_KEY_STORAGE, parsedRes.RecoveryKey)
    console.log(base64ToJson(parsedRes.UserJSON))
  } catch (err) {
    console.error(err)
  }
}


