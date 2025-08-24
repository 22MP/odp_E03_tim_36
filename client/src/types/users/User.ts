// Interfejs za korisnika
// Interfejs za korisnika
export interface User {
  id: number;
  korisnickoIme: string;
  lozinka: string;
  brojTelefona: string;
  imePrezime: string;
  slikaUrl: string; // URL slike korisnika
  uloga: string;
  slika?: File; // Fajl slike (samo za upload)
}