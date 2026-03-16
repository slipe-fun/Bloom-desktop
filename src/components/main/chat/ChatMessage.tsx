interface ChatMessageProps {
  isMine?: boolean;
  content: string;
  isNew?: boolean;
  time: string;
}

export default function ChatMessage({
                                      isMine = false,
                                      content,
                                      isNew = false,
                                      time
                                    }: ChatMessageProps) {
  return (
    <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>

      <div className="relative">

        <div
          className={`
            flex items-end w-fit rounded-lg
            ${isNew ? 'mx-md' : ""}
            ${isMine ? 'bg-primary text-white' : 'bg-foreground-soft text-text-main'}
          `}
        >
          <div className="py-md pl-lg pr-sm text-md break-words">
            {content}
          </div>

          <div
            className={`
              py-md pr-lg pl-sm text-xs font-normal whitespace-nowrap shrink-0
              ${isMine ? 'text-white/50' : 'text-text-secondary'}
            `}
          >
            {time}
          </div>
        </div>

        {isNew && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              w-sm h-sm rounded-full bg-primary
              ${isMine ? '-right-xs' : '-left-xs'}
            `}
          />
        )}
      </div>
    </div>
  );
}
