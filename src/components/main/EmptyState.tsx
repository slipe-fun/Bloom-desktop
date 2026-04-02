import Button from "../ui/Button.tsx";
import Icon from "../ui/Icon.tsx";
import {ICONS} from "../../constants/icons.ts";
import {ReactNode} from "react";

interface EmptyStateProps {
  icon?: keyof typeof ICONS;
  customIcon?: ReactNode;
  iconWrapperClassName?: string;
  title: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  classList?: string;
}

export default function EmptyState({
                                     icon,
                                     customIcon,
                                     iconWrapperClassName = "bg-foreground-transparent",
                                     title,
                                     description,
                                     showButton = false,
                                     buttonText = "button",
                                     onButtonClick,
                                     classList = "",
                                   }: EmptyStateProps) {
  return (
    <div
      className={`flex w-full h-full flex-1 justify-center items-center px-xxxxl ${classList}`}
    >
      <div className="flex flex-col w-full rounded-xxxl bg-foreground-soft p-xxl gap-lg justify-center items-center">
        <span
          className={`flex size-xxsuper justify-center items-center rounded-full ${iconWrapperClassName}`}
        >
          {customIcon ? (
            customIcon
          ) : icon ? (
            <Icon className="text-text-main" size={44} icon={icon}/>
          ) : null}
        </span>

        <h1 className="text-md text-text-main text-center w-full">{title}</h1>

        {description && (
          <p className="text-sm text-text-secondary text-center w-full">{description}</p>
        )}

        {showButton && (
          <Button className="w-full" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
