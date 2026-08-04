import { useEffect, useState } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { EASING } from "@/constants/animations-easing"
import { cn } from "@/lib/utils"
import type { NavItem } from "./navigation-sidebar"
import { Button } from "@/components/ui/button"

export function NavigationSidebarButton({
  item,
  isActive,
  isHovered,
  onSelect,
  onHoverChange,
}: {
  item: NavItem
  isActive: boolean
  isHovered: boolean
  onSelect: () => void
  onHoverChange: (hovered: boolean) => void
}) {
  const [lottie, setLottie] = useState<DotLottie | null>(null)
  const logoControls = useAnimation()

  useEffect(() => {
    if (isHovered && lottie) {
      lottie.stop()
      lottie.play()
    }
  }, [isHovered, lottie])

  const handleMouseEnter = () => {
    onHoverChange(true)
    if (item.isLogo) {
      logoControls.set({ rotate: 0 })
      logoControls.start({ rotate: 180, transition: EASING.slowSpring })
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={onSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => onHoverChange(false)}
            whileTap={{ scale: 1 }}
            className="group relative flex h-12 w-full items-center justify-center outline-none p-0 shadow-none bg-transparent"
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                transition={EASING.middleSpring}
                className="absolute left-0 top-1/2 h-6.5 w-1 -translate-y-1/2 rounded-r-full bg-selection-background"
              />
            )}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
                  transition={EASING.middleSpring}
                  className="absolute inset-x-4 inset-y-0 rounded-full bg-selection-background"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center justify-center">
              {item.isLogo ? (
                <motion.img 
                  src={item.imageSrc} 
                  alt={item.label} 
                  animate={logoControls}
                  className="size-7.25 object-contain" 
                />
              ) : item.lottieSrc ? (
                <DotLottieReact
                  src={item.lottieSrc}
                  loop={false}
                  autoplay={false}
                  dotLottieRefCallback={setLottie}
                  className={cn("size-7.5 transition-all dark:invert", isActive && "invert dark:invert-0")}
                />
              ) : null}
            </div>
          </Button>
        }
      />
      <TooltipContent side="right" sideOffset={0}>{item.label}</TooltipContent>
    </Tooltip>
  )
}