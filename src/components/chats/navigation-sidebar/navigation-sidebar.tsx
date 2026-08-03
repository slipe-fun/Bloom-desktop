import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TITLEBAR_HEIGHT } from "@/components/titlebar"

import profileAnimation from "@/assets/icons/lottie/person.lottie"
import starAnimation from "@/assets/icons/lottie/star.lottie"
import gearAnimation from "@/assets/icons/lottie/gear.lottie"
import FlowerLogo from "@/assets/logo.png"
import { NavigationSidebarButton } from "./navigation-sidebar-nav-button"
import { NavigationSidebarThemeButton } from "./navigation-sidebar-theme-button"

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
      style={{ paddingTop: TITLEBAR_HEIGHT }}
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
        <Avatar className="size-12">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Dikiy Dikiens"
          />
          <AvatarFallback className="text-lg">DD</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  )
}
