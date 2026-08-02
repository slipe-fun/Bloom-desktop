import { authActions, authStore } from "@/store/auth.store"
import { useSnapshot } from "valtio/react"
import { CustomModal, ModalTitle, ModalClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SeedPhraseInput } from "./seed-phrase-input"
import X from "@/assets/icons/x.svg?react"

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
      <div className="flex w-full gap-2 items-center p-4 pb-3">
        <ModalTitle className="w-full text-xl font-bold text-popover-foreground">
          Your seed phrase
        </ModalTitle>
        <ModalClose render={<Button variant="secondary" className="shadow-none size-8 p-0 bg-popover-secondary" />}>
          <X className="size-4.5 text-popover-foreground hover:opacity-50" />
        </ModalClose>
      </div>

      <div className="w-full p-4 py-3">
        <SeedPhraseInput readOnly />
      </div>

      <div className="flex w-full gap-3 p-4 pt-3">
        <Button
          variant="secondary"
          className="h-12 flex-1 overflow-hidden rounded-full bg-popover-secondary px-6 text-base font-semibold will-change-transform shadow-none"
        >
          Save as file
        </Button>

        <Button
          variant="default"
          onClick={confirmAuth}
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform shadow-none"
        >
          Continue
        </Button>
      </div>
    </CustomModal>
  )
}
