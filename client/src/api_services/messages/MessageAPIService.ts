import axios from "axios";
import type { MessageDTO } from "../../models/messages/MessageDTO";
import type { IMessageAPIService } from "./IMessageAPIService";

const API_URL = import.meta.env.VITE_API_URL;

type ApiListResponse<T> = { success: boolean; data: T };
type ApiItemResponse<T> = { success: boolean; data: T };

const normalize = (m: any): MessageDTO => ({
    id: m.id,
    posiljalacID: m.posiljalacID,
    primalacID: m.primalacID,
    tekstPoruke: m.tekstPoruke,
    stanje: m.stanje,
    vrijemeSlanja: m.vrijemeSlanja ?? m.vrijeme ?? m.time, // prihvati staro/novo ime
});

export const messageApi: IMessageAPIService = {
    async  getConversation(token: string, otherUserId: number): Promise<MessageDTO[]> {
        const res = await axios.get<ApiListResponse<any[]>>(
            `${API_URL}messages/conversation/${otherUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return(res.data.data ?? []).map(normalize);
    },

    async sendMessage(token: string, receiverId: number, content: string): Promise<boolean> {
        try {
            const res = await axios.post<ApiItemResponse<MessageDTO>>(
                `${API_URL}messages`,
                { receiverId, content: content.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                        // "Content-Type": "application/json",
                    },
                    // ako backend vraća 201, smatramo uspjeh i za 200 i za 201
                    validateStatus: (s) => s >= 200 && s < 300,
                }
            );
            // uspjeh ako API kaže success === true ili je status 200/201
            if ((res.data && (res.data as any).success === true) || res.status === 200 || res.status === 201)
                return true;

            return false;

        } catch (err) {
            console.log(err);
            return false;
        }
    }




}

