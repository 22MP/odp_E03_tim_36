// DTO za podatke o autentifikovanom korisniku
export class UserAuthDataDto {
   public constructor(
        public id: number = 0,
        public korisnickoIme: string = '',
        public uloga: string = 'user',
        public slikaUrl: string = '',
        public brojTelefona: string = '',
        public imePrezime: string = ''
    ) {}
}