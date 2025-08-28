import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import type { UserDto } from "../../models/users/UserDto";
import axios from "axios";

// URL API-ja, vodi racuna da se poklapa sa backend rutom!
const API_URL: string = import.meta.env.VITE_API_URL + "auth";

export const authApi: IAuthAPIService = {
  // Prijava: šalje korisničko ime i lozinku kao JSON
  async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
        korisnickoIme,
        lozinka,
      });
      return res.data;
    } catch (error) {
      let message = "Greška prilikom prijave.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },

  // Registracija: šalje sva polja kao FormData (uključujući sliku)
  async registracija(formData: FormData): Promise<AuthResponse> {
    try {
      // Slanje zahteva za registraciju
      const res = await axios.post<AuthResponse>(`${API_URL}/register`, formData);
      return res.data;
    } catch (error) {
      let message = "Greška prilikom registracije.";
      console.log(error);
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
        console.log("Backend response:", error.response?.data);
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },
  async update(token: string, data: FormData | { imePrezime?: string; brojTelefona?: string; }):Promise<any> {
  
  const raw = (token ?? "").replace(/^Bearer\s+/i, "").trim(); // očisti eventualni "Bearer "
  if (!raw) throw new Error("Nema JWT tokena – proveri kako ga čitaš iz AuthContext/localStorage.");

  const headers = { Authorization: `Bearer ${raw}` };

  // Axios sam postavlja Content-Type (JSON za objekat, multipart za FormData)
  const res = await axios.patch(`${API_URL}/me`, data as any, { headers });
  
  return res.data as { success: boolean; data: UserDto; token?: string; message?: string };
}
};