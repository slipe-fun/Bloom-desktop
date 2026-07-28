import DashedBox from "@/components/ui/dashed-box"
import Magnifyingglass from "@/assets/icons/magnifyingglass.svg?react"
import { SIDEBAR_USER_BOTTOM_HEIGHT } from "./user-bottom"

export function SidebarSearchList() {
  return (
    <div style={{ paddingBottom: SIDEBAR_USER_BOTTOM_HEIGHT }} className="flex size-full flex-col items-center justify-center gap-6">
      <DashedBox width={100} height={100} className="text-foreground/20">
        <Magnifyingglass className="h-16.25 w-16.25 text-foreground/20" />
      </DashedBox>
      <div className="flex max-w-100 flex-col items-center justify-center gap-2">
        <h2 className="text-center text-2xl font-bold text-foreground">
          No search history
        </h2>

        <p className="text-center text-base font-medium text-foreground/40">
          Do your first search to see it in history
        </p>
      </div>
    </div>
  )
}
