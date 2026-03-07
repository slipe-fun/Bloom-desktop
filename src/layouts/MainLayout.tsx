import NoSelectedChatContent from "../components/main/chat/NoSelectedChatContent.tsx";
import Navbar from "../components/ui/nav/Navbar.tsx";
import {useState} from "react";
import {ICONS} from "../constants/icons.ts";
import ChatSidebar from "../components/main/chat/ChatSidebar.tsx";

export function MainLayout() {
  const [currentTab, setCurrentTab] = useState<keyof typeof ICONS>('person.circle');

  return (
    <div className="size-full flex justify-center items-center relative overflow-hidden">
      <aside className="w-96 h-full flex flex-col select-none">
        <ChatSidebar/> {/* this will changes by page (?) */}
        <div className="p-xxl pt-lg">
          <Navbar activeTab={currentTab} onTabChange={setCurrentTab}/>
        </div>
      </aside>
      <main className="w-full h-full flex-1 bg-foreground-soft flex justify-center items-center">
        <NoSelectedChatContent/> {/* this will changes by page (?) */}
      </main>
    </div>
  );
}
