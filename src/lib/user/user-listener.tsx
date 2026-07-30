import { useEffect, useState } from "react"
import { listen } from "@tauri-apps/api/event"
import type { UserProfile } from "@/types/user"
import { globalActions } from "@/store/global.store"

export function useUserListener() {
  const [user, setUser] = useState<boolean>(false)

  useEffect(() => {
    let unlisten: (() => void) | undefined

    async function setupListener() {
      unlisten = await listen<string>("user-updated", (event) => {
        try {
          const rawJson = event.payload
          const user: UserProfile = JSON.parse(rawJson)

          setUser(!!user)
          globalActions.setUser(user)
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

  return { user }
}
