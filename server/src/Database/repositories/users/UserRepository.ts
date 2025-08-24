import { IUserRepository } from "../../../Domain/repositories/users/IUserRepository";
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class UserRepository implements IUserRepository {
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
  user.slikaUrl // URL slike korisnika
      ]);

      if (result.insertId) {
        return new User(
          result.insertId,
          user.korisnickoIme,
          user.uloga,
          user.lozinka,
          user.brojTelefona,
          user.imePrezime,
          user.slikaUrl // URL slike korisnika
        );
      }

      return new User();
    } catch (error) {
      console.error("UserRepository.create error:", error);
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async getByUloga(uloga: string): Promise<User[]> {   // ✅ restored method
    try {
      const query = `SELECT * FROM users WHERE uloga = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [uloga]);

      return rows.map(
        (row: any) =>
          new User(
            row.id,
            row.korisnickoIme,
            row.uloga,
            row.lozinka,
            row.brojTelefona,
            row.imePrezime,
            row.slika as string // URL slike korisnika
          )
      );
    } catch (error) {
      console.error("UserRepository.getByUloga error:", error);
      throw error;
    }
  }
}
