import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";

export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}

  async getByUloga(uloga: string): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getByUloga(uloga);
    const korisniciDto: UserDto[] = korisnici.map(
      // Mapira korisnika na DTO sa svim podacima
      (user) => new UserDto(
        user.id,
        user.korisnickoIme,
        user.uloga,
        user.brojTelefona,
        user.imePrezime,
        user.slikaUrl
      )
    );
    return korisniciDto;
  }
}
