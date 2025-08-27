export class Message {
  public constructor(
    public id: number = 0,
    public posiljalacID: number = 0,
    public primalacID: number = 0,
    public stanje: "sent" | "read" = "sent",
    /** DATETIME (slanje) iz baze – u kodu ga držimo kao JS Date */
    public vrijemeSlanja: Date = new Date(),
    /** Tekst poruke */
    public tekstPoruke: string = "",
    /** DATETIME (čitanje) može biti NULL u bazi → Date | null u kodu */
    public vrijemeCitanja: Date | null = null
  ) {}
}
