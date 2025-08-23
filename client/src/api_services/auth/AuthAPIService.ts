import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
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
};