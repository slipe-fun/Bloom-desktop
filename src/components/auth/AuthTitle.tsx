import Icon from "../ui/Icon.tsx";
import {ICONS} from "../../constants/icons.ts";
import React from "react";

interface AuthTitleProps {
  icon: keyof typeof ICONS;
  title: string;
  className?: string;
}

export const AuthTitle: React.FC<AuthTitleProps> = ({icon, title, className = ''}) => {
  return (
    <div className={`flex select-none flex-col justify-center items-center gap-sm ${className}`}>
      <Icon icon={icon} size={108} className="text-primary"/>
      <h1 className="text-xxxl font-bold text-text-main">{title}</h1>
    </div>
  );
};

export default AuthTitle;
