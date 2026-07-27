import { SeedPhraseInput } from "@/components/auth/seed-phrase-input"
import { motion } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import { authStore } from "@/store/auth.store"
import { useSnapshot } from "valtio"
import { EASING } from "@/constants/animations-easing"

export function AuthSeedMethod() {
  const { loading } = useSnapshot(authStore)

  return (
    <>
      <div className="flex max-w-100 flex-col items-center justify-center gap-2">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Log in via Seed phrase
        </h2>

        <p className="text-center text-base font-medium text-foreground/40">
          Enter your 12-word seed phrase, or drag and drop a file with seed
          phrase
        </p>
      </div>

      <div className="relative">
        <SeedPhraseInput />
         <motion.div
          data-disabled={!loading}
          className="absolute flex top-0 w-full data-disabled:pointer-events-none h-full items-center justify-center"
          transition={EASING.normalSpring}
          animate={{
            opacity: loading ? 1 : 0,
          }}
        >
          <Spinner className="size-10.5" />
        </motion.div>
      </div>
    </>
  )
}
