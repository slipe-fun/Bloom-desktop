import ChatTopbar from "../../components/main/chat/ChatTopbar.tsx";
import ChatListItem from "../../components/main/chat/ChatListItem.tsx";

export default function ChatSidebar() {
  return (
    <div className="flex flex-col w-full h-full flex-1 min-w-0">
      <ChatTopbar/>

      <section className="flex flex-col flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
        {/*<EmptyChatsSide/>*/}
        <ChatListItem
          name="Сохраненные"
          lastMessage="Link to my profile on rule34: ..."
          time="13:52"
          isFavorite
        />
        <ChatListItem
          name="John Doe"
          lastMessage="Yo"
          time="01:00"
          isFavorite
          unreadCount={8}
        />
        <ChatListItem
          name="Alice Johnson"
          lastMessage="Hello, how are you?"
          time="01:15"
          isFavorite
          isMuted
          unreadCount={4}
        />
        <ChatListItem
          name="Apple Tech Support"
          lastMessage="fym “Ima trying to hack Secure enclave”?"
          isGroup
          lastMessageUserName="MacOS"
          lastMessageUserColor="text-orange"
          time="02:30"
          isFavorite
          isMuted
        />
        <ChatListItem
          name="Carla Reyes"
          lastMessage="See you tomorrow!"
          time="03:45"
          unreadCount={1}
        />
        <ChatListItem
          name="David Lee"
          lastMessage="Great work on the project!"
          time="05:00"
          unreadCount={3}
        />
        <ChatListItem
          name="Mellstroy Rich Club"
          lastMessage="Let’s discuss sum details yk"
          isGroup
          lastMessageUserName="BO$$"
          lastMessageUserColor="text-primary"
          time="06:10"
          isMuted
        />
        <ChatListItem
          name="Frank White"
          lastMessage="I'm here to help!"
          time="07:25"
          isMuted
          unreadCount={2}
        />
        <ChatListItem
          name="Grace Kim"
          lastMessage="Thank you for your support."
          time="08:40"
        />
      </section>
    </div>
  )
}
