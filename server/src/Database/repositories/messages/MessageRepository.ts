import { IMessageRepository } from "../../../Domain/repositories/messages/IMessageRepository";
import { Message } from "../../../Domain/models/Message";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../connection/DbConnectionPool";

export class MessageRepository implements IMessageRepository {
	async create(message: Message): Promise<Message> {
		try {
			const query = `
				INSERT INTO messages (posiljalacID, primalacID, stanje, vrijeme, tekstPoruke)
				VALUES (?, ?, ?, ?, ?)
			`;
					const [result] = await db.execute<ResultSetHeader>(query, [
						message.posiljalacID,
						message.primalacID,
						message.stanje,
						message.vrijeme,
						message.tekstPoruke
					]);
					if (result.insertId) {
                        // Vraćamo novu poruku sa dodeljenim ID-om
						return new Message(
                            result.insertId,
                            message.posiljalacID,
                            message.primalacID,
                            message.stanje,
                            message.vrijeme,
                            message.tekstPoruke
                        );
						
					}
                    // Vraćamo prazan objekat ako kreiranje nije uspešno
					return new Message();
		} catch {
			return new Message();
		}
	}

	async getByResIDSenID(resID: number, senID: number): Promise<Message[]> {
		try {
			const query = `
				SELECT * FROM messages
				WHERE (posiljalacID = ? AND primalacID = ?) OR (posiljalacID = ? AND primalacID = ?)
				ORDER BY vrijeme ASC
			`;
			const [rows] = await db.execute<RowDataPacket[]>(query, [senID, resID, resID, senID]);
			return rows.map(
				(row) => new Message(row.id, row.posiljalacID, row.primalacID, row.stanje, row.vrijeme, row.tekstPoruke)
			);
		} catch{
			return [];
		}
	}
}
