import { AnimatedChatList } from "./chats-list";
import SidebarHeader from "./header";
import { SidebarUserBottom } from "./user-bottom";

export function Sidebar() {
    return (
        <div className="flex flex-col w-full h-full relative">
            <SidebarHeader/>
            <AnimatedChatList/>
            <SidebarUserBottom/>
        </div>
    )
}