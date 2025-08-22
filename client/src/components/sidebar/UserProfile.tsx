import React from 'react';
import type { User } from '../../types/users/User';
const UserProfile: React.FC = () => {
  // In a real app, this would come from context or props
  const user: User = {
    id: 1,
    korisnickoIme: 'Aminos Co.',
    lozinka: '',
    brojTelefona: '123-456-789',
    ImePrezime: 'Aminos Company',
    slika: 'https://avatars3.githubusercontent.com/u/2763884?s=128',
    uloga: 'user',
  };

  return (
    <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
      <div className="h-20 w-20 rounded-full border overflow-hidden">
        <img src={user.slika} alt="Avatar" className="h-full w-full" />
      </div>
      <div className="text-sm font-semibold mt-2">{user.korisnickoIme}</div>
      <div className="text-xs text-gray-500">{user.ImePrezime}</div>
      <div className="flex flex-row items-center mt-3">
        <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
          <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
        </div>
        <div className="leading-none ml-1 text-xs">Active</div>
      </div>
    </div>
  );
};

export default UserProfile;