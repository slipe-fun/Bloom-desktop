import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Gear from "@/assets/icons/gear.svg?react"

export function SidebarUserBottom() {
  return (
    <div className="flex w-full p-4 pt-0">
      <div className="flex w-full rounded-2xl bg-secondary">
        <Button
          className="flex w-full justify-start rounded-2xl cursor-pointer gap-3 p-3 bg-transparent will-change-transform flex-1 h-auto"
          whileTap={{ scale: 0.985 }}
        >
          <Avatar className="size-10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Dikiy Dikiens"
            />
            <AvatarFallback className="text-base">DD</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col gap-1 justify-start">
            <span className="text-base text-foreground leading-4.75 font-semibold">
              Dikiy Dikiens
            </span>

            <div className="flex items-center gap-1.5">
              <span className="flex size-3 items-center justify-center rounded-full bg-green-500/35">
                <span className="size-2 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-500 leading-4.25">
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
        >
          <Gear className="size-7" />
        </Button>
      </div>
    </div>
  )
}
