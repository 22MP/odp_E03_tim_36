import type { MessageDTO } from "../../models/messages/MessageDTO";

export type ChatContextType = {
  selectedUserId: number | null;
  messages: MessageDTO[];
  selectUser: (userId: number) => void;

  // učitavanje svih poruka za datog korisnika
  fetchMessages: (otherUserId: number) => Promise<void>;

  // slanje nove poruke
  sendMessage: (receiverId: number, content: string) => Promise<void>;

  // refresh cele konverzacije (korisno na promenu selekcije)
  refreshConversation: () => Promise<void>;

  // mapa nepročitanih po userId
  unreadMap: Record<number, number>;

  // refresh mape badge-eva (polling i ručno)
  refreshUnreadMap: () => Promise<void>;
};
