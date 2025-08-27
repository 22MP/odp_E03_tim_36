import { Request, Response, Router } from "express";
import { IMessageService } from "../../Domain/services/messages/IMessageService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";

export class MessageController {
    private router: Router;

    public constructor(private readonly service: IMessageService) {
        this.router = Router();
        this.initialize();
    }

    private initialize(): void {
        this.router.get("/messages/conversation/:userId", authenticate, this.openChat.bind(this));
        this.router.post("/messages", authenticate, this.sendMessage.bind(this));

    }

    private async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const senderId = (req as any).user?.id as number;   // iz JWT-a (authenticate middleware)
            const { receiverId, content } = req.body as { receiverId?: number; content?: string };

            // Minimalna validacija 
            if (!senderId || !receiverId || typeof receiverId !== "number") {
                res.status(400).json({ success: false, message: "Neispravan korisnik." }); return;
            }
            if (!content || !content.trim() || content.length > 2000) {
                res.status(400).json({ success: false, message: "Tekst poruke je obavezan (≤2000)." }); return;
            }

            const dto = await this.service.sendMessage(senderId, receiverId, content.trim());
            if (dto.id === 0) {
                res.status(500).json({ success: false, message: "Upis poruke nije uspeo." }); return;
            }
            res.status(201).json({ success: true, data: dto });
        } catch (err) {
            res.status(500).json({ success: false, message: "Greška na serveru." });
        }
    }

    private async openChat(req: Request, res: Response): Promise<void> {
        try {
            const otherId = Number(req.params.userId);
            const me = (req as any).user?.id as number;

            if (!otherId || !me) {
                res.status(400).json({ success: false, message: "Neispravan korisnik" });
                return;
            }

            const messages = await this.service.openChat(me, otherId);
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    public getRouter(): Router { return this.router; }
}