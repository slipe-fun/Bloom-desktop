import { useState, useEffect, memo } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EASING } from "@/constants/animations-easing"
import { type Chat } from "./chats-list"
import { SIDEBAR_USER_BOTTOM_HEIGHT } from "./user-bottom"
import { homeActions } from "@/store/home.store"
import ChevronRight from "@/assets/icons/chevron.right.svg?react"

export const ChatsListRow = memo(function ChatsListRow({
  chat,
  isDeleting,
  seenIdsRef,
  onFinishDelete,
  isFirst,
  isLast,
  isSelected,
}: {
  chat: Chat
  isDeleting: boolean
  seenIdsRef: React.RefObject<Set<string>>
  onFinishDelete: (id: string) => void
  isFirst: boolean
  isLast: boolean
  isSelected: boolean
}) {
  const [playEnterAnimation] = useState(() => !seenIdsRef.current?.has(chat.id))

  useEffect(() => {
    if (playEnterAnimation) {
      seenIdsRef.current?.add(chat.id)
    }
  }, [chat.id, playEnterAnimation, seenIdsRef])

  const selectChat = () => {
    homeActions.setCurrentChat(chat.id)
  }
  return (
    <motion.div
      initial={
        playEnterAnimation ? { height: 0, opacity: 0, scale: 0.85 } : false
      }
      animate={
        isDeleting
          ? { height: 0, opacity: 0, scale: 0.85 }
          : { height: "auto", opacity: 1, scale: 1 }
      }
      transition={EASING.middleSpring}
      onAnimationComplete={() => {
        if (isDeleting) onFinishDelete(chat.id)
      }}
      whileTap={{ scale: 0.985 }}
      onClick={selectChat}
      style={isLast ? { paddingBottom: SIDEBAR_USER_BOTTOM_HEIGHT } : undefined}
      className={`overflow-hidden px-2 will-change-transform ${isFirst ? "pt-2" : ""}`}
    >
      <div
        className={`flex w-full cursor-pointer rounded-2xl transition-colors hover:bg-secondary ${
          isSelected ? "bg-secondary" : ""
        }`}
      >
        <Avatar className="m-3 size-12.5">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="text-xl">
            {chat.avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 pr-3">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="truncate text-base leading-4.75 font-semibold text-foreground">
              {chat.name}
            </h4>
            <div className="flex shrink-0 items-center gap-1 text-foreground/40">
              <span className="text-sm leading-4.25 font-medium">
                {chat.time}
              </span>
              <ChevronRight className="size-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm leading-4.25 text-foreground/40">
              {chat.message}
            </p>

            {chat.unreadCount && (
              <span
                className={`flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-xs font-semibold ${
                  chat.unreadBadgeColor === "blue"
                    ? "bg-primary text-white"
                    : "bg-foreground/10 text-foreground"
                }`}
              >
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})
