
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../contexts/avatar/AvatarContext.tsx"

export interface ProfilePictureProps {}

const ProfilePicture: React.FC<ProfilePictureProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatar, setAvatar } = useAvatar();
  const [image, setImage] = useState<string | null>(avatar || null);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (image) {
      setAvatar(image);
    }
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-sm border border-white/20 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Izaberite profilnu sliku</h2>
      <div className="flex flex-col items-center mb-4">
        <div
          className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-blue-400 hover:border-blue-600"
          onClick={handleAvatarClick}
        >
          {image ? (
            <img src={image} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-5xl text-gray-500">👤</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span className="mt-2 text-xs text-gray-600">Klikni na avatar za izbor slike</span>
      </div>
      <div className="flex flex-row gap-4 mt-2">
        <button
          className="bg-blue-700/70 hover:bg-blue-700/90 text-white px-4 py-2 rounded-xl transition"
          onClick={handleConfirm}
          disabled={!image}
        >
          Dodaj sliku
        </button>
        <button
          className="bg-gray-400/70 hover:bg-gray-500/90 text-white px-4 py-2 rounded-xl transition"
          onClick={handleCancel}
        >
          Odustani
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;