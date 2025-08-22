import React, { useState } from "react";
import ProfilePicture from "../../components/profile/ProfilePicture";

const ProfilePictureAddPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

 

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <ProfilePicture image={image} onImageChange={setImage} />
    </main>
  );
};

export default ProfilePictureAddPage;
