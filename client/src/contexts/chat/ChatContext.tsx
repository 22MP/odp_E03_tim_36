// client/src/contexts/chat/ChatContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { MessageDTO } from "../../models/messages/MessageDTO";
import { messageApi } from "../../api_services/messages/MessageAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { ChatContextType } from "../../types/chat/ChatContextType";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({});


  // Selekcija chata (odmah poništi badge za tog user-a u UI)
  const selectUser = useCallback((id: number) => {
    setSelectedUserId(id);
    setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
  }, []);

  // Učitavanje poruka za datog sagovornika
  const fetchMessages = useCallback(
    async (otherUserId: number) => {
      if (!token) return;
      const msgs = await messageApi.getConversation(token, otherUserId);
      setMessages(msgs ?? []);
    },
    [token]
  );

  // Slanje poruke + osvežavanje liste poruka i bedževa
  const sendMessage = useCallback(
    async (receiverId: number, content: string) => {
      if (!token) return;
      await messageApi.sendMessage(token, receiverId, content);
      await fetchMessages(receiverId);
      await refreshUnreadMap();
    },
    [token, fetchMessages]
  );

  // Normalizacija ključeva iz API-ja (string → number)
  const refreshUnreadMap = useCallback(async () => {
    if (!token) {
      setUnreadMap({});
      return;
    }
    const raw = await messageApi.getUnreadMap(token); // tip može biti Record<string, number>

    const normalized: Record<number, number> = {};
    Object.entries(raw ?? {}).forEach(([k, v]) => {
      const id = Number(k);
      if (!Number.isNaN(id)) normalized[id] = Number(v ?? 0);
    });

    setUnreadMap(normalized);
  }, [token]);

  // Wrapper koji traži poruke za trenutno selektovanog sagovornika
  const refreshConversation = useCallback(async () => {
    if (selectedUserId == null) {
      setMessages([]);
      return;
    }
    await fetchMessages(selectedUserId);
  }, [fetchMessages, selectedUserId]);

  // ====== efekti ======

  // Polling za bedževe
  useEffect(() => {
    refreshUnreadMap();
    const id = setInterval(refreshUnreadMap, 10_000);
    return () => clearInterval(id);
  }, [refreshUnreadMap]);

  // Kad promeniš selekciju – učitaj razgovor
  useEffect(() => {
    refreshConversation();
  }, [refreshConversation]);

  return (
    <ChatContext.Provider
      value={{
        selectedUserId,
        messages,
        selectUser,
        fetchMessages,
        sendMessage,
        refreshConversation, // <- sada postoji u scope-u
        unreadMap,
        refreshUnreadMap,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};
