import {NavbarElement} from "./NavbarElement.tsx";
import {NAV_LINKS} from "../../../constants/nav.ts";
import {useLocation, useNavigate} from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center rounded-full gap-xs p-xs border border-border bg-background shadow-shadow">
      {NAV_LINKS.map(({icon, path}) => (
        <NavbarElement
          key={icon}
          icon={icon}
          isSelected={location.pathname.startsWith(path)}
          onClick={() => navigate(path)}
        />
      ))}
    </nav>
  );
}
