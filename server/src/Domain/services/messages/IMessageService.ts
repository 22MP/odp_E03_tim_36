import { MessageDto } from "../../DTOs/messages/MessageDTO";

export interface IMessageService{
    /* Ucitaj konverzaciju i oznaci sve poruke kao procitane */
    openChat(receiverId: number, senderId:number):Promise<MessageDto[]>;

    /*Slanje poruke*/
    sendMessage(senderId: number, receiverId:number, content:string):Promise<MessageDto>;

    /** Ukupan broj nepročitanih. */
  unreadCountTotal(userId: number): Promise<number>;


  /** Mapa: otherUserId -> count za sve koji su mi slali. */
  unreadCountsMapForUser(meId: number): Promise<Record<number, number>>;
}