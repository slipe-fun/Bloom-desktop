import { useEffect, useState } from "react"
import { useSnapshot } from "valtio"
import { AnimatePresence, motion } from "framer-motion"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { type } from "@tauri-apps/plugin-os"
import { titlebarStore, type TitlebarIcon } from "@/store/titlebar.store"
import LineHorizontal from "@/assets/icons/line.horizontal.svg?react"
import RectangleStroke from "@/assets/icons/rectangle.stroke.svg?react"
import X from "@/assets/icons/x.svg?react"
import MessageIcon from "@/assets/icons/message.svg?react"
import GearIcon from "@/assets/icons/gear.svg?react"
import PersonIcon from "@/assets/icons/person.svg?react"
import PersonCircleIcon from "@/assets/icons/person.circle.svg?react"
import { EASING } from "@/constants/animations-easing"

export const TITLEBAR_HEIGHT = 36

const ICON_MAP: Record<
  TitlebarIcon,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  message: MessageIcon,
  gear: GearIcon,
  person: PersonIcon,
  personCircle: PersonCircleIcon
}

const titleItemAnimation = {
  layout: true,
  initial: { opacity: 0, filter: "blur(3px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(3px)" },
  transition: EASING.middleSpring,
}

const windowBtnAnimation = {
  whileTap: { scale: 0.8 },
  transition: EASING.springy,
  whileHover: { opacity: 0.5 },
}

export function Titlebar() {
  const [isMac, setIsMac] = useState(false)
  const { stack } = useSnapshot(titlebarStore)
  const [appWindow] = useState(() => getCurrentWindow())

  const current = stack[stack.length - 1]
  const IconComponent = ICON_MAP[current.icon] || MessageIcon

  const handleMinimize = () => appWindow.minimize()
  const handleToggleMaximize = async () => {
    await appWindow.toggleMaximize()
  }
  const handleClose = () => appWindow.close()

  useEffect(() => {
    let cancelled = false

    const checkOS = async () => {
      try {
        const osType = await type()
        if (!cancelled) setIsMac(osType === "macos")
      } catch {
        if (!cancelled) setIsMac(navigator.userAgent.includes("Mac"))
      }
    }

    checkOS()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      data-tauri-drag-region
      className={`absolute z-9999 flex h-9 w-full items-center ${isMac ? "justify-start" : "justify-end"} text-foreground transition-colors select-none`}
    >
      {isMac && <div className="h-full min-w-20" />}

      <div
        data-tauri-drag-region
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex items-center justify-center"
      >
        <div className="pointer-events-auto flex items-center gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={current.icon} {...titleItemAnimation}>
              <IconComponent className="h-5.5 w-5.5 fill-current text-foreground/40" />
            </motion.div>

            <motion.span
              key={current.title}
              {...titleItemAnimation}
              className="text-base font-medium text-foreground"
            >
              {current.title}
            </motion.span>

            {current.subtitle && (
              <motion.span
                key="separator"
                {...titleItemAnimation}
                className="text-sm font-medium text-foreground/40"
              >
                /
              </motion.span>
            )}

            {current.subtitle && (
              <motion.span
                key={current.subtitle}
                {...titleItemAnimation}
                className="text-base font-medium text-foreground"
              >
                {current.subtitle}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="z-10 flex min-w-20 items-center justify-end">
        {!isMac && (
          <div className="flex items-center">
            <motion.button
              type="button"
              onClick={handleMinimize}
              {...windowBtnAnimation}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground will-change-transform"
            >
              <LineHorizontal className="h-4.25 w-4.25 text-foreground" />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleToggleMaximize}
              {...windowBtnAnimation}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground will-change-transform"
            >
              <RectangleStroke className="size-4.25 text-foreground" />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleClose}
              {...windowBtnAnimation}
              className="group inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors will-change-transform"
            >
              <X className="size-4.25 text-foreground transition-colors group-hover:text-red-500" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
