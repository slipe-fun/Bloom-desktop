import { AnimatedQRCode } from "@/components/auth/animated-qr-code"
import { motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const textItemVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: EASING.springyTimed,
  },
}

export function AuthQrMethod() {
  return (
    <>
      <AnimatedQRCode />

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex max-w-100 flex-col items-center justify-center gap-2"
      >
        <motion.h2
          variants={textItemVariants}
          className="text-center text-2xl font-bold text-foreground"
        >
          Log in via QR Code
        </motion.h2>
        
        <motion.p
          variants={textItemVariants}
          className="text-center text-base font-medium text-foreground/40"
        >
          The device used to log in must be running iOS, macOS, iPadOS, or
          visionOS.
        </motion.p>
      </motion.div>
    </>
  )
}