import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react"
import { Virtuoso } from "react-virtuoso"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EASING } from "@/constants/animations-easing"
import { VirtuosoScrollArea } from "@/components/ui/scroll-area"

export interface Chat {
  id: string
  name: string
  message: string
  time: string
  avatar?: string
  avatarFallback?: string
  unreadCount?: number
  unreadBadgeColor?: "dark" | "blue"
  isSelected?: boolean
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    name: "David Lee",
    message: "Great work on the project!",
    time: "05:00",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    isSelected: true,
  },
  {
    id: "2",
    name: "Maria Gomez",
    message: "Looking forward to our next meeting.",
    time: "06:15",
    unreadCount: 5,
    unreadBadgeColor: "dark",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Chen Wu",
    message: "Please review the latest draft.",
    time: "07:30",
    unreadCount: 2,
    unreadBadgeColor: "blue",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "Damir Salamon",
    message: "Can we adjust the timeline?",
    time: "08:45",
    avatarFallback: "DS",
  },
  {
    id: "5",
    name: "Isabella Martinez",
    message: "The data visualization was very cle...",
    time: "12:40",
    unreadCount: 6,
    unreadBadgeColor: "blue",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  },
]

const ScrollingContext = createContext(false)

export function AnimatedChatList() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [isScrolling, setIsScrolling] = useState(false)

  const seenIds = useRef<Set<string>>(new Set(INITIAL_CHATS.map((c) => c.id)))

  const handleAddChat = () => {
    const newId = Date.now().toString()
    const newChat: Chat = {
      id: newId,
      name: "Alex Rivera",
      message: "Hey! New message arrived just now.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unreadCount: 1,
      unreadBadgeColor: "blue",
      avatarFallback: "AR",
    }
    setChats((prev) => [newChat, ...prev])
  }

  const handleStartDelete = (id: string) => {
    setDeletingIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const handleFinishDelete = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id))
    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const firstAvailableChat = chats.find((c) => !deletingIds.has(c.id))

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex justify-between gap-2 border-b border-foreground/10 p-3">
        <Button size="sm" onClick={handleAddChat}>
          + Добавить чат
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            firstAvailableChat && handleStartDelete(firstAvailableChat.id)
          }
          disabled={!firstAvailableChat}
        >
          Удалить первый
        </Button>
      </div>

      <div className="flex-1">
        <ScrollingContext.Provider value={isScrolling}>
          <Virtuoso
            className="h-full"
            data={chats}
            components={{
              Scroller: VirtuosoScrollArea,
            }}
            computeItemKey={(_, chat) => chat.id}
            isScrolling={setIsScrolling}
            increaseViewportBy={{ top: 200, bottom: 200 }}
            itemContent={(_, chat) => (
              <ChatItemRow
                chat={chat}
                isDeleting={deletingIds.has(chat.id)}
                seenIdsRef={seenIds}
                onFinishDelete={() => handleFinishDelete(chat.id)}
              />
            )}
          />
        </ScrollingContext.Provider>
      </div>
    </div>
  )
}

function ChatItemRow({
  chat,
  isDeleting,
  seenIdsRef,
  onFinishDelete,
}: {
  chat: Chat
  isDeleting: boolean
  seenIdsRef: React.RefObject<Set<string>>
  onFinishDelete: () => void
}) {
  const isScrolling = useContext(ScrollingContext)
  const easing = isScrolling ? undefined : EASING.middleSpring

  const [playEnterAnimation] = useState(() => !seenIdsRef.current.has(chat.id))

  useEffect(() => {
    if (playEnterAnimation) {
      seenIdsRef.current.add(chat.id)
    }
  }, [chat.id, playEnterAnimation, seenIdsRef])

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
      transition={easing}
      onAnimationComplete={() => {
        if (isDeleting) onFinishDelete()
      }}
      whileTap={{ scale: 0.985 }}
      className='overflow-hidden px-2'
    >
        <div className={` flex w-full gap-0 rounded-2xl cursor-pointer border-0 p-0 transition-colors hover:bg-secondary ${
          chat.isSelected ? "bg-secondary" : "bg-transparent"
        }`}>
        <Avatar className="m-3 size-12.5">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="text-xl">
            {chat.avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 min-w-0 flex-col justify-center gap-1.5 pr-3">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="truncate text-base leading-4.75 font-semibold text-foreground">
              {chat.name}
            </h4>
            <div className="flex shrink-0 items-center gap-1 text-foreground/40">
              <span className="text-sm leading-4.25 font-medium">
                {chat.time}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] leading-snug text-foreground/40">
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
}
