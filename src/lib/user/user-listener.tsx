import { useEffect } from "react"
import { listen } from "@tauri-apps/api/event"
import type { UserProfile } from "@/types/user"

export function useUserListener() {
  useEffect(() => {
    let unlisten: (() => void) | undefined

    async function setupListener() {
      unlisten = await listen<string>("user-updated", (event) => {
        try {
          const rawJson = event.payload
          const user: UserProfile = JSON.parse(rawJson)

          console.log(user)
        } catch (error) {
          console.error(error)
        }
      })
    }

    setupListener()

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [])
}
