export interface ChatType {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isFavorite?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
  lastMessageUserName?: string;
  lastMessageUserColor?: string;
}

export interface MessageType {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  senderName?: string;
  senderColor?: string;
  isNew?: boolean;
}
