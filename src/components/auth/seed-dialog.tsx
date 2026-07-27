import { EASING } from "@/constants/animations-easing"
import { authActions, authStore } from "@/store/auth.store"
import { motion } from "framer-motion"
import { useSnapshot } from "valtio/react"
import {
  CustomModal,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const MotionButton = motion.create(Button)

export function AuthSeedDialog() {
  const { seedPhraseDialog } = useSnapshot(authStore)

  return (
    <CustomModal
      className="w-108.5"
      open={seedPhraseDialog}
      onOpenChange={authActions.setSeedPhraseDialog}
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

      <div className="flex w-full gap-3 p-4 pt-3">
        <MotionButton
          variant="secondary"
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
          transition={EASING.springy}
          whileTap={{ scale: 0.95 }}
        >
          Save as file
        </MotionButton>

        <MotionButton
          variant="default"
          className="h-12 flex-1 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
          transition={EASING.springy}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </MotionButton>
      </div>
    </CustomModal>
  )
}
