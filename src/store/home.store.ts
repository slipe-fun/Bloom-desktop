import { proxy } from "valtio"

interface HomeStore {
  currentChat: string
  isSearch: boolean
}

export const homeStore = proxy<HomeStore>({
  currentChat: "",
  isSearch: false
})

export const homeActions = {
  setCurrentChat: (currentChat: string) => {
    homeStore.currentChat = currentChat
  },
  setIsSearch: (isSearch: boolean) => {
    homeStore.isSearch = isSearch
  }
}
