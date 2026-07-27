import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    getCurrentWindow().show();
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      <Titlebar />
      <Auth />
    </div>
  )
}

export default App
