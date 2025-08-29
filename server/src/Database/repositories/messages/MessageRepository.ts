import { IMessageRepository } from "../../../Domain/repositories/messages/IMessageRepository";
import { Message } from "../../../Domain/models/Message";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class MessageRepository implements IMessageRepository {

  async create(message: Message): Promise<Message> {
    try {
      const insertSql = `
        INSERT INTO messages (posiljalacID, primalacID, stanje, tekstPoruke)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(insertSql, [
        message.posiljalacID,
        message.primalacID,
        message.stanje,        
        message.tekstPoruke,
      ]);

      if (!result.insertId) {
        return new Message();
      }


      const selectSql = `
        SELECT id, posiljalacID, primalacID, stanje, vrijemeSlanja, vrijemeCitanja, tekstPoruke
          FROM messages
         WHERE id = ?
         LIMIT 1
      `;
      const [rows] = await db.execute<RowDataPacket[]>(selectSql, [result.insertId]);
      const row = rows[0];
      if (!row) return new Message();

      return new Message(
        row.id,
        row.posiljalacID,
        row.primalacID,
        row.stanje,
        new Date(row.vrijemeSlanja), 
        row.tekstPoruke
      );
    } catch {
      return new Message();
    }
  }

  /**
   * Vraća poruke između dva korisnika (u oba smjera), sortirano po vremenu slanja.
   */
  async getByResIDSenID(resID: number, senID: number): Promise<Message[]> {
    try {
      const sql = `
        SELECT id, posiljalacID, primalacID, stanje, vrijemeSlanja, vrijemeCitanja, tekstPoruke
          FROM messages
         WHERE (posiljalacID = ? AND primalacID = ?)
            OR (posiljalacID = ? AND primalacID = ?)
         ORDER BY vrijemeSlanja ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [senID, resID, resID, senID]);
      if(rows.length>0){
        return rows.map(
        (row) =>
          new Message(
            row.id,
            row.posiljalacID,
            row.primalacID,
            row.stanje,
            new Date(row.vrijemeSlanja), 
            row.tekstPoruke
          )
      );
      }
      return [];
      
    } catch {
      return [];
    }
  }

  /**
   * Oznaci jednu poruku kao procitanu – postavi stanje 'read' i vrijemeCitanja = NOW().
   * Dozvoljeno samo ako je reader stvarni primalac i ako je poruka bila 'sent'.
   */
  async markAsRead(messageId: number, readerId: number): Promise<void> {
    try {
      const sql = `
        UPDATE messages
           SET stanje = 'read',
               vrijemeCitanja = NOW()
         WHERE id = ?
           AND primalacID = ?
           AND stanje = 'sent'
      `;
      await db.execute<ResultSetHeader>(sql, [messageId, readerId]);
      return;
    } catch {
      return;
    }
  }

  /**
   * Označi SVE poruke kao pročitane u razgovoru gdje je "senderId -> readerId".
   * (tj. sve poruke koje je reader primio od sender-a, a još su 'sent')
   */
  async markConversationAsRead(senderId: number, readerId: number): Promise<void> {
    try {
      const sql = `
        UPDATE messages
           SET stanje = 'read',
               vrijemeCitanja = NOW()
         WHERE primalacID = ?
           AND posiljalacID = ?
           AND stanje = 'sent'
      `;
      await db.execute<ResultSetHeader>(sql, [readerId, senderId]);
      return;
    } catch {
      return;
    }
  }

  /**
   * Ukupno nepročitanih poruka za korisnika (primalac = userId i stanje='sent').
   * */
  async unreadCountTotal(userId: number): Promise<number> {
    try {
      const sql = `
        SELECT COUNT(*) AS cnt
          FROM messages
         WHERE primalacID = ?
           AND stanje = 'sent'
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [userId]);
      const row = rows[0] as any;
      return Number(row?.cnt ?? 0);
    } catch {
      return 0;
    }
  }

 

  async unreadCountsMapForUser(meId: number): Promise<Record<number, number>> {
    try {
      const sql = `
        SELECT posiljalacID AS otherUserId, COUNT(*) AS cnt
          FROM messages
         WHERE primalacID = ?
           AND stanje = 'sent'
         GROUP BY posiljalacID
      `;
      const [rows] = await db.execute<RowDataPacket[]>(sql, [meId]);
      const out: Record<number, number> = {};
      for (const r of rows as any[]) {
        out[Number(r.otherUserId)] = Number(r.cnt);
      }
      return out;
    } catch {
      return {};
    }
  }
}
