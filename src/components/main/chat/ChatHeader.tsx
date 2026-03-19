import Button from "../../ui/Button.tsx";
import Icon from "../../ui/Icon.tsx";

export default function ChatHeader() {
  return (
    <header
      className="w-full absolute top-0 left-0 z-10 flex justify-between p-lg pb-xxl bg-gradient-to-b from-gradient-start to-gradient-end">
      <div className="flex-1 flex items-start justify-start">
        <Button variant='icon-secondary' className="pr-[10px]">
          <Icon size={26} icon='chevron.left' className="text-text-main"/>
          <div
            className="bg-text-main text-foreground px-sm text-sm h-xxl flex items-center justify-center rounded-full">
            30
          </div>
        </Button>
      </div>

      <div className="flex-none relative w-super h-super">
        <svg viewBox="0 0 52 52" className="w-full h-full overflow-visible">
          <defs>
            <mask id="avatar-cutout">
              <circle cx="26" cy="26" r="26" fill="white"/>

              <rect x="-12" y="28" width="76" height="34" rx="17" fill="black"/>
            </mask>
          </defs>

          <image
            href="https://i.pinimg.com/736x/2f/5f/f7/2f5ff7a48dbe2cccdd9a4c95172c2fad.jpg"
            width="52"
            height="52"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#avatar-cutout)"
          />
        </svg>

        <div
          className="absolute left-1/2 -translate-x-1/2 translate-y-1/4 bottom-0 px-sm h-xxxl bg-gray rounded-full text-white text-sm flex items-center justify-center whitespace-nowrap z-10">
          Offline
        </div>

      </div>

      <div className="flex-1 flex items-start justify-end">
        <Button variant='icon-secondary'>
          <Icon size={26} icon='waveform' className="text-text-main"/>
        </Button>
      </div>
    </header>
  )
}
