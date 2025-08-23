import React, { createContext, useState, type ReactNode } from "react";
import type { AvatarContextType } from "../../types/avatar/AvatarContex";

// Kreiranje konteksta za avatar slike
export const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

interface AvatarProviderProps {
  children: ReactNode;
}

// Provider koji omogućava globalno stanje za avatar sliku
export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  const [avatar, setAvatar] = useState<File | null>(null);

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};