import {ApiHelper} from "./ApiHelper.ts";
import {ChatType, MessageType} from "../types/chat.ts";

const api = new ApiHelper();

export const MOCK_CHATS: ChatType[] = [
  {id: "1", name: "Сохраненные", lastMessage: "Link to my profile...", time: "13:52", isFavorite: true},
  {id: "2", name: "John Doe", lastMessage: "Yo", time: "01:00", isFavorite: true, unreadCount: 8},
  {
    id: "3",
    name: "Apple Tech Support",
    lastMessage: "fym “Ima trying to hack Secure enclave”?",
    time: "02:30",
    isGroup: true,
    lastMessageUserName: "MacOS",
    lastMessageUserColor: "text-orange-500",
    isFavorite: true,
    isMuted: true
  },
  {
    id: "4",
    name: "Mellstroy Rich Club",
    lastMessage: "Let’s discuss sum details yk",
    time: "06:10",
    isGroup: true,
    lastMessageUserName: "BO$$",
    lastMessageUserColor: "text-primary",
    isMuted: true
  },
];

export const MOCK_MESSAGES: Record<string, MessageType[]> = {
  "1": [
    {id: "m1", text: "Don't forget this link.", time: "13:50", isMine: true},
    {id: "m2", text: "Link to my profile...", time: "13:52", isMine: true},
  ],
  "2": [
    {id: "m1", text: "Hey man, you there?", time: "00:55", isMine: false},
    {id: "m2", text: "Yo", time: "01:00", isMine: false},
  ],
  "3": [
    {id: "m1", text: "Hello, I need help with my iPhone.", time: "02:20", isMine: true},
    {
      id: "m2",
      text: "fym “Ima trying to hack Secure enclave”?",
      time: "02:30",
      isMine: false,
      senderName: "MacOS",
      senderColor: "text-orange-500"
    },
    {id: "m3", text: "WOW", time: "02:50", isMine: true, isNew: true},
    {id: "m4", text: "Can I go to school?", time: "03:20", isMine: true},
    {id: "m5", text: "NOOOOOO!!!!", time: "04:00", isMine: false},
  ],
  "4": [
    {
      id: "m1",
      text: "We need more views.",
      time: "06:00",
      isMine: false,
      senderName: "Manager",
      senderColor: "text-blue-500"
    },
    {
      id: "m2",
      text: "Let’s discuss sum details yk",
      time: "06:10",
      isMine: false,
      senderName: "BO$$",
      senderColor: "text-primary"
    },
  ],
};

export const chatsApi = {
  getChats: async (): Promise<ChatType[]> => {
    return api.request<ChatType[]>(
      {url: "/api/chats", method: "GET"},
      () => MOCK_CHATS
    );
  },

  getChatMessages: async (chatId: string): Promise<MessageType[]> => {
    return api.request<MessageType[]>(
      {url: `/api/chats/${chatId}/messages`, method: "GET"},
      () => MOCK_MESSAGES[chatId] || []
    );
  },
};
