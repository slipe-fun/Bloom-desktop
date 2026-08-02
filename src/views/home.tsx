import { MainChatWindow } from "@/components/chats/main/main-chat-window"
import { NavigationSidebar } from "@/components/chats/navigation-sidebar/navigation-sidebar"
import { MainNewChatDialog } from "@/components/chats/new-chat-dialog/new-chat-dialog"
import { Sidebar } from "@/components/chats/sidebar/sidebar"
export function Home() {
  return (
    <section className="w-screen h-screen overflow-hidden flex">
      <NavigationSidebar/>
      <Sidebar />
      <MainChatWindow />

      <MainNewChatDialog/>
    </section>
  )
}
