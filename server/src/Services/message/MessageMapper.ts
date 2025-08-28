// primer utila: src/Services/messages/MessageMapper.ts
import { Message } from "../../Domain/models/Message";
import { MessageDto } from "../../Domain/DTOs/messages/MessageDTO";


export function toMessageDto(m: Message): MessageDto {
  return new MessageDto(
    m.id,
    m.posiljalacID,
    m.primalacID,
    m.stanje,
    new Date(m.vrijemeSlanja).toISOString(),
    m.vrijemeCitanja ? new Date(m.vrijemeCitanja).toISOString() : null,
    m.tekstPoruke
  );
}

