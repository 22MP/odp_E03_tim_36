import { UserAuthDataDto } from "../../DTOs/auth/UserAuthDataDto";
import { UserDto } from "../../DTOs/users/UserDto";
/**
 * Interfejs za Auth servis.
 */
export interface IAuthService {
    /**
     * Prijavljuje korisnika sa datim korisničkim imenom i lozinkom.
     * @param korisnickoIme - Korisničko ime korisnika.
     * @param lozinka - Lozinka korisnika.
     * @returns Podatke o korisniku ako je prijava uspešna, ili prazan objekat ako nije.
     */
    prijava(korisnickoIme: string, lozinka: string): Promise<UserAuthDataDto>;

    /**
     * Registruje novog korisnika sa svim podacima.
     * @param korisnickoIme - Korisničko ime korisnika.
     * @param uloga - Uloga korisnika u sistemu.
     * @param lozinka - Lozinka korisnika.
     * @param imePrezime - Ime i prezime korisnika.
     * @param brojTelefona - Broj telefona korisnika.
     * @param slika - URL do slike korisnika (avatar).
     * @returns Podatke o korisniku ako je registracija uspešna, ili prazan objekat ako nije.
     */
    registracija(
        korisnickoIme: string,
        uloga: string,
        lozinka: string,
        imePrezime: string,
        brojTelefona: string,
        slika: string
    ): Promise<UserAuthDataDto>;

    Update(userId: number,  body: { imePrezime?: string; brojTelefona?: string },slikaRelUrl?: string):Promise<UserDto>;
}
