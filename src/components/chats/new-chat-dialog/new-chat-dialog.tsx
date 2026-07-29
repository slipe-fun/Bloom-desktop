import { useSnapshot } from "valtio/react"
import {
  CustomModal,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/dialog"
import { homeActions, homeStore } from "@/store/home.store"
import { SearchChatsList } from "../search-chats-list"

export function MainNewChatDialog() {
  const { isNewChatDialog } = useSnapshot(homeStore)

  return (
    <CustomModal
      className="w-108.5"
      open={isNewChatDialog}
      onOpenChange={homeActions.setIsNewChatDialog}
    >
      <div className="flex w-full flex-col gap-2 p-5 pb-4 border-b border-foreground/10">
        <ModalTitle className="text-xl font-bold text-popover-foreground">
          New chat
        </ModalTitle>
        <ModalDescription className="text-base font-medium text-popover-foreground/40">
          Create a new chat with user from list below
        </ModalDescription>
      </div>

      <SearchChatsList className="h-119.5" isDialog/>
    </CustomModal>
  )
}
