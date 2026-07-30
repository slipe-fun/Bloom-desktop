import { useState } from "react"
import { motion } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import type { DotLottie } from "@lottiefiles/dotlottie-react"
import Dots from "@/assets/icons/lottie/dots.lottie"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { homeActions } from "@/store/home.store"
import ChevronLeft from "@/assets/icons/chevron.left.svg?react"
import { EASING } from "@/constants/animations-easing"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"

export function ChatHeader() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  const handleLottieHover = () => {
    if (dotLottie) {
      dotLottie.setFrame(0)
      dotLottie.play()
    }
  }

  return (
    <div
      style={{ paddingTop: TITLEBAR_HEIGHT }}
      className="absolute top-0 left-0 z-10 flex w-full items-center justify-between border-b border-foreground/10 bg-background px-4 pb-3"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="icon"
          className="size-11 shrink-0 rounded-full"
          aria-label="Back"
          initial="rest"
          whileHover="hover"
          variants={{
            rest: {},
            hover: {},
          }}
          onClick={() => homeActions.setCurrentChat("")}
        >
          <motion.div
            variants={{
              rest: { x: 0 },
              hover: { x: -2.5 },
            }}
            transition={EASING.springy}
          >
            <ChevronLeft
              className="pointer-events-none size-6.5 text-foreground"
              aria-hidden="true"
            />
          </motion.div>
        </Button>

        <div className="flex items-center gap-4">
          <Avatar className="size-11">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Dikiy Dikiens"
            />
            <AvatarFallback className="text-base">DD</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <span className="text-base leading-4.75 font-semibold text-foreground">
              Dikiy Super
            </span>
            <span className="text-sm leading-4.25 font-medium text-foreground/40">
              Last seen recently
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="size-11 shrink-0 rounded-full"
        aria-label="Options"
        onMouseEnter={handleLottieHover}
      >
        <DotLottieReact
          src={Dots}
          speed={1.5}
          className="size-6.5 dark:invert"
          dotLottieRefCallback={setDotLottie}
        />
      </Button>
    </div>
  )
}
