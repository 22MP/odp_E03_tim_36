import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-0 p-0 m-0">
      <div className="flex flex-col flex-1 w-full h-full min-h-0 rounded-2xl bg-gray-100 p-4">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatArea;