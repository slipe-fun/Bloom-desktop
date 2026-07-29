import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"
import { Home } from "@/views/home"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useEffect } from "react"
import { useSnapshot } from "valtio"
import { authStore } from "@/store/auth.store"
import { invoke } from "@tauri-apps/api/core"
import { useUserListener } from "./lib/user/user-listener"

export function App() {
  const { isAuthenticated } = useSnapshot(authStore)
  useUserListener()

  useEffect(() => {
    // getCurrentWindow().show()
      (async () => {
      try {
        const me = (await invoke("getMe")) as string

        console.log(123123)
      } catch (err) {
        console.error(err)
      }
      })()
  }, [])

  return (
    <div className="flex min-h-svh bg-secondary-background flex-col">
      <Titlebar />
      {/* <Auth /> */}
      <Home />
    </div>
  )
}

export default App
