import { useState } from "react"
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react"
import Pencil from "@/assets/icons/lottie/pencil.lottie"
import { Button } from "@/components/ui/button"
import { homeActions } from "@/store/home.store"

export function HeaderNewChatButton() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  const handleLottieHover = () => {
    if (dotLottie) {
      dotLottie.setFrame(0)
      dotLottie.play()
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-11 rounded-full"
      aria-label="New chat"
      onClick={() => homeActions.setIsNewChatDialog(true)}
      onMouseEnter={handleLottieHover}
    >
      <DotLottieReact
        src={Pencil}
        speed={1.5}
        className="size-6 dark:invert"
        dotLottieRefCallback={setDotLottie}
      />
    </Button>
  )
}