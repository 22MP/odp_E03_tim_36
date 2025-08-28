import React from 'react';
import UserProfile from './UserProfile';
import ConversationList from './ConversationList';
import { useAuth } from '../../hooks/auth/useAuthHook';
import { useNavigate } from 'react-router-dom';
import type { IUsersAPIService } from '../../api_services/users/IUsersAPIService'; 

interface SidebarProps{
  usersApi: IUsersAPIService;
}

const Sidebar: React.FC<SidebarProps> = ({usersApi}:SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white flex-shrink-0 py-8 pl-6 pr-2">
      {/* Header / logo */}
      <div className="flex items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">QuickChat</div>
      </div>

      {/* Srednji blok zauzima sav prostor do dugmeta */}
      <div className="flex flex-col flex-1 min-h-0 mt-4">
        <UserProfile />
        {/* Naslov + lista: lista dobija flex-1 + overflow i popunjava do dna */}
        <div className="mt-4 flex-1 min-h-0">
          <ConversationList usersApi={usersApi} />
        </div>
      </div>

      {/* Logout stalno na dnu */}
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
