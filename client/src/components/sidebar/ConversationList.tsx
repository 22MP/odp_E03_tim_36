import React, { useState, useEffect, useMemo } from 'react';
import { usersApi } from '../../api_services/users/UsersAPIService';
import { useAuth } from '../../hooks/auth/useAuthHook';
import type { UserDto } from '../../models/users/UserDto';
import { useChat } from '../../contexts/chat/ChatContext';
import UnreadMessagesIndicator from './UnreadMessagesIndicator';

const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:4000';

function buildImageUrl(path?: string) {
  if (!path) return '';
  return IMAGE_BASE_URL.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '');
}

const RegistrationAvatar = () => (
  <span className="flex items-center justify-center h-10 w-10 bg-indigo-200 rounded-full">
    <span className="text-2xl text-gray-500">👤</span>
  </span>
);

function GlobalUnreadBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-[2px] text-[10px] leading-4 font-medium text-red-700"
      title={`${count} new messages`}
    >
      <span className="opacity-70">new messages</span>
      <span className="inline-flex items-center justify-center rounded-full bg-red-600 text-white h-4 min-w-4 px-[4px] text-[10px] leading-4">
        {count}
      </span>
    </span>
  );
}

const ConversationList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const { token, user } = useAuth();
  const { selectUser, selectedUserId, unreadMap } = useChat();

  const totalUnread = useMemo(
    () => Object.values(unreadMap ?? {}).reduce((acc, v) => acc + (v || 0), 0),
    [unreadMap]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !user) return;
      const usersList = await usersApi.getSviKorisnici(token, user.uloga);
      setUsers(usersList.filter(u => u.id !== user.id));
    };
    fetchUsers();
  }, [token, user]);

  return (
    // min-h-0 je bitan kad je roditelj flex-1: dozvoljava child-u da računa visinu za skrol
    <div className="flex flex-col h-full min-h-0 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <h3 className="font-bold">
          Users <span className="ml-1 text-gray-500">({users.length})</span>
        </h3>
        <GlobalUnreadBadge count={totalUnread} />
      </div>

      {/* LISTA: zauzmi sav preostali prostor do dna (Logout je izvan ovog kompa) */}
      <div className="mt-4 -mx-2 pr-2 flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-1">
          {users.map(u => {
            const unreadForThisUser = unreadMap?.[u.id] ?? 0;

            return (
              <button
                key={u.id}
                onClick={() => selectUser(u.id)}
                className={[
                  "w-full flex items-center rounded-xl p-2 text-left cursor-pointer hover:bg-gray-100",
                  selectedUserId === u.id ? "bg-gray-200" : ""
                ].join(" ")}
              >
                {/* Avatar */}
                <div className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden bg-indigo-200">
                  {u.slikaUrl && u.slikaUrl.trim() !== '' ? (
                    <img
                      src={buildImageUrl(u.slikaUrl)}
                      alt={u.korisnickoIme}
                      className="object-cover h-10 w-10 rounded-full"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <RegistrationAvatar />
                  )}
                </div>

                {/* Tekst + badge */}
                <div className="ml-3 flex-1 min-w-0">
                  {/* Red 1: korisničko ime + badge */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold truncate">{u.korisnickoIme}</div>
                    <UnreadMessagesIndicator count={unreadForThisUser} />
                  </div>

                  {/* Red 2: ime i prezime */}
                  <div className="text-xs text-gray-700 truncate">
                    {u.imePrezime}
                  </div>

                  {/* Red 3: telefon (NOVI RED) */}
                  <div className="text-[11px] text-gray-500 truncate">
                    {u.brojTelefona}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
