import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import ChatTopbar from "../../components/main/chat/ChatTopbar.tsx";
import ChatListItem from "../../components/main/chat/ChatListItem.tsx";
import {chatsApi} from "../../api/chats.ts";
import {ChatType} from "../../types/chat.ts";

export default function ChatSidebar() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    chatsApi.getChats().then((data) => {
      setChats(data);
      setIsLoading(false);
    });
  }, []);


  return (
    <div className="flex flex-col w-full h-full flex-1 min-w-0 border-r border-border">
      <ChatTopbar/>

      <section className="flex flex-col flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="p-4 text-text-secondary text-center">Загрузка чатов...</div>
        ) : (
          chats.map((chat) => {
            const isActive = location.pathname === `/chats/${chat.id}`;

            return (
              <ChatListItem
                key={chat.id}
                name={chat.name}
                lastMessage={chat.lastMessage}
                time={chat.time}
                unreadCount={chat.unreadCount}
                isFavorite={chat.isFavorite}
                isMuted={chat.isMuted}
                isGroup={chat.isGroup}
                lastMessageUserName={chat.lastMessageUserName}
                lastMessageUserColor={chat.lastMessageUserColor}
                isActive={isActive}
                onClick={() => navigate(`/main/chats/${chat.id}`)}
              />
            );
          })
        )}
      </section>
    </div>
  );
}
