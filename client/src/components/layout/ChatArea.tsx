import React from 'react';
import MessageList from '../message/MessageList';
import MessageInput from '../message/MessageInput';
import type { IMessageAPIService } from '../../api_services/messages/IMessageAPIService';

type Props={
  messageAPI:IMessageAPIService
}
const ChatArea: React.FC<Props> = ({messageAPI}) => {
  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-0 p-0 m-0">
      <div className="flex flex-col flex-1 w-full h-full min-h-0 rounded-2xl bg-gray-100 p-4">
        <MessageList/>
        <MessageInput messageAPI={messageAPI} />
      </div>
    </div>
  );
};

export default ChatArea;