import { proxy } from "valtio"

interface HomeStore {
  currentChat: string
  isSearch: boolean
  isNewChatDialog: boolean
}

export const homeStore = proxy<HomeStore>({
  currentChat: "",
  isSearch: false,
  isNewChatDialog: false
})

export const homeActions = {
  setCurrentChat: (currentChat: string) => {
    homeStore.currentChat = currentChat
  },
  setIsSearch: (isSearch: boolean) => {
    homeStore.isSearch = isSearch
  },
  setIsNewChatDialog: (isNewChatDialog: boolean) => {
    homeStore.isNewChatDialog = isNewChatDialog
  }
}
