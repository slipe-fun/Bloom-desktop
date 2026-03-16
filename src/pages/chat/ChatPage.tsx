import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {MessageType} from "../../types/chat.ts";
import {chatsApi} from "../../api/chats.ts";
import ChatFooter from "../../components/main/chat/ChatFooter.tsx";
import ChatMessage from "../../components/main/chat/ChatMessage.tsx";

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
    <div className="flex flex-col h-full w-full bg-background relative">
      <div className="flex-1 overflow-y-auto px-lg flex flex-col gap-lg justify-end">
        {isLoading ? (
          // TODO
          <div className="text-center text-text-secondary mt-10">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          // TODO
          <div className="text-center text-text-secondary mt-10">No messages here yet...</div>
        ) : (
          messages.map((msg) => (
            <ChatMessage content={msg.text} isMine={msg.isMine} time={msg.time} isNew={msg.isNew}/>
          ))
        )}
      </div>

      <ChatFooter/>
    </div>
  );
}
