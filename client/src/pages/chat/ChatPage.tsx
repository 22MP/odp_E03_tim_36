import ChatArea from "../../components/chat_area/ChatArea";
import Sidebar from "../../components/sidebar/Sidebar";

export default function ChatPage() {

  return (
    <main className="flex flex-row h-screen w-full bg-gradient-to-tr from-slate-600/75 to-orange-800/70">
      <Sidebar />
      <ChatArea />
    </main>
  );
}