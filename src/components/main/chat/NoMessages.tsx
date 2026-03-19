import EmptyState from "../EmptyState.tsx";

export default function NoMessages() {
  return (
    <EmptyState
      classList="max-w-[370px]"
      icon="message"
      title="No messages here yet..."
      description="Send a message to start or click on the greeting above"
    />
  )
}
