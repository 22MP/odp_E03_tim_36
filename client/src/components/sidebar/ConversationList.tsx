import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api_services/users/UsersAPIService';
import { useAuth } from '../../hooks/auth/useAuthHook';
import type { UserDto } from '../../models/users/UserDto';

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:4000";

function buildImageUrl(path?: string) {
  if (!path) return "";
  return IMAGE_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

// SVG ili emoji avatar kao na registraciji
const RegistrationAvatar = () => (
  <span className="flex items-center justify-center h-10 w-10 bg-indigo-200 rounded-full">
    <span className="text-2xl text-gray-500">👤</span>
  </span>
);

const ConversationList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !user) return;
      const usersList = await usersApi.getSviKorisnici(token, user.uloga);
      // Filtriraj da se logovani user ne vidi u listi
      const filteredUsers = usersList.filter(u => u.id !== user.id);
      setUsers(filteredUsers);
    };
    fetchUsers();
  }, [token, user]);

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">Users</span>
        <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
          {users.length}
        </span>
      </div>
      <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
        {users.map(u => (
          <div key={u.id} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 w-full">
            <div className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden bg-indigo-200">
              {(!!u.slikaUrl && u.slikaUrl.trim() !== "") ? (
                <img
                  src={buildImageUrl(u.slikaUrl)}
                  alt={u.korisnickoIme}
                  className="object-cover h-10 w-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <RegistrationAvatar />
              )}
            </div>
            <div className="ml-3 flex flex-col text-left flex-1">
              <div className="text-sm font-semibold">{u.korisnickoIme}</div>
              <div className="text-xs text-gray-500">{u.telefon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;