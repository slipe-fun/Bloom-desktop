import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"
import { Home } from "@/views/home"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useEffect } from "react"
import { useSnapshot } from "valtio"
import { authActions, authStore } from "@/store/auth.store"
import { useUserListener } from "./hooks/use-user-listener"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "./constants/animations-easing"
import { titlebarActions } from "./store/titlebar.store"

export function App() {
  const { isAuthenticated, method } = useSnapshot(authStore)
  const { user, isLoading } = useUserListener()

  useEffect(() => {
    if (method === "qr") {
      authActions.setIsAuthenticated(!!user)
    }
  }, [user])

  useEffect(() => {
    if (!isLoading) {
      getCurrentWindow().show()
    }
  }, [isLoading])

  useEffect(() => {
    titlebarActions.push({
      title: isAuthenticated ? "Chats" : "Log in",
      subtitle: isAuthenticated ? undefined : "QR Code",
      icon: isAuthenticated ? "message" : "person"
    })
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col bg-secondary-background">
        <Titlebar />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-secondary-background">
      <Titlebar />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={isAuthenticated ? "chats" : "auth"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={EASING.middleSpring}
          className="size-full"
        >
          <AnimatePresence initial>
            {isAuthenticated ? <Home /> : <Auth />}
          </AnimatePresence>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default App
