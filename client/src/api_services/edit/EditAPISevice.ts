import type { IEditAPIService } from "./IEditAPISevice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const editApiService: IEditAPIService = {
	async editUser(formData, token) {
		try {
			const response = await fetch(`${API_URL}/users/edit`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});
			const data = await response.json();
			return { success: response.ok, ...data };
		} catch (err) {
			return { success: false, message: "Greška pri slanju zahteva." };
		}
	},
};
