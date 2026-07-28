import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import { useSnapshot } from "valtio/react"
import {
  authStore,
  authActions,
  isSeedPhraseComplete,
  type AuthMethod,
} from "@/store/auth.store"
import { handleRegister } from "@/lib/auth/handle-register"
import { handleLogin } from "@/lib/auth/handle-login"

const BUTTON_LABELS: Record<AuthMethod, string> = {
  seed: "Log in via QR Code",
  qr: "Log in via Seed phrase",
  success: "Continue",
  signUp: "Sign Up",
}

export function AuthActions() {
  const { method: currentMethod, seedPhrase } = useSnapshot(authStore)

  const isSignUp = currentMethod === "signUp"
  const seedPhraseComplete = isSeedPhraseComplete(seedPhrase)
  const isPrimaryAction =
    isSignUp || currentMethod === "success" || seedPhraseComplete

  const handleMainAction = async () => {
    if (seedPhraseComplete) {
      authActions.setLoading(true)

      await handleLogin(seedPhrase).then(() => {
        authActions.setLoading(false)
        authActions.setAuthMethod("success")
      })
    } else {
      switch (currentMethod) {
        case "seed":
          authActions.setAuthMethod("qr")
          break
        case "qr":
          authActions.setAuthMethod("seed")
          break
        case "signUp":
          authActions.setLoading(true)

          await handleRegister().then(() => {
            authActions.setLoading(false)
            authActions.setAuthMethod("success")
          })
          break
        case "success":
          authActions.setIsPhraseDialog(true)
          break
      }
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
      <Button
        layout
        variant={isPrimaryAction ? "default" : "secondary"}
        className="h-12 overflow-hidden rounded-full px-6 text-base font-semibold will-change-transform"
        onClick={() => handleMainAction()}
        transition={{ ...EASING.normalSpring, scale: EASING.springy }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={seedPhraseComplete ? "seedAuth" : currentMethod}
            layout
            initial={{ opacity: 0, x: "40%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-40%" }}
            transition={EASING.normalSpring}
            className="inline-block whitespace-nowrap"
          >
            {seedPhraseComplete ? "Continue" : BUTTON_LABELS[currentMethod]}
          </motion.span>
        </AnimatePresence>
      </Button>

      <AnimatePresence mode="popLayout" initial={false}>
        {currentMethod !== "success" && (
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
        )}
      </AnimatePresence>
    </motion.div>
  )
}
