import { UserAuthDataDto } from "../../Domain/DTOs/auth/UserAuthDataDto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import bcrypt from "bcryptjs";

export class AuthService implements IAuthService {
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);

  public constructor(private userRepository: IUserRepository) {}

  async prijava(korisnickoIme: string, lozinka: string): Promise<UserAuthDataDto> {
    const user = await this.userRepository.getByUsername(korisnickoIme);

      if (user.id !== 0 && await bcrypt.compare(lozinka, user.lozinka)) {
        // Vraća DTO sa svim podacima
        return new UserAuthDataDto(
          user.id,
          user.korisnickoIme,
          user.uloga,
          user.slikaUrl,
          user.brojTelefona,
          user.imePrezime
        
        );
      }

      return new UserAuthDataDto(); // Neispravno korisničko ime ili lozinka
  }

  async registracija(
    korisnickoIme: string,
    uloga: string,
    lozinka: string,
    imePrezime: string,
    brojTelefona: string,
    slikaUrl: string // url slike
  ): Promise<UserAuthDataDto> {
    const existingUser = await this.userRepository.getByUsername(korisnickoIme);
    
    if (existingUser.id !== 0) {
      return new UserAuthDataDto(); // Korisnik već postoji
    }

    // Hash-ujemo lozinku pre čuvanja
    const hashedPassword = await bcrypt.hash(lozinka, this.saltRounds);

    // Kreiraj novog korisnika sa url-om slike
    const newUser = await this.userRepository.create(
      new User(0, korisnickoIme, uloga, hashedPassword, brojTelefona, imePrezime, slikaUrl)
    );

    if (newUser.id !== 0) {
      // Vraća DTO sa svim podacima
      return new UserAuthDataDto(
        newUser.id,
        newUser.korisnickoIme,
        newUser.uloga,
        newUser.slikaUrl,
        newUser.brojTelefona,
        newUser.imePrezime
      );
    }
    return new UserAuthDataDto(); // Registracija nije uspela
  }


  public async Update(
  userId: number,
  body: { imePrezime?: string; brojTelefona?: string },
  slikaRelUrl?: string
) :Promise<UserDto>{
  const patch: any = {};
  if (typeof body.imePrezime !== "undefined")   patch.imePrezime   = body.imePrezime.trim();
  if (typeof body.brojTelefona !== "undefined") patch.brojTelefona = body.brojTelefona.trim();
  if (typeof slikaRelUrl !== "undefined")       patch.slika        = slikaRelUrl; // kolona 'slika'

  // očekujemo da repo ima updatePartial(id, patch)
  const updated = await this.userRepository.updatePartial(userId, patch);

  
  return {
    id: updated.id,
    korisnickoIme: updated.korisnickoIme,
    uloga: updated.uloga,
    imePrezime: updated.imePrezime,
    brojTelefona: updated.brojTelefona,
    slikaUrl: updated.slikaUrl, // relativan URL iz baze
  };
}
}