import { proxy } from "valtio"

export type TitlebarIcon = "message" | "gear" | "personCircle" | "person"

export interface TitlebarItem {
  id?: string
  title: string
  subtitle?: string
  icon: TitlebarIcon
}

const DEFAULT_ITEM: TitlebarItem = {
  id: "root",
  title: "Chats",
  subtitle: undefined,
  icon: "message",
}

interface TitlebarStore {
  stack: TitlebarItem[]
}

export const titlebarStore = proxy<TitlebarStore>({
  stack: [DEFAULT_ITEM],
})

export const titlebarActions = {
  push(item: Partial<TitlebarItem>) {
    const last = titlebarStore.stack[titlebarStore.stack.length - 1] || DEFAULT_ITEM
    titlebarStore.stack.push({
      id: item.id || `item-${Date.now()}`,
      title: item.title ?? last.title,
      subtitle: item.subtitle,
      icon: item.icon ?? last.icon,
    })
  },

  pop() {
    if (titlebarStore.stack.length > 1) {
      titlebarStore.stack.pop()
    }
  },
  
  reset(item?: Partial<TitlebarItem>) {
    titlebarStore.stack = [
      {
        id: "root",
        title: item?.title ?? DEFAULT_ITEM.title,
        subtitle: item?.subtitle,
        icon: item?.icon ?? DEFAULT_ITEM.icon,
      },
    ]
  },
}