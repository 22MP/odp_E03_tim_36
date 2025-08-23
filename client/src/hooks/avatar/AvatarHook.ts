import { useContext } from "react";
import { AvatarContext } from "../../contexts/avatar/AvatarContext";
import type { AvatarContextType } from "../../types/avatar/AvatarContex.ts";

// Custom hook za lakši pristup avatar context-u
export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error("useAvatar mora biti korišćen unutar AvatarProvider-a");
  }
  return context;
};