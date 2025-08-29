// API servis za poruke
import axios from "axios";
import type { MessageDTO } from "../../models/messages/MessageDTO";
import type { IMessageAPIService } from "./IMessageAPIService";

// Osnovni URL za API
const API_URL = import.meta.env.VITE_API_URL;

// Tipovi odgovora sa API-a
type ApiListResponse<T> = { success: boolean; data: T };
type ApiItemResponse<T> = { success: boolean; data: T };

// Normalizuje podatke poruke iz API-a
const normalize = (m: any): MessageDTO => ({
    id: m.id,
    posiljalacID: m.posiljalacID,
    primalacID: m.primalacID,
    tekstPoruke: m.tekstPoruke,
    stanje: m.stanje,
    vrijemeSlanja: m.vrijemeSlanja ?? m.vrijeme ?? m.time,
});


export const messageApi: IMessageAPIService = {
    // Dohvati sve poruke iz konverzacije
    async getConversation(token: string, otherUserId: number): Promise<MessageDTO[]> {
        const res = await axios.get<ApiListResponse<any[]>>(
            `${API_URL}messages/conversation/${otherUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return (res.data.data ?? []).map(normalize);
    },

    // Pošalji novu poruku
    async sendMessage(token: string, receiverId: number, content: string): Promise<boolean> {
        try {
            const res = await axios.post<ApiItemResponse<MessageDTO>>(
                `${API_URL}messages`,
                { receiverId, content: content.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    validateStatus: (s) => s >= 200 && s < 300,
                }
            );
            if ((res.data && (res.data as any).success === true) || res.status === 200 || res.status === 201)
                return true;
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    // Ukupan broj nepročitanih poruka
    async getUnreadTotal(token: string): Promise<number> {
        const { data } = await axios.get<ApiItemResponse<number>>(
            `${API_URL}messages/unread/total`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                validateStatus: (s) => s >= 200 && s < 300,
            }
        );
        return data.data ?? 0;
    },

    // Mapa nepročitanih poruka po korisniku
    async getUnreadMap(token: string): Promise<Record<number,number>> {
        const {data} = await axios.get<ApiItemResponse<Record<number, number>>>(
            `${API_URL}messages/unread/map`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                },
                validateStatus: (s)=> s>=200 && s<300,
            }
        );
        return data.data ?? {};
    }
};

