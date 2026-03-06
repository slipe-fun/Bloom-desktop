import Icon from "./Icon.tsx";

export default function AppName() {
  return (
    <div className="flex items-center gap-sm justify-center select-none w-full">
      <Icon icon="logo" size={20} className="text-primary"/>
      <span className="text-xl font-bold text-text-main">
        Bloom
      </span>
    </div>
  )
}
