import { memo } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { homeActions } from "@/store/home.store"
import { type Chat } from "./search-chats-list"

import ChevronRight from "@/assets/icons/chevron.right.svg?react"

export const SearchChatsListRow = memo(function SearchChatsListRow({
  chat,
  isFirst,
  paddingBottom,
}: {
  chat: Chat
  isFirst: boolean
  paddingBottom: number
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={() => homeActions.setCurrentChat(chat.id)}
      style={paddingBottom ? { paddingBottom } : undefined}
      className={`px-2 ${isFirst ? "pt-2" : ""}`}
    >
      <div className="flex w-full cursor-pointer rounded-2xl transition-colors hover:bg-secondary">
        <Avatar className="m-3 size-11">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="text-lg">
            {chat.avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 pr-3">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="truncate text-base leading-4.75 font-semibold text-foreground">
              {chat.name}
            </h4>
            <ChevronRight className="size-4 text-foreground/40" />
          </div>

          <p className="truncate text-sm leading-4.25 font-medium text-foreground/40">
            {chat.username}
          </p>
        </div>
      </div>
    </motion.div>
  )
})
