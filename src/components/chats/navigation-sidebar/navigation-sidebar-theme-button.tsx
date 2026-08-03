import { useEffect, useRef, useState } from "react"
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-provider"
import themeAnimation from "@/assets/icons/lottie/theme.lottie"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function NavigationSidebarThemeButton() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const [lottie, setLottie] = useState<DotLottie | null>(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const isInitial = useRef(true)

  useEffect(() => {
    if (!lottie) return

    const applyTheme = () => {
      if (isInitial.current) {
        lottie.setSpeed(100)
        lottie.stateMachineSetBooleanInput("isDark", isDark)
        
        setTimeout(() => {
          lottie.setSpeed(1)
          setIsVisible(true)
          isInitial.current = false
        }, 50)
      } else {
        lottie.stateMachineSetBooleanInput("isDark", isDark)
      }
    }

    lottie.addEventListener("ready", applyTheme)
    if (lottie.isLoaded) applyTheme()

    return () => lottie.removeEventListener("ready", applyTheme)
  }, [lottie, isDark])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex h-12 w-full items-center justify-center outline-none bg-transparent p-0 shadow-none"
          >
            <div className={cn("transition-opacity duration-200", isVisible ? "opacity-100" : "opacity-0")}>
              <DotLottieReact
                src={themeAnimation}
                stateMachineId="state-machine"
                dotLottieRefCallback={setLottie}
                className="size-8 dark:invert"
              />
            </div>
          </Button>
        }
      />
      <TooltipContent side="right" sideOffset={0}>
        {isDark ? "Light theme" : "Dark theme"}
      </TooltipContent>
    </Tooltip>
  )
}
