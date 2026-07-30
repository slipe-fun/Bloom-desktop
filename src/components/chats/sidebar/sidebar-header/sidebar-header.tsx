import Message from "@/assets/icons/message.svg?react"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"
import { HeaderSearchInput } from "./header-search-input"
import { HeaderNewChatButton } from "./header-new-chat-button"

export default function SidebarHeader() {
  return (
    <header
      style={{ paddingTop: TITLEBAR_HEIGHT }}
      className="flex w-full flex-col gap-4 border-b border-foreground/10 p-4 pb-3 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full cursor-default items-center gap-1.5">
          <Message className="size-7.5 text-foreground/40" />
          <span className="text-2xl font-bold tracking-tight">Chats</span>
        </div>

        <HeaderNewChatButton />
      </div>

      <HeaderSearchInput />
    </header>
  )
}