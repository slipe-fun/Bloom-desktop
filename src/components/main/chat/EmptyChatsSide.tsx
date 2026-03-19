import EmptyState from "../EmptyState.tsx";

export default function EmptyChatsSide() {
  return (
    <EmptyState
      icon="message"
      title="Your chat list is empty, let’s create a new chat!"
      showButton
      buttonText="Create chat"
      onButtonClick={() => console.log("Create chat clicked")}
    />
  )
}
