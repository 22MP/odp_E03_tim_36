import type { MessageDTO } from "../../models/messages/MessageDTO";
export type ChatContextType ={
    selectedUserId: number | null;
    messages: MessageDTO[];
    selectUser: (userId: number) =>void;
    refreshConversation: ()=>Promise<void>;
}