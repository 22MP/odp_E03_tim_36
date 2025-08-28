
export class MessageDto {
  public constructor(
    public id: number = 0,
    public posiljalacID: number = 0,
    public primalacID: number = 0,
    public stanje: string = 'sent',
    public vrijemeSlanja: string = '',
    public vrijemeCitanja: string | null = null,
    public tekstPoruke: string = ''
  ) {}
}
