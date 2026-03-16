import {useCallback, useEffect, useState} from "react";
import ChatSidebar from "../pages/chat/ChatSidebar.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Navbar from "../components/ui/nav/Navbar.tsx";
import NothingThere from "../pages/NothingThere.tsx";
import NoSelectedChatContent from "../pages/chat/NoSelectedChatContent.tsx";
import ChatPage from "../pages/chat/ChatPage.tsx";

const MIN_SIDEBAR_WIDTH = 250;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 384;

export function MainLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;

        const constrainedWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth));
        setSidebarWidth(constrainedWidth);
      }
    }, [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      className={`size-full flex relative overflow-hidden bg-background text-text-main ${isResizing ? "select-none cursor-col-resize" : ""}`}>
      <aside
        className="h-full flex flex-col select-none"
        style={{width: sidebarWidth}}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="chats/*" element={<ChatSidebar/>}/>
            <Route path="settings/*" element={<NothingThere/>}/>
            <Route path="discover/*" element={<NothingThere/>}/>
            <Route path="profile/*" element={<NothingThere/>}/>
            <Route path="*" element={<Navigate to="chats" replace/>}/>
          </Routes>
        </div>
        <div className="p-xxl pt-lg">
          <Navbar/>
        </div>
      </aside>

      <div
        onMouseDown={startResizing}
        className="w-1 -ml-[3px] h-full cursor-col-resize z-10 bg-transparent active:bg-primary transition-colors shrink-0"
      />

      <main
        className={`h-full flex-1 bg-foreground-soft flex flex-col relative min-w-[300px] ${isResizing ? "pointer-events-none" : ""}`}>
        <Routes>
          <Route path="chats">
            <Route index element={<NoSelectedChatContent/>}/>
            <Route path=":id" element={<ChatPage/>}/>
          </Route>

          <Route path="settings/*" element={<NothingThere/>}/>
          <Route path="discover/*" element={<NothingThere/>}/>
          <Route path="profile/*" element={<NothingThere/>}/>

          <Route path="*" element={<Navigate to="chats" replace/>}/>
        </Routes>
      </main>
    </div>
  );
}
