export interface AvatarContextType {
  avatar: File | null;
  setAvatar: (avatar: File | null) => void;
}