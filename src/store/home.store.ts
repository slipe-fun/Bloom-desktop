import { proxy } from "valtio"

interface HomeStore {
  currentChat: string
  isSearch: boolean
  isNewChatDialog: boolean
  searchValue: string
}

export const homeStore = proxy<HomeStore>({
  currentChat: "",
  isSearch: false,
  isNewChatDialog: false,
  searchValue: ""
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
  },
  setSearchValue:(searchValue: string) => {
    homeStore.searchValue = searchValue
  },
}
