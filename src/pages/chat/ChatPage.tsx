import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MessageType} from "../../types/chat.ts";
import {chatsApi} from "../../api/chats.ts";
import ChatFooter from "../../components/main/chat/ChatFooter.tsx";
import ChatMessage from "../../components/main/chat/ChatMessage.tsx";
import ChatHeader from "../../components/main/chat/ChatHeader.tsx";

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
          <div className="text-center text-text-secondary mt-10">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-text-secondary mt-10">No messages here yet...</div>
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
