import React from 'react';
import MessageItem from './MessageItem';
import type { MessageDTO } from '../../models/messages/MessageDTO';

const MessageList: React.FC = () => {
  const messages: MessageDTO[] = [
    { id: 1, tekstPoruke: 'Hey How are you today?', vrijeme: new Date().toISOString(), posiljalacID: 2, primalacID: 1, stanje: 'procitano' },
    { id: 2, tekstPoruke: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ipsa commodi illum saepe numquam maxime asperiores voluptate sit, minima perspiciatis.', vrijeme: new Date().toISOString(), posiljalacID: 2, primalacID: 1, stanje: 'procitano' },
    { id: 3, tekstPoruke: 'I\'m ok what about you?', vrijeme: new Date().toISOString(), posiljalacID: 1, primalacID: 2, stanje: 'procitano' },
    { id: 4, tekstPoruke: 'Lorem ipsum dolor sit, amet consectetur adipisicing.?', vrijeme: new Date().toISOString(), posiljalacID: 1, primalacID: 2, stanje: 'neprocitano' },
  ];

  return (
    <div className="flex flex-col h-full overflow-x-auto mb-4">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map(message => (
            <MessageItem key={message.id} message={message} isOwnMessage={message.posiljalacID === 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;