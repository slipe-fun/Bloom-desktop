import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MessageType} from "../../types/chat.ts";
import {chatsApi} from "../../api/chats.ts";
import ChatFooter from "../../components/main/chat/ChatFooter.tsx";
import ChatMessage from "../../components/main/chat/ChatMessage.tsx";
import ChatHeader from "../../components/main/chat/ChatHeader.tsx";
import NoMessages from "../../components/main/chat/NoMessages.tsx";

export default function ChatPage() {
  const {id} = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    chatsApi.getChatMessages(id).then((data) => {
      setMessages(data);
      setIsLoading(false);
    });
  }, [id]);

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <ChatHeader/>

      <div
        className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden flex flex-col-reverse px-lg pt-[90px] pb-[100px] gap-lg custom-scrollbar"
      >
        {isLoading ? (
          <div className="flex-1 w-full flex items-center justify-center text-text-secondary">
            Загрузка сообщений...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 w-full flex items-center justify-center text-text-secondary">
            <NoMessages/>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.text}
              isMine={msg.isMine}
              time={msg.time}
              isNew={msg.isNew}
            />
          ))
        )}
      </div>

      <ChatFooter/>
    </div>
  );
}
