import { AuthActions } from "@/components/auth/actions"
import { AuthQrMethod } from "@/components/auth/qr-method"
import { AuthSeedMethod } from "@/components/auth/seed-method"
import { AuthSignUpMethod } from "@/components/auth/sign-up-method"
import { AuthSuccessMethod } from "@/components/auth/success-method"
import { EASING } from "@/constants/animations-easing"
import { authStore } from "@/store/auth.store"
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio/react"
import { AuthSeedDialog } from "@/components/auth/seed-dialog"

export function Auth() {
  const { method } = useSnapshot(authStore)

  const renderMethod = () => {
    switch (method) {
      case "qr":
        return <AuthQrMethod />
      case "seed":
        return <AuthSeedMethod />
      case "signUp":
        return <AuthSignUpMethod />
      case "success":
        return <AuthSuccessMethod />
      default:
        return null
    }
  }

  return (
    <section className="flex h-screen bg-background w-screen flex-col items-center justify-center gap-6">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={method}
          layout
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-50%" }}
          transition={EASING.normalSpring}
          className="flex flex-col items-center justify-center gap-6"
        >
          <AnimatePresence initial={true}>{renderMethod()}</AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <AuthActions />

      <AuthSeedDialog/>
    </section>
  )
}
