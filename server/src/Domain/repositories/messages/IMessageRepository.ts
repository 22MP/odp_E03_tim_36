import { Message } from "../../models/Message";

/**
 * Repository interface za upravljanje porukama
 * Definiše operacije za rad sa porukama u bazi podataka
 */
export interface IMessageRepository {
	/**
	 * Kreira novu poruku u bazi podataka
	 * @param message - Objekat poruke za kreiranje
	 * @returns Promise koji vraća kreiranu poruku sa dodeljenim ID-om
	 */
	create(message: Message): Promise<Message>;

	/**
	 * Pronalazi poruke između dva korisnika
	 * @param resID - ID korisnika koji prima poruku
	 * @param senID - ID korisnika koji šalje poruku
	 * @returns Promise koji vraća niz poruka između korisnika
	 */
	getByResIDSenID(resID: number, senID: number): Promise<Message[]>;
}
