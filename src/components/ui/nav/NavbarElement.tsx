import Icon from "../Icon.tsx";
import {ICONS} from "../../../constants/icons.ts";
import {motion} from "framer-motion";
import {useState} from "react";

interface NavbarElementProps {
  icon: keyof typeof ICONS;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NavbarElement({icon, isSelected = false, onClick}: NavbarElementProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        flex flex-1 h-xxxxl items-center justify-center rounded-full
        transition-all duration-200 cursor-pointer relative
      "
    >
      <motion.div
        layout
        animate={!isSelected && isHovered ? {scale: 0.85} : {scale: 1}}
        transition={{type: "spring", bounce: 0.1, duration: 0.4}}
        className="z-10"
      >
        <Icon
          size={32}
          icon={icon}
          className={`transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-text-main'}`}
        />
      </motion.div>

      {isSelected && (
        <motion.div
          layoutId="nav-highlight"
          className="absolute inset-0 bg-foreground-soft rounded-full"
          transition={{type: "spring", bounce: 0.2, duration: 0.6}}
        />
      )}
    </button>
  );
}
