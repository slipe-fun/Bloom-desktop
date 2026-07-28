import { authActions, authStore } from "@/store/auth.store"
import { useSnapshot } from "valtio/react"
import {
  CustomModal,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SeedPhraseInput } from "./seed-phrase-input"

export function AuthSeedDialog() {
  const { isPhraseDialog } = useSnapshot(authStore)

  return (
    <CustomModal
      className="w-108.5"
      open={isPhraseDialog}
      onOpenChange={authActions.setIsPhraseDialog}
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4 pb-3">
        <ModalTitle className="text-2xl font-semibold text-popover-foreground">
          Your seed phrase
        </ModalTitle>
        <ModalDescription className="text-center text-base font-medium text-popover-foreground/40">
          Save it and keep in mind, it will be used for login if you lost all
          your devices
        </ModalDescription>
      </div>

      <div className="w-full p-4">
        <SeedPhraseInput readOnly/>
      </div>

      <div className="flex w-full gap-3 p-4 pt-3">
        <Button
          variant="secondary"
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
        >
          Save as file
        </Button>

        <Button
          variant="default"
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
        >
          Continue
        </Button>
      </div>
    </CustomModal>
  )
}
