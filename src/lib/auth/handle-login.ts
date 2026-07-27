import { invoke } from "@tauri-apps/api/core"
import { secureStorage } from "@/lib/secure-storage"
import { RECOVERY_KEY_STORAGE } from "@/constants/stores"
import { bytesToHex } from "../utils"

export const handleLogin = async (phrase: readonly string[]) => {
  try {
    const bytes = await invoke<Uint8Array<ArrayBufferLike>>(
      "restore_mnemonic",
      {
        phrase: phrase.join(" "),
      }
    )

    const key = bytesToHex(bytes)

    await invoke("login_user", {
      recoveryKey: key
    })

    secureStorage.setItem(RECOVERY_KEY_STORAGE, key)
  } catch (err) {
    console.error(err)
  }
}
