import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { uploadAvatar } from "../../Middlewares/Upload/upload";
import jwt from "jsonwebtoken";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/users", authenticate, authorize("admin", "user"), this.korisnici.bind(this));
  }

  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const uloga = req.query.uloga as string;
      if (!uloga) {
        res.status(400).json({ success: false, message: "Parametar 'uloga' je obavezan." });
        return;
      }
      const korisniciPodaci: UserDto[] = await this.userService.getByUloga(uloga);
      // Vraća sve podatke korisnika, uključujući broj telefona, ime i prezime, sliku
      res.status(200).json(korisniciPodaci);
      return;
    } catch (error) {
      console.error("Error in korisnici:", error);
      res.status(500).json({ success: false, message: "Došlo je do greške na serveru." });

    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
