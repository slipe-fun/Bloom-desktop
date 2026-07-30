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

  const confirmAuth = () => {
    authActions.setIsPhraseDialog(false)
    authActions.setIsAuthenticated(true)
  }

  return (
    <CustomModal
      className="w-108.5"
      open={isPhraseDialog}
      onOpenChange={authActions.setIsPhraseDialog}
    >
      <div className="flex w-full flex-col gap-2 p-5 pb-4 border-b border-foreground/10">
        <ModalTitle className="text-xl font-bold text-popover-foreground">
          Your seed phrase
        </ModalTitle>
        <ModalDescription className="text-base font-medium text-popover-foreground/40">
          Save it and keep in mind, it will be used for login if you lost all
          your devices
        </ModalDescription>
      </div>

      <div className="w-full p-4">
        <SeedPhraseInput readOnly/>
      </div>

      <div className="flex w-full gap-3 p-4 pt-3 border-t border-foreground/10">
        <Button
          variant="secondary"
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
        >
          Save as file
        </Button>

        <Button
          variant="default"
          onClick={confirmAuth}
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
        >
          Continue
        </Button>
      </div>
    </CustomModal>
  )
}
