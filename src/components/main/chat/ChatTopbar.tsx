import Button from "../../ui/Button.tsx";
import Icon from "../../ui/Icon.tsx";
import AppName from "../../ui/AppName.tsx";
import TextInput from "../../ui/TextInput.tsx";

export default function ChatTopbar() {
  return (
    <div className="flex flex-col w-full items-center justify-center p-xxl pb-lg gap-lg">
      <div className="flex items-center justify-center w-full">
        <Button variant='icon-secondary'>
          <Icon size={26} icon='pencil'/>
        </Button>
        <AppName/>
        <Button variant='icon-secondary'>
          <Icon size={26} icon='plus'/>
        </Button>
      </div>
      <TextInput placeholder='Global search' placeholderIcon='magnifyingglass' placeholderAlign='center'/>
    </div>
  )
}
