import SidebarHeader from "./header";
import { SidebarUserBottom } from "./user-bottom";

export function Sidebar() {
    return (
        <div className="flex flex-col w-full h-full">
            <SidebarHeader/>
            <div className="h-full" />
            <SidebarUserBottom/>
        </div>
    )
}