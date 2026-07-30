import { useSnapshot } from "valtio"
import { ChatsList } from "./chats-list"
import SidebarHeader from "./sidebar-header/sidebar-header"
import { SidebarUserBottom } from "./user-bottom"
import { homeStore } from "@/store/home.store"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import { SidebarSearchList } from "./search-list"

export function Sidebar() {
  const { isSearch } = useSnapshot(homeStore)

  return (
    <div className="relative flex h-full bg-background w-full flex-col overflow-hidden">
      <SidebarHeader />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={isSearch ? "search" : "chats"}
          initial={{ opacity: 0, x: "40%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-40%" }}
          transition={EASING.normalSpring}
          className="size-full"
        >
          {!isSearch ? <ChatsList /> : <SidebarSearchList/>}
        </motion.div>
      </AnimatePresence>
      <SidebarUserBottom />
    </div>
  )
}
