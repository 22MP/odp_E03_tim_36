import React from 'react';
import type { UserDto } from '../../models/users/UserDto';
// If Conversation type is still needed elsewhere, update its participant type to UserDto

interface ConversationItemProps {
  participant: UserDto;
  unreadCount: number;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ participant, unreadCount }) => {

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
        {getInitials(participant.korisnickoIme)}
      </div>
      <div className="ml-2 text-sm font-semibold">{participant.korisnickoIme}</div>
      <div className="ml-2 text-xs text-gray-500">{participant.uloga}</div>
      {unreadCount > 0 && (
        <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default ConversationItem;