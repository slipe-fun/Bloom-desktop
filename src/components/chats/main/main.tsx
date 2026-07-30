import { ChatHeader } from "@/components/chats/main/chat/chat-header"
import { EASING } from "@/constants/animations-easing"
import { homeStore } from "@/store/home.store"
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio"
import { MainEmpty } from "./main-empty"
import { ChatFooter } from "./chat/chat-footer"

export function Main() {
  const { currentChat } = useSnapshot(homeStore)

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={currentChat ? "chat" : "empty"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={EASING.middleSpring}
        className="relative flex h-full w-full items-center justify-center"
      >
        {currentChat ? (
          <>
            <ChatHeader /> <ChatFooter />
          </>
        ) : (
          <MainEmpty />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
