import ChatArea from "../../components/chat_area/ChatArea";
import Sidebar from "../../components/sidebar/Sidebar";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatProvider } from "../../contexts/chat/ChatContext";

export default function ChatPage() {
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
        <Sidebar />
        <ChatArea />
        </ChatProvider>
      </div>
    </main>
  );
}