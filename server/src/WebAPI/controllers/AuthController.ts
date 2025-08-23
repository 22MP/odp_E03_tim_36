import { Request, Response, Router } from 'express';
import { IAuthService } from '../../Domain/services/auth/IAuthService';
import { validacijaPodatakaAuth } from '../validators/auth/RegisterValidator';
import jwt from "jsonwebtoken";
import { uploadAvatar } from '../../Middlewares/uploadAvatar/UploadAvatar';

export class AuthController {
  private router: Router;
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authService = authService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.prijava.bind(this));
    // Middleware za upload slike - mora biti pre handlera
    this.router.post('/auth/register', uploadAvatar.single("slika"), this.registracija.bind(this));
  }

  /**
   * Prijava korisnika
   */
  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { korisnickoIme, lozinka } = req.body;
      const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      const result = await this.authService.prijava(korisnickoIme, lozinka);

      if (result.id !== 0) {
        // JWT token sa podacima o korisniku
        const token = jwt.sign(
          { 
            id: result.id, 
            korisnickoIme: result.korisnickoIme, 
            uloga: result.uloga
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        res.status(200).json({success: true, message: 'Uspešna prijava', data: token});
      } else {
        res.status(401).json({success: false, message: "Neispravno korisničko ime ili lozinka"});
      }
    } catch (error) {
      res.status(500).json({success: false, message: "Došlo je do greške na serveru."});
    }
  }

  /**
   * Registracija korisnika (sa slikom)
   */
  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      // Polja iz forme
      const { korisnickoIme, lozinka, uloga, imePrezime, telefon } = req.body;
      const rezultat = validacijaPodatakaAuth(korisnickoIme, lozinka);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: "Korisničko ime i lozinka su obavezni." });
        return;
      }

      // Ako je poslata slika, sačuvaj url
      let avatarUrl = "";
      if (req.file) {
        avatarUrl = "/uploads/avatars/" + req.file.filename;
      }

      const result = await this.authService.registracija(
        korisnickoIme,
        uloga,
        lozinka,
        imePrezime,
        telefon,
        avatarUrl
      );
      
      if (result.id !== 0) {
        // JWT token sa podacima o korisniku
        const token = jwt.sign(
          { 
            id: result.id, 
            korisnickoIme: result.korisnickoIme, 
            uloga: result.uloga,
            avatar: avatarUrl
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        res.status(201).json({success: true, message: "Uspešna registracija", data: token});
      } else {
        res.status(401).json({success: false, message: "Registracija nije uspela. Korisničko ime već postoji." });
      }
    } catch (error) {
      res.status(500).json({success: false, message: "Došlo je do greške na serveru."});
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}