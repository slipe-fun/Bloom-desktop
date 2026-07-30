import type { UserProfile } from "@/types/user"
import { proxy } from "valtio"

interface GlobalStore {
  user: UserProfile | null
}

export const gloabalStore = proxy<GlobalStore>({
  user: null,
})

export const globalActions = {
  setUser: (user: UserProfile) => {
    gloabalStore.user = user
  },
}
