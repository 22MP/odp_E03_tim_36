// client/src/contexts/chat/ChatContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { MessageDTO } from "../../models/messages/MessageDTO";
import { messageApi } from "../../api_services/messages/MessageAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { ChatContextType } from "../../types/chat/ChatContextType";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);

  const refreshConversation = useCallback(async () => {
    if (!token || !selectedUserId) { setMessages([]); return; }
    const data = await messageApi.getConversation(token, selectedUserId);
    setMessages(data);
  }, [token, selectedUserId]);

  const selectUser = (userId: number) => setSelectedUserId(userId);

  useEffect(() => {
    // kad god promeniš izabranog korisnika, povuci poruke
    refreshConversation();
  }, [refreshConversation]);

  return (
    <ChatContext.Provider value={{ selectedUserId, messages, selectUser, refreshConversation }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat mora biti korišćen unutar <ChatProvider>.");
  return ctx;
};
