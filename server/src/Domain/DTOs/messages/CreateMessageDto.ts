// src/Domain/DTOs/messages/CreateMessageDto.ts
export class CreateMessageDto {
  public constructor(
    public posiljalacID: number = 0,
    public primalacID: number = 0,
    /** 'sent' | 'read' */
    public stanje: string = 'sent',
    /** ISO 8601 string, server će ga pretvoriti u DATETIME */
    public vrijemeSlanja: string = '',
    public tekstPoruke: string = ''
  ) {}
}
