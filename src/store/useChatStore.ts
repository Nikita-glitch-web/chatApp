import { create } from "zustand";
import { Chat } from "../services/chatServices"; // Імпортуємо типи з сервісу
import {
  loadChats as fetchChats, // Перейменування, щоб виділити від методів стейту
  createChat,
  sendMessage,
  sendImage,
  updateChat,
  deleteChat,
} from "../services/chatServices";
import { getAuth } from "firebase/auth"; // Додаємо Firebase Auth для отримання userId

interface IChatStore {
  chats: Chat[];
  selectedChat: Chat | null;
  loadChats: () => Promise<void>;
  createChat: (name: string, members: string[]) => Promise<void>;
  selectChat: (chatId: string) => void;
  sendMessage: (chatId: string, userId: string, text: string) => Promise<void>;
  sendImage: (chatId: string, userId: string, imageFile: File) => Promise<void>;
  updateChat: (chatId: string, updatedData: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<IChatStore>((set, get) => ({
  chats: [],
  selectedChat: null,

  loadChats: async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const chats = await fetchChats(user.uid); // Передаємо uid користувача
        set({ chats });
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  },

  createChat: async (name: string, members: string[]) => {
    try {
      const chat = await createChat(name, members);
      set((state) => ({ chats: [...state.chats, chat] }));
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  },

  selectChat: (chatId: string) => {
    const chat =
      get().chats.find((chat: { id: string }) => chat.id === chatId) || null;
    set({ selectedChat: chat });
  },

  sendMessage: async (chatId: string, userId: string, text: string) => {
    try {
      await sendMessage(chatId, userId, text);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, lastMessage: text, time: new Date().toISOString() }
            : chat
        ),
      }));
    } catch (error) {
      console.error("Failed to send message", error);
    }
  },

  sendImage: async (chatId: string, userId: string, imageFile: File) => {
    try {
      await sendImage(chatId, userId, imageFile);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: "Image sent",
                time: new Date().toISOString(),
              }
            : chat
        ),
      }));
    } catch (error) {
      console.error("Failed to send image", error);
    }
  },

  updateChat: async (chatId: string, updatedData: Partial<Chat>) => {
    try {
      await updateChat(chatId, updatedData);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, ...updatedData } : chat
        ),
      }));
    } catch (error) {
      console.error("Failed to update chat", error);
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
      }));
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  },
}));
