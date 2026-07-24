import { Button } from "@/components/ui/button"
import { Titlebar } from "@/components/titlebar"
import { AnimatedQRCode } from "./components/auth/animated-qr-code"

export function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Titlebar />
      <div className="flex w-screen h-screen flex-col gap-6 items-center justify-center">
        <AnimatedQRCode />
        <Button>Button</Button>
      </div>
    </div>
  )
}

export default App
