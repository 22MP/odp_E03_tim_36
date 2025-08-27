import React from 'react';
import MessageItem from './MessageItem';
import { useAuth } from '../../hooks/auth/useAuthHook';
import { useChat } from '../../contexts/chat/ChatContext';

const MessageList: React.FC = () => {
  const { user } = useAuth();
  const { messages } = useChat();

  return (
    <div className="flex flex-col h-full overflow-x-auto mb-4">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map(m => (
            <MessageItem
              key={m.id}
              message={{
                id: m.id,
                posiljalacID: m.posiljalacID,
                primalacID: m.primalacID,
                stanje: m.stanje,
                vrijemeSlanja: m.vrijemeSlanja,
                tekstPoruke: m.tekstPoruke
              }}
              isOwnMessage={user ? m.posiljalacID === user.id : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
