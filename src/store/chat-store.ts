// src/store/chat-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatSession, ChatMessage } from "@/types/chat";

const createBrowserStorage = () => {
  const storage = createJSONStorage(() => ({
    getItem: (name: string) => {
      try {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.warn("Failed to retrieve from storage:", error);
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        console.warn("Failed to save to storage:", error);
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.warn("Failed to remove from storage:", error);
      }
    },
  }));

  return storage;
};

interface ChatStore {
  sessions: Record<string, ChatSession>;
  messages: Record<string, ChatMessage[]>;
  addMessage: (configId: string, message: ChatMessage) => void;
  getMessages: (configId: string) => ChatMessage[];
  clearSession: (configId: string) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      messages: {},

      addMessage: (configId, message) => {
        console.log("Adding message to store:", { configId, message });
        console.log("Current messages:", get().messages[configId] || []);

        set((state) => {
          const updatedMessages = [
            ...(state.messages[configId] || []),
            message,
          ];
          console.log("Updated messages array:", updatedMessages);

          return {
            messages: {
              ...state.messages,
              [configId]: updatedMessages,
            },
            sessions: {
              ...state.sessions,
              [configId]: {
                id: configId,
                messages: updatedMessages,
                updatedAt: new Date(),
                createdAt: state.sessions[configId]?.createdAt || new Date(),
              },
            },
          };
        });
      },

      getMessages: (configId) => {
        const messages = get().messages[configId] || [];
        console.log("Getting messages for configId:", configId, messages);
        return messages;
      },

      clearSession: (configId) =>
        set((state) => {
          const { [configId]: _, ...remainingSessions } = state.sessions;
          const { [configId]: __, ...remainingMessages } = state.messages;
          return {
            sessions: remainingSessions,
            messages: remainingMessages,
          };
        }),

      clearAllSessions: () =>
        set(() => ({
          sessions: {},
          messages: {},
        })),
    }),
    {
      name: "chat-storage",
      storage: createBrowserStorage(),
      partialize: (state) => {
        console.log("Persisting state:", state);
        return {
          sessions: state.sessions,
          messages: state.messages,
        };
      },
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating storage:", state);
      },
    }
  )
);
