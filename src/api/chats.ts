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
  {id: "5", name: "Emma Wilson", lastMessage: "See you tomorrow!", time: "22:14", unreadCount: 2},
  {
    id: "6",
    name: "Frontend Team",
    lastMessage: "PR approved ✅",
    time: "21:40",
    isGroup: true,
    lastMessageUserName: "Alex",
    lastMessageUserColor: "text-blue-500"
  },
  {id: "7", name: "Delivery Bot", lastMessage: "Your package has arrived 📦", time: "20:05", isMuted: true},
  {id: "8", name: "Michael", lastMessage: "Call me when you're free", time: "19:32"},
  {
    id: "9",
    name: "Gym Bros",
    lastMessage: "Leg day tomorrow 💀",
    time: "18:50",
    isGroup: true,
    lastMessageUserName: "Chris",
    lastMessageUserColor: "text-green-500",
    unreadCount: 5
  },
  {id: "10", name: "Bank Support", lastMessage: "Your verification code is 4821", time: "17:15", isMuted: true},
  {
    id: "11",
    name: "Design Team",
    lastMessage: "New Figma file uploaded",
    time: "16:02",
    isGroup: true,
    lastMessageUserName: "Kate",
    lastMessageUserColor: "text-pink-500"
  },
  {id: "12", name: "Project Manager", lastMessage: "Deadline is tomorrow!", time: "15:45", unreadCount: 3},
  {
    id: "13",
    name: "Family Group",
    lastMessage: "Dinner at 7 ❤️",
    time: "14:10",
    isGroup: true,
    lastMessageUserName: "Mom",
    lastMessageUserColor: "text-red-500"
  },
  {id: "14", name: "Notifications", lastMessage: "You have a new login", time: "13:05", isMuted: true, unreadCount: 6},
  {id: "15", name: "Old Friend", lastMessage: "Long time no see...", time: "12:00"},
  {id: "16", name: "Empty Chat", lastMessage: "", time: "—"},
];

export const MOCK_MESSAGES: Record<string, MessageType[]> = {
  "1": [
    {id: "m1", text: "Don't forget this link.", time: "13:50", isMine: true},
    {id: "m2", text: "Link to my profile...", time: "13:52", isMine: true},
  ],
  "2": [
    {id: "m1", text: "Hey man, you there?", time: "00:55", isMine: false},
    {id: "m2", text: "Yo", time: "01:00", isMine: false},
    {id: "m3", text: "Finally answered 💀", time: "01:01", isMine: true},
    {id: "m4", text: "what’s up?", time: "01:02", isMine: true},
    {id: "m5", text: "nothing much, just coding", time: "01:03", isMine: false},
    {id: "m6", text: "again??", time: "01:03", isMine: true},
    {id: "m7", text: "bro you need life fr", time: "01:04", isMine: true},
    {id: "m8", text: "😭", time: "01:05", isMine: false},
    {id: "m9", text: "nah but seriously, working on that chat app", time: "01:06", isMine: false},
    {id: "m10", text: "oh nice", time: "01:07", isMine: true},
    {id: "m11", text: "frontend or backend?", time: "01:07", isMine: true},
    {id: "m12", text: "frontend rn", time: "01:08", isMine: false},
    {id: "m13", text: "react?", time: "01:08", isMine: true},
    {id: "m14", text: "ye", time: "01:09", isMine: false},
    {id: "m15", text: "ts?", time: "01:09", isMine: true},
    {id: "m16", text: "ofc bro I’m not insane", time: "01:10", isMine: false},
    {id: "m17", text: "respect 😂", time: "01:11", isMine: true},
    {id: "m18", text: "what u doing btw", time: "01:12", isMine: false},
    {id: "m19", text: "same, but procrastinating", time: "01:13", isMine: true},
    {id: "m20", text: "classic", time: "01:14", isMine: false},
    {id: "m21", text: "send repo", time: "01:15", isMine: true},
    {id: "m22", text: "nah it’s messy rn", time: "01:16", isMine: false},
    {id: "m23", text: "coward", time: "01:16", isMine: true},
    {id: "m24", text: "💀", time: "01:17", isMine: false},
    {id: "m25", text: "ok wait", time: "01:18", isMine: false},
    {id: "m26", text: "sending...", time: "01:19", isMine: false},
    {id: "m27", text: "oh damn UI actually clean", time: "01:20", isMine: true},
    {id: "m28", text: "told you", time: "01:21", isMine: false},
    {id: "m29", text: "but messages look kinda empty", time: "01:22", isMine: true},
    {id: "m30", text: "ye I need mock data", time: "01:23", isMine: false},
    {id: "m31", text: "bruh", time: "01:24", isMine: true},
    {id: "m32", text: "I literally asked u earlier 💀", time: "01:25", isMine: true},
    {id: "m33", text: "oh yeah true", time: "01:26", isMine: false},
    {id: "m34", text: "help me then", time: "01:27", isMine: false},
    {id: "m35", text: "fine", time: "01:28", isMine: true},
    {id: "m36", text: "make long convo like this", time: "01:29", isMine: true},
    {id: "m37", text: "wow genius idea", time: "01:30", isMine: false},
    {id: "m38", text: "ikr", time: "01:31", isMine: true, isNew: true},
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
  "5": [
    {id: "m1", text: "Are we still on for tomorrow?", time: "22:00", isMine: false},
    {id: "m2", text: "Yep, same place?", time: "22:05", isMine: true},
    {id: "m3", text: "Of course 🙂", time: "22:10", isMine: false},
    {id: "m4", text: "See you tomorrow!", time: "22:14", isMine: false},
  ],
  "6": [
    {
      id: "m1",
      text: "I pushed the latest changes",
      time: "21:20",
      isMine: false,
      senderName: "Alex",
      senderColor: "text-blue-500"
    },
    {id: "m2", text: "Reviewing now", time: "21:25", isMine: true},
    {
      id: "m3",
      text: "Looks good to me",
      time: "21:35",
      isMine: false,
      senderName: "Alex",
      senderColor: "text-blue-500"
    },
    {id: "m4", text: "PR approved ✅", time: "21:40", isMine: false, senderName: "Alex", senderColor: "text-blue-500"},
  ],
  "7": [
    {id: "m1", text: "Your order has been shipped", time: "19:50", isMine: false},
    {id: "m2", text: "Courier is on the way", time: "20:00", isMine: false},
    {id: "m3", text: "Your package has arrived 📦", time: "20:05", isMine: false},
  ],
  "8": [
    {id: "m1", text: "Hey, got a minute?", time: "19:20", isMine: false},
    {id: "m2", text: "Not now, what's up?", time: "19:25", isMine: true},
    {id: "m3", text: "Call me when you're free", time: "19:32", isMine: false},
  ],
  "9": [
    {
      id: "m1",
      text: "Who's going today?",
      time: "18:30",
      isMine: false,
      senderName: "Chris",
      senderColor: "text-green-500"
    },
    {id: "m2", text: "I’m in", time: "18:32", isMine: true},
    {id: "m3", text: "Same", time: "18:33", isMine: false, senderName: "Mike", senderColor: "text-yellow-500"},
    {
      id: "m4",
      text: "Leg day tomorrow 💀",
      time: "18:50",
      isMine: false,
      senderName: "Chris",
      senderColor: "text-green-500",
      isNew: true
    },
  ],
  "10": [
    {id: "m1", text: "Your OTP is 9134", time: "17:10", isMine: false},
    {id: "m2", text: "Do not share this code", time: "17:11", isMine: false},
    {id: "m3", text: "Your verification code is 4821", time: "17:15", isMine: false},
  ],
  "11": [
    {
      id: "m1",
      text: "I updated the landing page",
      time: "15:40",
      isMine: false,
      senderName: "Kate",
      senderColor: "text-pink-500"
    },
    {id: "m2", text: "Looks clean!", time: "15:45", isMine: true},
    {
      id: "m3",
      text: "Check new components",
      time: "15:55",
      isMine: false,
      senderName: "Kate",
      senderColor: "text-pink-500"
    },
    {
      id: "m4",
      text: "New Figma file uploaded",
      time: "16:02",
      isMine: false,
      senderName: "Kate",
      senderColor: "text-pink-500"
    },
  ],
  "12": [
    {id: "m1", text: "Hey, quick update?", time: "15:30", isMine: false},
    {id: "m2", text: "Working on it", time: "15:32", isMine: true},
    {id: "m3", text: "Deadline is tomorrow!", time: "15:45", isMine: false, isNew: true},
  ],
  "13": [
    {
      id: "m1",
      text: "Are you coming today?",
      time: "13:50",
      isMine: false,
      senderName: "Mom",
      senderColor: "text-red-500"
    },
    {id: "m2", text: "Yes 👍", time: "13:55", isMine: true},
    {id: "m3", text: "Dinner at 7 ❤️", time: "14:10", isMine: false, senderName: "Mom", senderColor: "text-red-500"},
  ],
  "14": [
    {id: "m1", text: "New login detected", time: "12:50", isMine: false},
    {id: "m2", text: "Location: Germany", time: "12:51", isMine: false},
    {id: "m3", text: "You have a new login", time: "13:05", isMine: false, isNew: true},
  ],
  "15": [
    {id: "m1", text: "Hey...", time: "11:50", isMine: false},
    {id: "m2", text: "Long time no see...", time: "12:00", isMine: false},
  ],
  "16": [],
};

export const chatsApi = {
  getChats: async (): Promise<ChatType[]> => {
    return api.request<ChatType[]>(
      {url: "/api/chats", method: "GET"},
      () => {
        if (import.meta.env.VITE_MOCK_EMPTYCHATS === "true") {
          return [];
        }
        return MOCK_CHATS;
      }
    );
  },

  getChatMessages: async (chatId: string): Promise<MessageType[]> => {
    return api.request<MessageType[]>(
      {url: `/api/chats/${chatId}/messages`, method: "GET"},
      () => MOCK_MESSAGES[chatId] || []
    );
  },
};
