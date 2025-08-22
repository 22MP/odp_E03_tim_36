import React from 'react';
import type { MessageDTO } from '../../models/messages/MessageDTO';

interface MessageItemProps {
  message: MessageDTO;
  isOwnMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`p-3 rounded-lg flex ${isOwnMessage ? 'justify-end col-start-6 col-end-13' : 'justify-start col-span-8'}`}
    >
      <div className={`flex items-center ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`} style={{ width: '100%' }}>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {isOwnMessage ? 'Y' : 'T'}
        </div>
        <div className={`relative ${isOwnMessage ? 'mr-3 bg-indigo-100' : 'ml-3 bg-white'} text-sm py-2 px-4 shadow rounded-xl`} style={{ maxWidth: '80%' }}>
          <div>{message.tekstPoruke}</div>
          <div className="text-xs text-gray-400 mt-1">{new Date(message.vrijeme).toLocaleString()}</div>
          {isOwnMessage && message.stanje === 'procitano' && (
            <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
              Seen
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;