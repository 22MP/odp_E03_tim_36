// src/Domain/DTOs/messages/MessageDto.ts
export class MessageDto {
  public constructor(
    public id: number = 0,
    public posiljalacID: number = 0,
    public primalacID: number = 0,
    /** 'sent' | 'read' */
    public stanje: string = 'sent',
    /** ISO string npr. "2025-08-25T19:30:00.000Z" */
    public vrijemeSlanja: string = '',
    /** ISO string ili null */
    public vrijemeCitanja: string | null = null,
    public tekstPoruke: string = ''
  ) {}
}
