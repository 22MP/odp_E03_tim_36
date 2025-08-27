// primer utila: src/Services/messages/MessageMapper.ts
import { Message } from "../../Domain/models/Message";
import { MessageDto } from "../../Domain/DTOs/messages/MessageDTO";
import { CreateMessageDto } from "../../Domain/DTOs/messages/CreateMessageDto";

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

export function fromCreateDto(dto: CreateMessageDto): Message {
  // Ako klijent NE pošalje vrijemeSlanja, server će ga svakako ignorisati
  // pri INSERT-u (DB stavlja CURRENT_TIMESTAMP), ali ga ovde postavimo radi tipa.
  const vrijemeSlanja =
    dto.vrijemeSlanja && dto.vrijemeSlanja.trim()
      ? new Date(dto.vrijemeSlanja)
      : new Date();

  return new Message(
    0,
    dto.posiljalacID,
    dto.primalacID,
    dto.stanje as "sent" | "read",
    vrijemeSlanja,
    dto.tekstPoruke,
    null                      // ← sada je tip kompatibilan (Date | null)
  );
}
