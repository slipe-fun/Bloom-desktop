import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PersonCircle from "@/assets/icons/person.circle.svg?react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Gear from "@/assets/icons/gear.svg?react"
import { EASING } from "@/constants/animations-easing"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"

const navItems = [
  { id: "home", icon: PersonCircle, label: "Home" },
  { id: "profile", icon: PersonCircle, label: "Profile" },
  { id: "settings", icon: Gear, label: "Settings" },
]

export function NavigationSidebar() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <aside style={{ paddingTop: TITLEBAR_HEIGHT }} className="flex h-screen min-w-24 w-24 flex-col items-center justify-between px-4 pb-6.5 select-none">
      <nav className="flex flex-col gap-3 w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isHome = item.id === "home"

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger
                render={
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className="group relative flex h-11 w-full items-center justify-center rounded-2xl outline-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-background"
                        className="absolute inset-0 rounded-lg bg-[#18181B]"
                        initial={false}
                        transition={EASING.middleSpring}
                      />
                    )}

                    <motion.div
                      whileHover={{ scale: isActive ? 1 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10 flex h-full w-full items-center justify-center"
                    >
                      <Icon
                        className={cn(
                          "size-7.5 transition-colors duration-200",
                          isActive
                            ? isHome
                              ? "fill-pink-400 text-pink-400"
                              : "text-white"
                            : "text-black hover:text-gray-600"
                        )}
                      />
                    </motion.div>
                  </button>
                }
              ></TooltipTrigger>
              <TooltipContent side="right" sideOffset={16}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      <div className="flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className="text-black transition-colors outline-none hover:text-gray-600"
        >
          <PersonCircle className="h-6 w-6" />
        </motion.button>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="h-10 w-10 cursor-pointer border border-black/10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </motion.div>
      </div>
    </aside>
  )
}
