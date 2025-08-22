import React, { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../contexts/avatar/AvatarContext.tsx";

const RegistracijaForma: React.FC<AuthFormProps> = ({ authApi }) => {
  const navigate = useNavigate();
  const { avatar } = useAvatar();
  
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("user");
  const [imePrezime, setImePrezime] = useState("");
  const [telefon, setTelefon] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    // Use the avatar from context
    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga, imePrezime, telefon, avatar);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
      setImePrezime("");
      setTelefon("");
    }
  };

  const handleAvatarClick = () => {
    navigate("/profile-picture");
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-xl border border-white/20 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Registracija</h1>
      <form onSubmit={podnesiFormu} className="grid grid-cols-2 gap-4 w-full max-w-lg items-center">
        <div className="flex flex-col items-center justify-center col-span-1">
          <div
            className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-blue-400 hover:border-blue-600"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
          </div>
          <span className="mt-2 text-xs text-gray-600">Dodaj sliku</span>
        </div>
        <div className="flex flex-col space-y-2 col-span-1">
          <input
            type="text"
            placeholder="Korisnicko ime"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Ime i prezime"
            value={imePrezime}
            onChange={(e) => setImePrezime(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={uloga}
            onChange={(e) => setUloga(e.target.value)}
            className="bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">Korisnik</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {greska && <p className="text-md text-center text-red-700/80 font-medium col-span-2">{greska}</p>}
        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition col-span-2"
        >
          Registruj se
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Vec imate nalog?{" "}
        <Link to="/login" className="text-blue-700 hover:underline">
          Prijavite se
        </Link>
      </p>
    </div>
  );
};

export default RegistracijaForma;