import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ostale metode, npr. /api/v1/user/1 <--- user po ID-ju 1
    this.router.get("/users", authenticate, authorize("admin","user"), this.korisnici.bind(this));
  }

  /**
   * GET /api/v1/users?uloga=admin
   * Vraća korisnike po ulozi
   */
  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const uloga = req.query.uloga as string;
      if (!uloga) {
        res.status(400).json({ success: false, message: "Parametar 'uloga' je obavezan." });
        return;
      }
      const korisniciPodaci: UserDto[] = await this.userService.getByUloga(uloga);
      res.status(200).json(korisniciPodaci);
      return;
    } catch (error) {
      console.error("Error in korisnici:", error);
      res.status(500).json({ success: false, message: "Došlo je do greške na serveru." });
    }
  }

  /**
   * Getter za router
   */
  public getRouter(): Router {
    return this.router;
  }
}
