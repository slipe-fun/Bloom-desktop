import { useRef, useState, useCallback } from "react"
import { Virtuoso } from "react-virtuoso"
import { Button } from "@/components/ui/button"
import { VirtuosoScrollArea } from "@/components/ui/scroll-area"
import { ChatsListRow } from "./chats-list-row"
import { useSnapshot } from "valtio"
import { homeStore } from "@/store/home.store"

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
]

export function ChatsList() {
  const { currentChat } = useSnapshot(homeStore)
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  const seenIds = useRef<Set<string>>(new Set(INITIAL_CHATS.map((c) => c.id)))

  const handleAddChat = useCallback(() => {
    const newId = Date.now().toString()
    setChats((prev) => [
      {
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
      },
      ...prev,
    ])
  }, [])

  const handleStartDelete = useCallback((id: string) => {
    setDeletingIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const handleFinishDelete = useCallback((id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id))
    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    seenIds.current.delete(id)
  }, [])

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
        <Virtuoso
          className="h-full"
          data={chats}
          components={{ Scroller: VirtuosoScrollArea }}
          computeItemKey={(_, chat) => chat.id}
          increaseViewportBy={{ top: 200, bottom: 200 }}
          itemContent={(index, chat) => (
            <ChatsListRow
              chat={chat}
              isSelected={currentChat === chat.id}
              isDeleting={deletingIds.has(chat.id)}
              seenIdsRef={seenIds}
              onFinishDelete={handleFinishDelete}
              isFirst={index === 0}
              isLast={index === chats.length - 1}
            />
          )}
        />
      </div>
    </div>
  )
}
