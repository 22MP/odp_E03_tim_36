export interface IEditAPIService {
	editUser(formData: FormData, token: string): Promise<{ success: boolean; message?: string; data?: any }>;
}

