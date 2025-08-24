// Forma za izmenu korisničkog profila
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { editApiService } from "../../api_services/edit/EditAPISevice";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";

// Helper za izgradnju punog URL-a slike
const IMAGE_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:4000";
function buildImageUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : IMAGE_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

const IzmjenaForma: React.FC = () => {
  const { user: authUser } = useAuth();
  // Inicijalizuj sva polja iz auth konteksta
  const [imePrezime, setImePrezime] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  // Popuni polja sa trenutnim vrednostima ulogovanog korisnika
  useEffect(() => {
    if (authUser) {
      setImePrezime(authUser.imePrezime || "");
      setBrojTelefona(authUser.brojTelefona || "");
  // Koristi slikaUrl iz tokena
    }
  }, [authUser]);
  const [greska, setGreska] = useState("");

  // Submit funkcija za formu
  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!authUser) return;
    // Kreiranje FormData objekta, dodavanje svih polja, uključujući avatar
    const formData = new FormData();
    formData.append("imePrezime", imePrezime);
    formData.append("brojTelefona", brojTelefona);
    if (avatar) formData.append("slika", avatar);
    
    const token = PročitajVrednostPoKljuču("token") || "";
    const res = await editApiService.editUser(formData, token);
    if (res.success) {
      setGreska("");
      // Možeš dodati redirect ili toast
    } else {
      setGreska(res.message || "Greška pri izmjeni profila.");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-xl border border-white/20 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Izmjena profila</h1>
      <form onSubmit={podnesiFormu} className="grid grid-cols-2 gap-4 w-full max-w-lg items-center" encType="multipart/form-data">
        <div className="flex flex-col items-center justify-center col-span-1">
          <div
            className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-400 hover:border-blue-600"
          >
            {(!!authUser?.slikaUrl && authUser.slikaUrl.trim() !== "") ? (
              <img
                src={buildImageUrl(authUser.slikaUrl)}
                alt={authUser.korisnickoIme}
                className="w-full h-full object-cover rounded-full"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              onChange={e => setAvatar(e.target.files?.[0] || null)}
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 left-0 right-0 text-xs text-center cursor-pointer bg-white/70 py-1 rounded-b-2xl">Izaberi sliku</label>
          </div>
          <span className="mt-2 text-xs text-gray-600">Promeni sliku</span>
        </div>
        <div className="flex flex-col space-y-2 col-span-1">
          <input
            type="text"
            placeholder="Ime i prezime"
            value={imePrezime}
            onChange={(e) => setImePrezime(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Broj telefona"
            value={brojTelefona}
            onChange={(e) => setBrojTelefona(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
        </div>
        {greska && <p className="text-md text-center text-red-700/80 font-medium col-span-2">{greska}</p>}
        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition col-span-2"
        >
          Sačuvaj izmjene
        </button>
      </form>
    </div>
  );
};

export default IzmjenaForma;
