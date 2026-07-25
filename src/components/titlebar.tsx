import { useEffect, useState } from "react"
import LineHorizontal from "@/assets/icons/line.horizontal.svg?react"
import RectangleStroke from "@/assets/icons/rectangle.stroke.svg?react"
import X from "@/assets/icons/x.svg?react"
import Logo from "@/assets/logo.png"
import { motion } from "framer-motion"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { type } from "@tauri-apps/plugin-os"

export function Titlebar() {
  const [isMac, setIsMac] = useState(false)

  const appWindow = getCurrentWindow()

  const handleMinimize = () => appWindow.minimize()

  const handleToggleMaximize = async () => {
    await appWindow.toggleMaximize()
  }

  const handleClose = () => appWindow.close()

  useEffect(() => {
    const checkOS = async () => {
      try {
        const osType = await type()
        setIsMac(osType === "macos")
      } catch {
        setIsMac(navigator.userAgent.includes("Mac"))
      }
    }

    checkOS()
  }, [])

  return (
    <div
      data-tauri-drag-region
      className={`absolute z-9999 flex h-10.5 w-full items-center ${isMac ? "justify-start" : "justify-end"} text-foreground transition-colors select-none`}
    >
      {isMac && (
        <div className="flex min-w-20 items-center">
          <div className="h-full w-20" />
        </div>
      )}

      <div data-tauri-drag-region className="flex cursor-default justify-center absolute w-full items-center gap-1.75">
        <img src={Logo} alt="Bloom Logo" className="h-5 w-5" />
        <span className="text-base font-bold tracking-tight">Bloom</span>
      </div>

      <div className="flex min-w-20 items-center justify-end">
        {!isMac && (
          <div className="flex items-center">
            <motion.button
              onClick={handleMinimize}
              whileHover={{ opacity: 0.5 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-10.5 will-change-transform w-10.5 items-center rounded-full justify-center text-muted-foreground"
            >
              <LineHorizontal className="h-4.25 w-4.25 text-foreground" />
            </motion.button>

            <motion.button
              onClick={handleToggleMaximize}
              whileHover={{opacity: 0.5 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-10.5 will-change-transform w-10.5 items-center rounded-full justify-center text-muted-foreground"
            >
              <RectangleStroke className="h-4.25 w-4.25 text-foreground" />
            </motion.button>

            <motion.button
              onClick={handleClose}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex h-10.5 will-change-transform w-10.5 group transition-colors items-center rounded-full justify-center text-muted-foreground"
            >
              <X className="h-4.5 w-4.5 group-hover:text-red-500 transition-colors text-foreground" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
