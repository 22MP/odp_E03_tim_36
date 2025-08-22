import { UserDto } from "../../DTOs/users/UserDto";

export interface IUserService {
  /**
   * Vraća listu korisnika sa datom ulogom.
   * @param uloga - Uloga korisnika za pretragu
   * @returns Podatke o korisnicima u vidu liste.
   */
  getByUloga(uloga: string): Promise<UserDto[]>;
}