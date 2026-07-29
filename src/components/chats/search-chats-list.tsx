import { useCallback, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { Button } from "@/components/ui/button"
import { VirtuosoScrollArea } from "@/components/ui/scroll-area"
import { SearchChatsListRow } from "./search-chats-list-row"
import { cn } from "@/lib/utils"
import { SIDEBAR_USER_BOTTOM_HEIGHT } from "./sidebar/user-bottom"

export interface Chat {
  id: string
  name: string
  username: string
  avatar?: string
  avatarFallback?: string
}

interface SearchChatsListProps {
  className?: string
  isDialog: boolean
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    name: "David Lee",
    username: "@david",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
]

export function SearchChatsList({ className, isDialog }: SearchChatsListProps) {
  const [chats, setChats] = useState(INITIAL_CHATS)

  const handleAddChat = useCallback(() => {
    setChats((prev) => [
      {
        id: Date.now().toString(),
        name: "Alex Rivera",
        username: "@alex",
        avatarFallback: "AR",
      },
      ...prev,
    ])
  }, [])

  const handleDeleteFirst = useCallback(() => {
    setChats((prev) => prev.slice(1))
  }, [])

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex justify-between gap-2 border-b border-foreground/10 p-3">
        <Button size="sm" onClick={handleAddChat}>
          + Добавить чат
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={handleDeleteFirst}
          disabled={!chats.length}
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
            <SearchChatsListRow
              chat={chat}
              isFirst={index === 0}
              paddingBottom={index === chats.length - 1 ? (isDialog ? 8 : SIDEBAR_USER_BOTTOM_HEIGHT) : 0}
            />
          )}
        />
      </div>
    </div>
  )
}
