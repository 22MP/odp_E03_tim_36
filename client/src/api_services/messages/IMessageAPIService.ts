import type { MessageDTO } from "../../models/messages/MessageDTO";

export interface IMessageAPIService{

   /** Učitaj konverzaciju sa korisnikom otherUserId i AUTOMATSKI označi pročitano na serveru. */
  getConversation(token: string, otherUserId: number): Promise<MessageDTO[]>;

  /** (Priprema) Slanje poruke — BACK za sada nema POST rutu pa ostavljamo TODO. */
  sendMessage?(token: string, receiverId: number, content: string): Promise<boolean>;
}