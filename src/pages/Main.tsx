import EmptyChatsSide from "../components/main/chat/EmptyChatsSide.tsx";
import NoSelectedChatContent from "../components/main/chat/NoSelectedChatContent.tsx";
import Navbar from "../components/ui/nav/Navbar.tsx";
import {useState} from "react";
import {ICONS} from "../constants/icons.ts";
import TopBar from "../components/main/chat/Topbar.tsx";

export function Main() {
  const [currentTab, setCurrentTab] = useState<keyof typeof ICONS>('person.circle');

  return (
    <div className="size-full flex justify-center items-center relative overflow-hidden">
      <aside className="w-96 h-full flex flex-col select-none">
        <div className="flex flex-col w-full h-full flex-1">
          <TopBar/>
          <section className="flex flex-1 w-full h-full overflow-y-auto justify-center items-center">
            <EmptyChatsSide/>
          </section>
        </div>
        <div className="p-xxl pt-lg">
          <Navbar activeTab={currentTab} onTabChange={setCurrentTab}/>
        </div>
      </aside>
      <main className="w-full h-full flex-1 bg-foreground-soft flex justify-center items-center">
        <NoSelectedChatContent/>
      </main>
    </div>
  );
}
