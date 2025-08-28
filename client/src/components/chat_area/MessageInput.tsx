import React, { useCallback, useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuthHook';
import { useChat } from '../../contexts/chat/ChatContext';
import { messageApi } from '../../api_services/messages/MessageAPIService';


const MessageInput: React.FC = () => {
  const {token} = useAuth();
  const {selectedUserId, refreshConversation} = useChat();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = !!token && !!selectedUserId && message.trim().length>0 && !sending;


  const handleSend = useCallback(
    async(e?: React.FormEvent) => {
      if(e) e.preventDefault();
      if(!canSend) return;

      try{
        setSending(true);
        const ok =await messageApi.sendMessage(token as string, selectedUserId as number, message.trim());
        if(ok){
          setMessage(""); //cisti input
          await refreshConversation(); // povlaci nove poruke
        }else{
          console.warn("Slanje poruke nije uspjelo");
        }
      }finally{
        setSending(false);
      }

    },
    [canSend,token, selectedUserId, message, refreshConversation]


  )

  return (
    <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
      <div className="flex-grow ml-4">
        <div className="relative w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder="Type your message..."
          />
          
        </div>
      </div>
      <div className="ml-4">
        <button
          onClick={handleSend}
          className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
        >
          <span>Send</span>
          <span className="ml-2">
            <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;