import { User } from "../../models/User";


export interface IUserRepository {
  create(user: User): Promise<User>;
  getById(id: number): Promise<User>;
  getByUsername(korisnickoIme: string): Promise<User>;
  getByUloga(uloga: string): Promise<User[]>; 
  updatePartial(id:number, patch:{imePrezime?:string; brojTelefona?:string; slika?:string}):Promise<any>; 

}

