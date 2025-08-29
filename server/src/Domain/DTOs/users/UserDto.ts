export class UserDto {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = "",
    public uloga: string = "user",
    public brojTelefona: string = "",
    public imePrezime: string = "",
    public slikaUrl?: string  // URL slike korisnika
  ) {}
}
