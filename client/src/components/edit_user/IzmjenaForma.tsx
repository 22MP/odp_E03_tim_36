// Forma za izmenu korisničkog profila
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api_services/auth/AuthAPIService";
import { validacijaPodatakaIzmjene } from "../../api_services/validators/auth/EditValidator";

// Helper za izgradnju punog URL-a slike
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:4000";

function buildImageUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : IMAGE_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

const IzmjenaForma: React.FC = () => {
  const { user: authUser, token } = useAuth();

  const [imePrezime, setImePrezime] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const { login, applyUserUpdate } = useAuth();

  // ✅ Novo: lokalni preview izabranog fajla
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [greska, setGreska] = useState("");
  const navigate = useNavigate(); // ili: const nav = useNavigate();


  useEffect(() => {
    if (authUser) {
      setImePrezime(authUser.imePrezime || "");
      setBrojTelefona(authUser.brojTelefona || "");
      // kada se korisnik učita/izmeni iz konteksta, resetuj preview
      setPreviewUrl("");
    }
  }, [authUser]);

  // 🔁 Bezbedno čišćenje object URL-a
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Submit funkcija za formu
  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");

    if (!authUser) {
      setGreska("Niste prijavljeni.");
      return;
    }

    if(!validacijaPodatakaIzmjene(imePrezime,brojTelefona, avatar).uspesno){
      setGreska("Neispravni podaci");
      return;
    }

    const formData = new FormData();
    formData.append("imePrezime", imePrezime);
    formData.append("brojTelefona", brojTelefona);
    if (avatar) formData.append("slika", avatar); // Multer .single("slika")

    const stored = PročitajVrednostPoKljuču("auth:token") || "";
    const rawToken = (token || stored).replace(/^Bearer\s+/i, "").trim();
    if (!rawToken) {
      setGreska("Niste prijavljeni.");
      return;
    }


    try {
      const res = await authApi.update(rawToken, formData);

      if (res.success) {
        const t = res.token;

        if (typeof t === "string" && t.includes(".") && t.split(".").length === 3) {
          // ✅ backend vratio validan JWT
          login(t);               // ovo prebrise stari token u localStorage
        } else {
          // ⛑ fallback ako tokena nema — odmah osveži AuthContext iz DTO-a
          applyUserUpdate(res.data);
        }

        if (res.data?.slikaUrl) {
          setPreviewUrl(buildImageUrl(res.data.slikaUrl)); // cache-bust
          setAvatar(null);
        }

        toast.success("Profil je uspješno ažuriran.");
        navigate(`/${(res.data?.uloga ?? authUser.uloga).toLowerCase()}-dashboard`, { replace: true });
      } else {
        setGreska(res.message || "Greška pri izmjeni profila.");
      }
    } catch {

    }
  };

  // 👇 Ako postoji lokalni preview (novi fajl izabran), prikaži njega;
  //    inače prikaži sliku iz authUser.slikaUrl
  const imgSrc = previewUrl || buildImageUrl(authUser?.slikaUrl);

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-xl border border-white/20 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Izmjena profila</h1>

      <form
        onSubmit={podnesiFormu}
        className="grid grid-cols-2 gap-4 w-full max-w-lg items-center"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center justify-center col-span-1 relative">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-400 hover:border-blue-600 overflow-hidden">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={authUser?.korisnickoIme || "avatar"}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setAvatar(f);
              // ✅ generiši lokalni preview odmah
              if (f) {
                // oslobodi stari, ako postoji
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(URL.createObjectURL(f));
              } else {
                setPreviewUrl("");
              }
            }}
          />
          <label htmlFor="avatar-upload" className="mt-2 text-xs text-gray-600 cursor-pointer">
            Promeni sliku
          </label>
        </div>

        <div className="flex flex-col space-y-2 col-span-1">
          <input
            type="text"
            placeholder="Ime i prezime"
            value={imePrezime}
            onChange={(e) => setImePrezime(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={100}
          />
          <input
            type="text"
            placeholder="Broj telefona"
            value={brojTelefona}
            onChange={(e) => setBrojTelefona(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={20}
          />
        </div>

        {greska && (
          <p className="text-md text-center text-red-700/80 font-medium col-span-2">
            {greska}
          </p>
        )}

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
