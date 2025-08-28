import type { MessageDTO } from "../../models/messages/MessageDTO";

export interface IMessageAPIService{

   /** Učitaj konverzaciju sa korisnikom otherUserId i AUTOMATSKI označi pročitano na serveru. */
  getConversation(token: string, otherUserId: number): Promise<MessageDTO[]>;

  /** (Priprema) Slanje poruke — BACK za sada nema POST rutu pa ostavljamo TODO. */
  sendMessage(token: string, receiverId: number, content: string): Promise<boolean>;

  /**Povlaci ukupan broj neprocitanih poruka koje korisnik ima */
  getUnreadTotal(token:string):Promise<number>;
  /**Povlaci broj neprocitanih poruka koje korisnik ima po konverzaciji */
  getUnreadMap(token:string):Promise<Record<number,number>>;
}