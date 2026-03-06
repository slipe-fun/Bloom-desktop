import Icon from "../../ui/Icon.tsx";
import Button from "../../ui/Button.tsx";

export default function EmptyChatsSide() {
  return (
    <div className="flex w-full h-full flex-1 justify-center items-center px-xxxxl">
      <div
        className="flex flex-col w-full rounded-xxxl bg-foreground-soft p-xxl gap-lg justify-center items-center"
      >
                <span className="flex size-xxsuper justify-center items-center bg-foreground-transparent rounded-full">
                  <Icon className="text-text-main" size={44} icon="message"/>
                </span>
        <h1 className="text-md text-text-main text-center w-full">
          Your chat list is empty, let’s create a new chat!
        </h1>
        <Button className="w-full">Create chat</Button>
      </div>
    </div>
  )
}
