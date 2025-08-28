import ChatArea from "../../components/layout/ChatArea";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatProvider } from "../../contexts/chat/ChatContext";
import type { IMessageAPIService } from "../../api_services/messages/IMessageAPIService";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";


interface chatPageProps{
  messageApi:IMessageAPIService;
  usersApi:IUsersAPIService;
}
export default function ChatPage({messageApi, usersApi}:chatPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) { 
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <div className="flex flex-row h-screen w-full">
        <ChatProvider>
        <Sidebar usersApi= {usersApi} />
        <ChatArea messageAPI={messageApi}/>
        </ChatProvider>
      </div>
    </main>
  );
}