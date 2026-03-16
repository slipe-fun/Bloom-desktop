import Icon from "../../ui/Icon.tsx";

interface ChatListItemProps {
  name?: string;
  lastMessage?: string;
  lastMessageUserName?: string;
  lastMessageUserColor?: string;
  time?: string;
  unreadCount?: number;

  isActive?: boolean;
  isMuted?: boolean;
  isFavorite?: boolean;
  isGroup?: boolean;

  onClick?: () => void;
}

export default function ChatListItem({
                                       name = "name",
                                       lastMessage = "text",
                                       lastMessageUserName,
                                       lastMessageUserColor = "text-text-main",
                                       time = "00:00",
                                       unreadCount = 0,
                                       isActive = false,
                                       isMuted = false,
                                       isFavorite = false,
                                       isGroup = false,
                                       onClick,
                                     }: ChatListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex w-full cursor-pointer pr-lg transition-colors
        ${isActive ? "bg-foreground-soft" : "hover:bg-foreground-soft"}
      `}
    >
      <div className="p-lg shrink-0">
        <div
          className={`
            w-super aspect-square bg-gradient-to-b from-[#52A8FF] to-[#1D8EFF] flex items-center justify-center
            ${isGroup ? "rounded-2xl" : "rounded-full"}
          `}
        >
        </div>
      </div>

      <div className={`
        flex-1 min-w-0 h-full flex flex-col pt-lg pb-lg gap-xs border-b
        ${isActive ? "border-transparent" : "border-border"}
      `}>
        <div className="w-full flex justify-between items-center gap-sm">
          <div className="flex items-center gap-xs overflow-hidden min-w-0">
            <h3 className="text-md text-text-main font-semibold truncate">
              {name}
            </h3>

            {isMuted && (
              <Icon icon="bell.slashed" size={16} className="text-text-secondary shrink-0"/>
            )}
          </div>

          <div className="flex gap-xs items-center justify-between shrink-0">
            <span className="text-sm text-text-secondary">
              {time}
            </span>
            <Icon size={16} icon='chevron.right' className="text-text-secondary"/>
          </div>
        </div>

        <div className="w-full flex justify-between items-center gap-sm">
          <div className="text-sm truncate pr-md flex-1 min-w-0">
            {isGroup && lastMessageUserName && (
              <span className={`font-semibold mr-1 ${lastMessageUserColor}`}>
                {lastMessageUserName}:
              </span>
            )}
            <span className="text-text-secondary">
              {lastMessage}
            </span>
          </div>

          <div className="flex items-center gap-xs shrink-0">
            {isFavorite && unreadCount === 0 && (
              <Icon icon="star" size={20} className="text-text-secondary"/>
            )}

            {!isFavorite && unreadCount > 0 && (
              <div className={`
                w-xl aspect-square rounded-full flex items-center justify-center text-xs
                ${isMuted ? "bg-foreground-soft text-text-main" : "bg-primary text-white"}
              `}>

                <span className="leading-none mt-[1px]">
                  {unreadCount}
                </span>
              </div>
            )}

            {isFavorite && unreadCount > 0 && (
              <div className={`
                h-xl rounded-full flex items-center justify-center px-sm gap-xs
                ${isMuted ? "bg-foreground-soft text-text-main" : "bg-primary text-white"}
              `}>

                <span className="flex items-center justify-center text-xs leading-none mt-[1px]">
                  {unreadCount}
                </span>

                <span className="flex items-center justify-center shrink-0">
                  <Icon
                    icon="star"
                    size={14}
                    className={isMuted ? "text-text-secondary" : "text-backdrop-white"}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
