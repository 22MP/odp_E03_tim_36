import type { AuthResponse } from "../../types/auth/AuthResponse";

/**
 * Interfejs za Auth API servis.
 */
export interface IAuthAPIService {
  /**
   * Prijava korisnika. Šalje korisničko ime i lozinku kao stringove.
   */
  prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse>;

  /**
   * Registracija korisnika. Sva polja, uključujući sliku, šalju se kao FormData.
   */
  registracija(formData: FormData): Promise<AuthResponse>;
}