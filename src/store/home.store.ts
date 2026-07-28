import { proxy } from "valtio"

interface HomeStore {
  currentChat: string
}

export const homeStore = proxy<HomeStore>({
  currentChat: "",
})

export const homeActions = {
  setCurrentChat: (currentChat: string) => {
    homeStore.currentChat = currentChat
  },
}
