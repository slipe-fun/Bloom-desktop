import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"

export function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Titlebar />
      <Auth />
    </div>
  )
}

export default App
