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
      className="h-screen w-screen overflow-hidden"
    >
      <ResizablePanel
        defaultSize={394}
        minSize={300}
        maxSize={500}
        groupResizeBehavior="preserve-pixel-size"
        className="h-screen"
      >
        <Sidebar/>
      </ResizablePanel>

      <ResizableHandle
        withHandle={false}
        className="transition-colors bg-foreground/10 hover:bg-foreground/20"
      />

      <ResizablePanel>
        <Main/>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}