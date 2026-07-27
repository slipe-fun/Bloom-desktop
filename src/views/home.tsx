import { Main } from "@/components/chats/main/main"
import { Sidebar } from "@/components/chats/sidebar/sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function Home() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="persistence-chat-layout"
      className="h-screen w-screen overflow-hidden"
    >
      <ResizablePanel
        defaultSize={380}
        minSize={280}
        maxSize={480}
        className="h-screen"
      >
        <Sidebar/>
      </ResizablePanel>

      <ResizableHandle
        withHandle={false}
        className="transition-colors bg-foreground/10 hover:bg-foreground/20"
      />

      <ResizablePanel defaultSize={500}>
        <Main/>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
