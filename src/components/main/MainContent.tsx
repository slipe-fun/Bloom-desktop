import {ReactNode} from "react";

type Props = {
  children: ReactNode
}

export default function MainContent({children}: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  )
}
