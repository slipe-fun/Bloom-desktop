import { Titlebar } from "@/components/titlebar"
import { Auth } from "@/views/auth"
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { authActions, authStore } from "@/store/auth.store";
import { invoke } from "@tauri-apps/api/core";

export function App() {
  const { isAuthenticated } = useSnapshot(authStore)

  useEffect(() => {
    authActions.setIsAuthenticated
    getCurrentWindow().show();
     (async () => {
      const me = await invoke("get_me") as string

      console.log(JSON.parse(me))
    })
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      <Titlebar />
      <Auth />
    </div>
  )
}

export default App
