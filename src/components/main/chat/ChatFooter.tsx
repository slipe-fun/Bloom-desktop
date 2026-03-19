import TextInput from "../../ui/TextInput.tsx";
import Icon from "../../ui/Icon.tsx";
import Button from "../../ui/Button.tsx";

export default function ChatFooter() {
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 z-20 w-full flex p-lg pb-xxxl gap-lg bg-gradient-to-t from-gradient-start to-gradient-end">
      <Button variant='icon-secondary'>
        <Icon size={26} icon='dots'/>
      </Button>
      <TextInput variant='primary' placeholder="Message..."
                 rightElement={<Icon size={26} icon='face.smile' className="text-text-secondary"/>}
                 className="w-full"/>
      <Button variant='icon-secondary'>
        <Icon size={26} icon='waveform'/>
      </Button>
    </footer>
  )
}
