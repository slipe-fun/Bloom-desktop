import { ChatHeader } from "@/components/chats/main/chat/chat-header"
import { EASING } from "@/constants/animations-easing"
import { homeStore } from "@/store/home.store"
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio"
import { MainEmpty } from "./main-chat-window-empty"
import { ChatFooter } from "./chat/chat-footer"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"

export function MainChatWindow() {
  const { currentChat } = useSnapshot(homeStore)

  return (
    <div style={{ marginTop: TITLEBAR_HEIGHT }} className="size-full rounded-tl-[38px] overflow-hidden bg-secondary-background">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentChat ? "chat" : "empty"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={EASING.middleSpring}
          className="relative flex h-full w-full overflow-hidden items-center justify-center"
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
    </div>
  )
}
