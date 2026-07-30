import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Gear from "@/assets/icons/lottie/gear.lottie"
import { type DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useState } from "react"

export const SIDEBAR_USER_BOTTOM_HEIGHT = 88

export function SidebarUserBottom() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  const handleLottieHover = () => {
    if (dotLottie) {
      dotLottie.setFrame(0)
      dotLottie.play()
    }
  }

  return (
    <div className="absolute bottom-0 flex w-full bg-linear-to-t from-background from-40% via-background/50 via-55% to-transparent to-100% p-4 pt-2">
      <div className="flex w-full rounded-2xl bg-secondary">
        <Button
          className="flex h-auto w-full flex-1 cursor-pointer justify-start gap-3 rounded-2xl border-0 bg-transparent p-3 will-change-transform"
          whileTap={{ scale: 0.985 }}
        >
          <Avatar className="size-10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Dikiy Dikiens"
            />
            <AvatarFallback className="text-base">DD</AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-start gap-1">
            <span className="text-base leading-4.75 font-semibold text-foreground">
              Dikiy Dikiens
            </span>

            <div className="flex items-center gap-1.5">
              <span className="flex size-3 items-center justify-center rounded-full bg-green-500/35">
                <span className="size-2 rounded-full bg-green-500" />
              </span>
              <span className="text-sm leading-4.25 font-medium text-green-500">
                Online
              </span>
            </div>
          </div>
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="size-16 rounded-2xl bg-transparent will-change-transform"
          aria-label="New chat"
          onMouseEnter={handleLottieHover}
        >
          <DotLottieReact
            src={Gear}
            speed={1.5}
            className="size-7 dark:invert"
            dotLottieRefCallback={setDotLottie}
          />
        </Button>
      </div>
    </div>
  )
}
