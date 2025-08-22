//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api_services/users/UsersAPIService';
import { useAuth } from '../../hooks/auth/useAuthHook';
import type { UserDto } from '../../models/users/UserDto';

const ConversationList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !user) return;
      const usersList = await usersApi.getSviKorisnici(token, user.uloga);
      setUsers(usersList);
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
          {users.map(user => (
            <div key={user.id} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                {user.korisnickoIme[0]}
              </div>
              <div className="ml-2 text-sm font-semibold">{user.korisnickoIme}</div>
              <div className="ml-2 text-xs text-gray-500">{user.uloga}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ConversationList;