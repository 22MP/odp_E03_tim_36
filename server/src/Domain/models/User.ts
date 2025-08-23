export class User {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = '',
    public uloga: string = 'user',
    public lozinka: string = '',
    public brojTelefona: string = '',
    public imePrezime: string = '',
    public slika: string = '' // URL do slike
  ) {}
}