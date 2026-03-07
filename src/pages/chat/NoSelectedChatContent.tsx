import MainContent from "../../components/main/MainContent";

export default function NoSelectedChatContent() {
  return (
    <MainContent>
      <div
        className="px-xl py-md text-text-main bg-background rounded-full font-semibold text-sm select-none">
        Select a chat to start messaging
      </div>
    </MainContent>
  )
}
