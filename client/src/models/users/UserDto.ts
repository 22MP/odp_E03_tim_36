// DTO za podatke o korisniku
export interface UserDto {
    id: number;
    korisnickoIme: string;
    uloga: string;
    brojTelefona: string;
    imePrezime: string;
    slikaUrl: string; // URL slike korisnika
}