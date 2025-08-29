// server/src/Services/message/MessageService.ts
import { IMessageService } from "../../Domain/services/messages/IMessageService";
import { IMessageRepository } from "../../Domain/repositories/messages/IMessageRepository";
import { MessageDto } from "../../Domain/DTOs/messages/MessageDTO";
import { Message } from "../../Domain/models/Message";

export class MessageService implements IMessageService {
  constructor(private readonly repo: IMessageRepository) { }

  /**
   * Kreira i šalje novu poruku: senderId -> receiverId.
   * DB automatski upisuje vrijemeSlanja (CURRENT_TIMESTAMP),
   * repo.create() vraća kompletan red, pa ovde samo mapiramo u DTO.
   */
  public async sendMessage(
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<MessageDto> {
    
    const text = (content ?? "").trim();
    if (!senderId || !receiverId) {
      throw new Error("Neispravni ID-jevi korisnika.");
    }
    if (text.length === 0) {
      throw new Error("Tekst poruke je prazan.");
    }


    const entity = new Message(
      0,
      senderId,
      receiverId,
      "sent",
      new Date(),
      text,
      null
    );


    const saved = await this.repo.create(entity);


    return new MessageDto(
      saved.id,
      saved.posiljalacID,
      saved.primalacID,
      saved.stanje as "sent" | "read",
      new Date(saved.vrijemeSlanja).toISOString(),
      saved.vrijemeCitanja ? new Date(saved.vrijemeCitanja).toISOString() : null,
      saved.tekstPoruke
    );

  }

  /**
   * Otvara chat između prijavljenog korisnika (currentUserId) i sagovornika (otherUserId).
   * 1) čita istoriju (sortirano po vrijemeSlanja),
   * 2) mapira u DTO,
   * 3) označava poruke kao pročitane (markConversationAsRead).
   */
  public async openChat(
    currentUserId: number,
    otherUserId: number
  ): Promise<MessageDto[]> {
    // 1) Učitavanje istorije
    const rows: Message[] = await this.repo.getByResIDSenID(
      currentUserId,
      otherUserId
    );

    // 2) Mapiranje u DTO (vreme → ISO string)
    const messages: MessageDto[] = rows.map(m => new MessageDto(
      m.id,
      m.posiljalacID,
      m.primalacID,
      m.stanje as "sent" | "read",
      new Date(m.vrijemeSlanja).toISOString(),
      m.vrijemeCitanja ? new Date(m.vrijemeCitanja).toISOString() : null,
      m.tekstPoruke
    ));


    // 3) Označi sve poruke koje je currentUser primio od otherUser kao pročitane
    await this.repo.markConversationAsRead(otherUserId, currentUserId);

    return messages;
  }

  

  public async unreadCountsMapForUser(meId: number): Promise<Record<number, number>> {
    return this.repo.unreadCountsMapForUser(meId);
  }


  public async unreadCountTotal(userId: number): Promise<number> {
    return this.repo.unreadCountTotal(userId);
  }
}
