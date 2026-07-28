import { useState } from "react";
import { motion } from "framer-motion";
import Pencil from "@/assets/icons/pencil.svg?react"
import Message from "@/assets/icons/message.svg?react"
import Magnifyingglass from "@/assets/icons/magnifyingglass.svg?react"
import { Button } from "@/components/ui/button";
import { TITLEBAR_HEIGHT } from "@/components/titlebar";
import { EASING } from "@/constants/animations-easing";

export default function SidebarHeader() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header 
      style={{ paddingTop: TITLEBAR_HEIGHT }}
      className="w-full p-4 pb-3 flex flex-col gap-4 border-b border-foreground/10 select-none"
    >
      <div className="flex items-center justify-between">
       <div className="flex cursor-default w-full items-center gap-1.5">
        <Message className="size-7.5 text-foreground/40"/>
        <span className="text-2xl font-bold tracking-tight">Chats</span>
      </div>

        <Button
          variant="secondary"
          size="icon"
          className="size-11 rounded-full"
        >
          <Pencil className="size-6.5" />
        </Button>
      </div>

      <div className="relative w-full h-11 bg-secondary rounded-full overflow-hidden flex items-center">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full bg-transparent pl-10 pr-4 text-base text-foreground outline-none z-10"
        />

        {searchValue === "" && (
          <motion.div
            initial={false}
            animate={{
              left: isFocused ? "16px" : "50%",
              x: isFocused ? "0%" : "-50%",
            }}
            transition={EASING.normalSpring}
            className="absolute flex items-center gap-2 pointer-events-none z-0 whitespace-nowrap"
          >
            <Magnifyingglass className="size-5.5 text-foreground/40" />
            <span className="text-base font-medium text-foreground/40">Search across chats</span>
          </motion.div>
        )}
      </div>
    </header>
  );
}