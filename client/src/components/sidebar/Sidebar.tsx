import React from 'react';
import UserProfile from './UserProfile';
import ConversationList from './ConversationList';
import { useAuth } from '../../hooks/auth/useAuthHook';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
  <div className="flex flex-col py-8 pl-6 pr-2 pb-12 w-64 bg-white flex-shrink-0 h-full">
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">QuickChat</div>
      </div>
      <UserProfile />
      <ConversationList />
      <button
        className="mt-6 mb-4 mx-8 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-auto"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;