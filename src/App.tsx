import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"
import { Home } from "@/views/home"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useEffect } from "react"
import { useSnapshot } from "valtio"
import { authActions, authStore } from "@/store/auth.store"
import { useUserListener } from "./lib/user/user-listener"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "./constants/animations-easing"

export function App() {
  const { isAuthenticated } = useSnapshot(authStore)
  const { user } = useUserListener()

  useEffect(() => {
    authActions.setIsAuthenticated(user)
    getCurrentWindow().show()
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-secondary-background">
      <Titlebar />
      <AnimatePresence mode="popLayout" initial>
        <motion.main
          key={isAuthenticated ? "chats" : "auth"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={EASING.middleSpring}
          className="size-full"
        >
          {isAuthenticated ? <Home /> : <Auth />}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default App
