import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useMemo } from "react";

export interface UserProfileProps {}

// Osnovni URL za slike korisnika
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:4000";

// Funkcija za izgradnju url-a slike korisnika 
function buildImageUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : IMAGE_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}


const UserProfile: React.FC<UserProfileProps> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Izračunaj URL za sliku korisnika 
  const userImage = useMemo(() => {
  if (!user?.slikaUrl) return null;
  const base = buildImageUrl(user.slikaUrl);
  // promeni se samo kada se promeni putanja slike
  return `${base}?t=${encodeURIComponent(user.slikaUrl)}`
}, [user?.slikaUrl]);

  const handleEditClick = () => {
    // Otvori edit user page
    navigate(`/edit-user/${user?.id}`);
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-sm border border-white/20 flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center mb-4">
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-400 overflow-hidden">
          {/* Prikaz slike korisnika */}
          {userImage ? (
            <img
              src={userImage}
              alt={user?.korisnickoIme}
              className="w-full h-full object-cover rounded-full"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className="text-5xl text-gray-500">👤</span>
          )}
        </div>
        {/* Olovka za  edit */}
        <button
          className="absolute right-2 bottom-2 bg-white/80 rounded-full p-2 shadow hover:bg-blue-200 transition flex items-center"
          title="Uredi profil"
          onClick={handleEditClick}
        >
          <span className="text-xl">✏️</span>
        </button>
      </div>
      <div className="text-md font-semibold text-gray-700 mb-2">
        {user?.korisnickoIme}
      </div>
    </div>
  );
};

export default UserProfile;