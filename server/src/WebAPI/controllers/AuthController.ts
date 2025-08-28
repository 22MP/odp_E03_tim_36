import { Request, Response, Router } from 'express';
import { IAuthService } from '../../Domain/services/auth/IAuthService';
import { validacijaPodatakaAuth } from '../validators/auth/LogInValidator';
import jwt from "jsonwebtoken";
import {uploadAvatar} from "../../Middlewares/Upload/upload" 
import { validacijaPodatakaRegistracija } from '../validators/auth/RegValidator';
import { authenticate } from '../../Middlewares/authentification/AuthMiddleware';
import { validacijaPodatakaIzmjene } from '../validators/auth/EditValidator';
import { Message } from '../../Domain/models/Message';

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
    this.router.patch("/auth/me", authenticate, uploadAvatar.single("slika"), this.patchMe.bind(this));
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
            uloga: result.uloga,
            slikaUrl: result.slikaUrl, 
            brojTelefona: result.brojTelefona, 
            imePrezime:result.imePrezime 
          }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

        res.status(200).json({success: true, message: 'Uspešna prijava', data: token});
      } else {
        res.status(401).json({success: false, message: "Neispravno korisničko ime ili lozinka"});
      }
    } catch (error) {
      res.status(500).json({success: false, message: "Došlo je do greške na serveru."});
    }
  }

  private async patchMe(req: Request, res: Response) {
    try {
      const meId = (req as any).user.id as number;
      const { imePrezime, brojTelefona } = (req.body ?? {}) as { imePrezime?: string; brojTelefona?: string; };
      const slikaUrl = req.file ? `/uploads/slike/${req.file.filename}` : undefined;

      const rezultat = validacijaPodatakaIzmjene(imePrezime, brojTelefona, slikaUrl);
      if(!rezultat.uspesno){
        res.status(400).json({success:false, message:rezultat.poruka});
      }
  
      const dto = await this.authService.Update(meId, { imePrezime, brojTelefona }, slikaUrl);
  
      
      const token = jwt.sign(
        {
          id: dto.id,
          korisnickoIme: dto.korisnickoIme,
          uloga: dto.uloga,
          slikaUrl: dto.slikaUrl ?? null,
          brojTelefona: dto.brojTelefona ?? null,
          imePrezime: dto.imePrezime ?? null,
        },
        process.env.JWT_SECRET ?? "",
        { expiresIn: "6h" }
      );
  
      return res.json({ success: true, data: dto, token }); 
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e?.message ?? "Greška pri izmjeni profila" });
    }
  }
  

  /**
   * Registracija korisnika (sa slikom)
   */
  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      // Polja iz forme
      const { korisnickoIme, lozinka, uloga, imePrezime, telefon } = req.body;
      const rezultat = validacijaPodatakaRegistracija(korisnickoIme, lozinka, imePrezime, telefon, uloga, req.file);

      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: "Korisničko ime i lozinka su obavezni." });
        return;
      }

      // Ako je poslata slika, sačuvaj url slike
      let slikaUrl = "";
      if (req.file) {
        slikaUrl = "/uploads/slike/" + req.file.filename;
      }

      // Registracija korisnika
      const result = await this.authService.registracija(
        korisnickoIme,
        uloga,
        lozinka,
        imePrezime,
        telefon,
        slikaUrl
      );
      
      if (result.id !== 0) {
        // JWT token sa podacima o korisniku
        const token = jwt.sign(
          { 
            id: result.id, 
            korisnickoIme: result.korisnickoIme, 
            uloga: result.uloga,
            slikaUrl: result.slikaUrl, 
            brojTelefona: result.brojTelefona, 
            imePrezime: result.imePrezime  
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