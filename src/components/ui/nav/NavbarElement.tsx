import Icon from "../Icon.tsx";
import {ICONS} from "../../../constants/icons.ts";
import {motion} from "framer-motion";

interface NavbarElementProps {
  icon: keyof typeof ICONS;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NavbarElement({icon, isSelected = false, onClick}: NavbarElementProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-1 h-xxxxl items-center justify-center rounded-full
        transition-all duration-200 cursor-pointer relative
      "
    >
      <Icon
        size={32}
        icon={icon}
        className={`
          transition-colors duration-200 z-10
          ${isSelected ? 'text-primary' : 'text-text-main'}
        `}
      />

      {isSelected && (
        <motion.div
          layoutId="nav-highlight"
          className="absolute inset-0 bg-foreground-soft rounded-full shadow-sm"
          transition={{type: "spring", bounce: 0.2, duration: 0.6}}
        />
      )}
    </button>
  );
}
