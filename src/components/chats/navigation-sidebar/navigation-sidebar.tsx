import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"

import profileAnimation from "@/assets/icons/lottie/person.lottie"
import starAnimation from "@/assets/icons/lottie/star.lottie"
import gearAnimation from "@/assets/icons/lottie/gear.lottie"
import FlowerLogo from "@/assets/logo.png"
import { NavigationSidebarButton } from "./navigation-sidebar-nav-button"
import { NavigationSidebarThemeButton } from "./navigation-sidebar-theme-button"
import { Button } from "@/components/ui/button"
import { EASING } from "@/constants/animations-easing"

export interface NavItem {
  id: string
  label: string
  isLogo?: boolean
  imageSrc?: string
  lottieSrc?: string
}

const navItems: NavItem[] = [
  { id: "logo", label: "Chats", isLogo: true, imageSrc: FlowerLogo },
  { id: "friends", label: "Friends", lottieSrc: profileAnimation },
  { id: "savedMessages", label: "Saved messages", lottieSrc: starAnimation },
  { id: "settings", label: "Settings", lottieSrc: gearAnimation },
]

export function NavigationSidebar() {
  const [activeTab, setActiveTab] = useState("logo")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <aside
      style={{ paddingTop: TITLEBAR_HEIGHT + 16 }}
      className="relative flex h-screen w-25 min-w-25 flex-col items-center justify-between pb-6 select-none"
    >
      <nav className="flex w-full flex-col items-center gap-3">
        {navItems.map((item) => (
          <NavigationSidebarButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            isHovered={hoveredTab === item.id}
            onSelect={() => setActiveTab(item.id)}
            onHoverChange={(hovered) => setHoveredTab(hovered ? item.id : null)}
          />
        ))}
      </nav>

      <div className="flex w-full flex-col items-center gap-3">
        <NavigationSidebarThemeButton />

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <Button className="w-full flex items-center justify-center bg-transparent rounded-none p-0 shadow-none">
                      <Avatar className="size-12 cursor-pointer">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="Dikiy Dikiens"
                        />
                        <AvatarFallback className="text-lg">DD</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              }
            />
            <TooltipContent side="right" sideOffset={0}>
              Profile
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={0}
            className="border-none bg-transparent p-0 shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -16, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              transition={EASING.middleSpring}
              className="w-56 rounded-lg bg-popover p-1 text-popover-foreground shadow-md will-change-transform"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                Sign Out
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
