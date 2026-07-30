import { useEffect, useState } from "react"
import { listen, type UnlistenFn } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/core"
import type { UserProfile } from "@/types/user"
import { globalActions } from "@/store/global.store"

export function useUserListener() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    let unlisten: UnlistenFn | undefined
    let isMounted = true

    function applyUser(next: UserProfile) {
      if (!isMounted) return
      setUser(next)
      globalActions.setUser(next)
    }

    async function init() {
      try {
        unlisten = await listen<string>("user-updated", (event) => {
          try {
            applyUser(JSON.parse(event.payload))
          } catch (err) {
            console.error("Failed to parse 'user-updated' payload:", err)
          }
        })
      } catch (err) {
        console.error("Failed to register Tauri listener:", err)
      }

      try {
        const response = await invoke<string>("getOrFetchMe")
        const initialUser = JSON.parse(response)
        if (initialUser) applyUser(initialUser)
      } catch (err) {
        console.error("Failed to invoke 'getOrFetchMe':", err)
      }
    }

    init()

    return () => {
      isMounted = false
      unlisten?.()
    }
  }, [])

  return { user }
}