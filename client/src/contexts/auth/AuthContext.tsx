// src/contexts/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthContextType } from "../../types/auth/AuthContext";
import type { AuthUser } from "../../types/auth/AuthUser";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

import {
  ObrisiVrednostPoKljucu,
  ProcitajVrednostPoKljucu,
  SacuvajVrednostPoKljucu,
} from "../../helpers/local_storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Sigurno dekodiranje JWT i izvlačenje claim-ova koje backend ugrađuje. */
const decodeJWT = (token: string): JwtTokenClaims | null => {
  try {
    const decoded = jwtDecode<any>(token);
    if (decoded.id && decoded.korisnickoIme && decoded.uloga) {
      return {
        id: decoded.id,
        korisnickoIme: decoded.korisnickoIme,
        uloga: decoded.uloga,
        slikaUrl: decoded.slikaUrl,
        imePrezime: decoded.imePrezime,
        brojTelefona: decoded.brojTelefona,
        exp: decoded.exp,
      } as JwtTokenClaims;
    }
    return null;
  } catch (error) {
    console.error("Greška pri dekodiranju JWT tokena:", error);
    return null;
  }
};

/** Provjera isteka preko standardnog `exp` claima. */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return typeof decoded.exp === "number" ? decoded.exp < now : true;
  } catch {
    return true;
  }
};



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // 1) Pri startu pročitaj token iz localStorage i, ako je validan, popuni user iz claim-ova.
  useEffect(() => {
    const savedToken = ProcitajVrednostPoKljucu("authToken");
    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        ObrisiVrednostPoKljucu("authToken");
        setIsLoading(false);
        return;
      }
      const claims = decodeJWT(savedToken);
      if (claims) {
        setToken(savedToken);
        setUser({
          id: claims.id,
          korisnickoIme: claims.korisnickoIme,
          uloga: claims.uloga,
          slikaUrl: claims.slikaUrl ?? null,
          imePrezime: claims.imePrezime ?? null,
          brojTelefona: claims.brojTelefona ?? null,
        });
      } else {
        ObrisiVrednostPoKljucu("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * LOGIN — postavi novi token i user iz claim-ova (npr. posle login-a ili
   * posle izmjene profila ako backend vrati **novi** JWT sa osveženim claim-ovima).
   */
  const login = (newToken: string) => {
    const claims = decodeJWT(newToken);
    if (claims && !isTokenExpired(newToken)) {
      setToken(newToken);
      setUser({
        id: claims.id,
        korisnickoIme: claims.korisnickoIme,
        uloga: claims.uloga,
        slikaUrl: claims.slikaUrl ?? null,
        imePrezime: claims.imePrezime ?? null,
        brojTelefona: claims.brojTelefona ?? null,
      });
      SacuvajVrednostPoKljucu("authToken", newToken);
    } else {
      console.error("Nevažeći ili istekao token");
    }
  };

  /** LOGOUT — očisti sve tragove sesije. */
  const logout = () => {
    setToken(null);
    setUser(null);
    ObrisiVrednostPoKljucu("authToken");
  };

  
  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  } as AuthContextType;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
