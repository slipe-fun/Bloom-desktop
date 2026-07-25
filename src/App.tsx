import { Button } from "@/components/ui/button"
import { Titlebar } from "@/components/titlebar"
import { AnimatedQRCode } from "./components/auth/animated-qr-code"
import { motion } from "framer-motion"
import { EASING } from "./constants/animations-easing"

const MotionButton = motion(Button)

export function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Titlebar />
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
        <AnimatedQRCode />

        <div className="flex max-w-100 flex-col items-center justify-center gap-2">
          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              ...EASING.springyTimed,
              delay: 0.04,
            }}
            className="text-center text-2xl font-bold text-foreground"
          >
            Log in via QR Code
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              ...EASING.springyTimed,
              delay: 0.08,
            }}
            className="text-center text-base font-medium text-foreground/40"
          >
            The device used to log in must be running iOS, macOS, iPadOS, or
            visionOS.
          </motion.p>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            ...EASING.springyTimed,
            delay: 0.12,
          }}
        >
          <MotionButton
            variant="secondary"
            className="h-12 rounded-full px-6 text-base font-semibold will-change-transform"
            onClick={() => window.open("https://bloom.so", "_blank")}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in via Seed phrase
          </MotionButton>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            ...EASING.springyTimed,
            delay: 0.16,
          }}
          className="text-base font-medium text-foreground/40"
        >
          Don't have an account?{" "}
          <button className="font-semibold text-foreground hover:underline focus:underline focus:outline-none">
            Sign up
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default App
