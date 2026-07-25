import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import { useSnapshot } from "valtio/react"
import { authStore, authActions } from "@/store/auth.store"
import { cn } from "@/lib/utils"

const MotionButton = motion(Button)

type AuthMethod = "seed" | "qr" | "success" | "signUp"

const BUTTON_LABELS: Record<AuthMethod, string> = {
  seed: "Log in via QR Code",
  qr: "Log in via Seed phrase",
  success: "Continue to chats",
  signUp: "Sign Up",
}

export function AuthActions() {
  const { method: currentMethod } = useSnapshot(authStore)

  const isSignUp = currentMethod === "signUp"
  const isPrimaryAction = isSignUp || currentMethod === "success"

  const handleMainAction = () => {
    switch (currentMethod) {
      case "seed":
        authActions.setAuthMethod("qr")
        break
      case "qr":
        authActions.setAuthMethod("seed")
        break
      case "signUp":
        console.log("Submit Sign Up")
        break
      case "success":
        console.log("Navigate to chats")
        break
    }
  }

  const handleFooterToggle = () => {
    authActions.setAuthMethod(isSignUp ? "qr" : "signUp")
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        ...EASING.springyTimed,
        delay: 0.12,
      }}
      className="flex flex-col items-center gap-4"
    >
      <MotionButton
        layout
        variant={isPrimaryAction ? "default" : "secondary"}
        className={cn(
          "h-12 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform",
          isPrimaryAction
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
        onClick={handleMainAction}
        transition={{ ...EASING.normalSpring, scale: EASING.springy }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={currentMethod}
            layout
            initial={{ opacity: 0, x: "40%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-40%" }}
            transition={EASING.normalSpring}
            className="inline-block whitespace-nowrap"
          >
            {BUTTON_LABELS[currentMethod] || ""}
          </motion.span>
        </AnimatePresence>
      </MotionButton>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={isSignUp ? "signUp" : "login"}
          layout
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-50%" }}
          transition={EASING.normalSpring}
          className="inline-flex items-center justify-center gap-1 text-base font-medium whitespace-nowrap text-foreground/40"
        >
          <span>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            onClick={handleFooterToggle}
            className="font-semibold text-foreground hover:underline focus:underline focus:outline-none"
          >
            {isSignUp ? "Log in" : "Sign Up"}
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
