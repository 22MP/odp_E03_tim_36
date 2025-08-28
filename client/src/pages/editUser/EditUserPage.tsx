// Stranica za izmenu korisničkog profila
import IzmjenaForma from "../../components/edit_user/IzmjenaForma";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";


interface UserPageProps{
  authApi:IAuthAPIService;
}
export default function EditUserPage({authApi}:UserPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <IzmjenaForma authApi={authApi} />
    </main>
  );
}
