import DashedBox from "@/components/ui/dashed-box"
import Key from "@/assets/icons/key.svg?react"
import { useSnapshot } from "valtio"
import { authStore } from "@/store/auth.store"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import { Spinner } from "@/components/ui/spinner"

export function AuthSignUpMethod() {
  const { loading } = useSnapshot(authStore)

  return (
    <>
      <DashedBox width={100} height={100} className="text-foreground/20">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={String(loading)}   
          initial={{ opacity: 0, scale: 0.5 }}     
          animate={{ opacity: 1, scale: 1 }}     
          exit={{ opacity: 0, scale: 0.0 }}
          transition={EASING.normalSpring}
        >
          {loading ? <Spinner className="size-10.5"/> : <Key className="h-17.5 w-17.5 text-foreground/20" />}
        </motion.div>
      </AnimatePresence>
      </DashedBox>
      <div className="flex max-w-100 flex-col items-center justify-center gap-2">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Sign up via pressing button
        </h2>

        <p className="text-center text-base font-medium text-foreground/40">
          Just click the button, and all the cryptographic magic will happen for
          you
        </p>
      </div>
    </>
  )
}
