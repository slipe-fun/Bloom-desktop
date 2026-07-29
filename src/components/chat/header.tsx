import { Button } from "@/components/ui/button"
import { homeActions } from "@/store/home.store"

export function ChatHeader() {
  return (
    <div className="absolute w-full pb-3 px-4 gap-4">
      <Button
        variant="secondary"
        size="icon"
        className="size-11 rounded-full"
        aria-label="New chat"
        onClick={() => homeActions.setCurrentChat("")}
      >
        <Pencil className="size-6.5" />
      </Button>
    </div>
  )
}
