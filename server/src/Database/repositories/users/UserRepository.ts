import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

export class UserRepository implements IUserRepository {


  public async updatePartial(
    id: number,
    patch: { imePrezime?: string; brojTelefona?: string; slika?: string; }
  ): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];

    if (patch.imePrezime !== undefined) {
      fields.push("imePrezime = ?");
      values.push(patch.imePrezime);
    }
    if (patch.brojTelefona !== undefined) {
      fields.push("brojTelefona = ?");
      values.push(patch.brojTelefona);
    }
    if (patch.slika !== undefined) {
      fields.push("slika = ?");
      values.push(patch.slika);
    }

    // ako nema izmjena — vrati trenutnog korisnika
    if (fields.length === 0) {
      return this.getById(id);
    }

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

  

    try {
      const [result] = await db.execute<ResultSetHeader>(query, values);
      if(result){
      const u =await this.getById(id);
      return u; 
      }
      
    } catch (err) {
      return new User();
    }

    
  }



  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, uloga, lozinka, brojTelefona, imePrezime, slika) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.uloga,
        user.lozinka,
        user.brojTelefona,
        user.imePrezime,
        user.slikaUrl 
      ]);

      if (result.insertId) {
        return new User(
          result.insertId,
          user.korisnickoIme,
          user.uloga,
          user.lozinka,
          user.brojTelefona,
          user.imePrezime,
          user.slikaUrl 
        );
      }

      return new User();
    } catch (error) {
      console.error("UserRepository.create error:", error);
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        // Kreiraj User sa url-om slike
        
        return new User(
          row.id,
          row.korisnickoIme,
          row.uloga,
          row.lozinka,
          row.brojTelefona,
          row.imePrezime,
          row.slika as string // URL slike korisnika
        );
      }

      return new User();
    } catch (error) {
      console.error("UserRepository.getById error:", error);
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE korisnickoIme = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(
          row.id,
          row.korisnickoIme,
          row.uloga,
          row.lozinka,
          row.brojTelefona,
          row.imePrezime,
          row.slika
        );
      }

      return new User();
    } catch (error) {
      console.error("UserRepository.getByUsername error:", error);
      return new User();
    }
  }

  async getByUloga(uloga: string): Promise<User[]> {   
    try {
      const query = `SELECT * FROM users WHERE uloga = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [uloga]);
      if(rows.length>0){
        return rows.map(
        (row: any) =>
          new User(
            row.id,
            row.korisnickoIme,
            row.uloga,
            row.lozinka,
            row.brojTelefona,
            row.imePrezime,
            row.slika as string 
          )
      );
      }

      return [];
      
    } catch (error) {
      console.error("UserRepository.getByUloga error:", error);
      return [];
    }
  }


}
