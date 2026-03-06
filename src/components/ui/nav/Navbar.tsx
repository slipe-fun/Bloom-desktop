import {NavbarElement} from "./NavbarElement.tsx";
import {ICONS} from "../../../constants/icons.ts";

type NavTab = keyof typeof ICONS;

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: NavTab[] = [
  'person.circle',
  'compass',
  'message',
  'gear'
];

export default function Navbar({activeTab, onTabChange}: NavbarProps) {
  return (
    <nav className="w-full flex items-center rounded-full gap-xs p-xs border border-border bg-background shadow-shadow">
      {NAV_ITEMS.map((icon) => (
        <NavbarElement
          key={icon}
          icon={icon}
          isSelected={activeTab === icon}
          onClick={() => onTabChange(icon)}
        />
      ))}
    </nav>
  );
}
