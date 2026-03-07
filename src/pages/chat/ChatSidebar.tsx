import ChatTopbar from "../../components/main/chat/ChatTopbar.tsx";
import EmptyChatsSide from "../../components/main/chat/EmptyChatsSide.tsx";

export default function ChatSidebar() {
  return (
    <div className="flex flex-col w-full h-full flex-1">
      <ChatTopbar/>
      <section className="flex flex-1 w-full h-full overflow-y-auto justify-center items-center">
        <EmptyChatsSide/>
      </section>
    </div>
  )
}
