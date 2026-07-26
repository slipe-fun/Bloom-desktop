import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import Flame from "@/assets/icons/flame.svg?react"
import Lightbolt from "@/assets/icons/lightbolt.svg?react"
import { EASING } from "@/constants/animations-easing"

const MotionFlame = motion.create(Flame)
const MotionLightbolt = motion.create(Lightbolt)

export function AuthSuccessMethod() {
  return (
    <>
      <div className="relative flex size-35">
        <MotionFlame
          initial={{
            opacity: 0,
            scale: 0.5,
            filter: "blur(2px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(1px)",
          }}
          transition={EASING.springyTimed}
          className="absolute bottom-0 h-22 w-22 -translate-x-7.5 translate-y-3.5 -rotate-19 text-orange-500"
        />
        <MotionLightbolt
          initial={{
            opacity: 0,
            scale: 0.5,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(2px)",
          }}
          transition={{
            ...EASING.springyTimed,
            delay: 0.05,
          }}
          className="absolute top-0 right-0 h-20.5 w-20.5 translate-x-3 -translate-y-6.25 rotate-19 text-blue-500"
        />
        <Avatar className="size-35">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Dikiy Dikiens"
          />
          <AvatarFallback className="text-4xl">DD</AvatarFallback>
        </Avatar>
      </div>

      <p className="text-2xl font-bold text-foreground/40">
        Welcome <span className="text-foreground">Dikiy Dikiens</span>
      </p>
    </>
  )
}
