import { Message } from "../../models/Message";

/**
 * Repository interfejs za upravljanje porukama.
 * Definiše operacije za rad sa entitetom Message u bazi podataka.
 * 
 * SRP: Svaka metoda je zadužena za jednu jasno definisanu akciju nad porukama.
 * ISP: Interfejs je fokusiran samo na metode koje se odnose na Message entitet.
 */
export interface IMessageRepository {
	/**
	 * Kreira novu poruku u bazi podataka.
	 * 
	 * @param message - Objekat poruke koji sadrži podatke o pošiljaocu, primaocu i sadržaju.
	 * @returns Promise koji vraća kreiranu poruku sa dodeljenim ID-om iz baze,
	 *          ili praznu instancu u slučaju neuspeha.
	 */
	create(message: Message): Promise<Message>;

	/**
	 * Pronalazi sve poruke između dva korisnika (bidirekciona konverzacija).
	 * 
	 * @param resID - ID korisnika koji prima poruku (receiver).
	 * @param senID - ID korisnika koji šalje poruku (sender).
	 * @returns Promise koji vraća niz poruka sortiranih po vremenu.
	 */
	getByResIDSenID(resID: number, senID: number): Promise<Message[]>;

	/**
	 * Obeležava jednu poruku kao pročitanu.
	 * 
	 * @param messageId - ID poruke koja treba da bude označena.
	 * @param readerId - ID korisnika koji označava poruku kao pročitanu (mora biti primalac).
	 * @returns Promise koji vraća true ako je poruka uspešno ažurirana, false ako nije.
	 */
	markAsRead(messageId: number, readerId: number): Promise<void>;

	/**
	 * Obeležava sve poruke u konverzaciji između dva korisnika kao pročitane.
	 * 
	 * @param senderId - ID korisnika koji je slao poruke (pošiljalac).
	 * @param readerId - ID korisnika koji otvara chat i čita poruke (primalac).
	 * @returns Promise koji vraća true ako su poruke uspešno ažurirane, false ako nije.
	 */
	markConversationAsRead(senderId: number, readerId: number): Promise<void>;

	/**
	 * Računa ukupan broj nepročitanih poruka za jednog korisnika.
	 * 
	 * @param userId - ID korisnika za koga se proverava broj nepročitanih poruka.
	 * @returns Promise koji vraća broj nepročitanih poruka.
	 */
	unreadCountTotal(userId: number): Promise<number>;


	

	/**otherUserId -> count za sve koji su mi slali. */
  unreadCountsMapForUser(meId: number): Promise<Record<number, number>>;

}
