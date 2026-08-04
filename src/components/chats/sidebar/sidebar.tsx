import { useSnapshot } from "valtio"
import { ChatsList } from "./chats-list"
import SidebarHeader from "./sidebar-header/sidebar-header"
import { homeStore } from "@/store/home.store"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import { SidebarSearchList } from "./search-list"

export function Sidebar() {
  const { isSearch } = useSnapshot(homeStore)

  return (
    <aside className="relative flex h-full w-94 min-w-94 flex-col overflow-hidden">
      <SidebarHeader />
      <div className="size-full relative overflow-visible">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={isSearch ? "search" : "chats"}
            initial={{ opacity: 0, x: "40%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-40%" }}
            transition={EASING.normalSpring}
            className="size-full"
          >
            {!isSearch ? <ChatsList /> : <SidebarSearchList />}
          </motion.div>
        </AnimatePresence>

        { /* Horizontal gradients */}
        <div className="bg-linear-to-r from-background to-transparent top-0 h-full w-4 absolute"/>
        <div className="bg-linear-to-l from-background to-transparent top-0 right-0 h-full w-4 absolute"/>

        { /* Vertical gradients */}
        <div className="bg-linear-to-t from-background to-transparent bottom-0 h-4 w-full absolute"/>
      </div>
    </aside>
  )
}
