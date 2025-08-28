import axios from "axios";
import type { UserDto } from "../../models/users/UserDto";
import type { IUsersAPIService } from "./IUsersAPIService";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

export const usersApi: IUsersAPIService = {
  async getSviKorisnici(token: string, uloga: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s?uloga=${uloga}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch {
      return [];
    }
  },

  

};
