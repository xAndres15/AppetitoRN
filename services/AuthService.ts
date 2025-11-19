// services/AuthService.ts
import { getUserRole, loginUser, registerUser, resetPassword } from '../lib/firebase';

export const AuthService = {
  async login(email: string, password: string) {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      // Verificar si es admin
      const roleResult = await getUserRole(res.user.uid);
      
      return {
        success: true,
        data: { 
          email,
          isAdmin: roleResult.role === 'admin',
          restaurantId: roleResult.restaurantId
        },
      };
    }
    return { success: false, error: res.error };
  },

  async resetPassword(email: string) {
    const res = await resetPassword(email);
    if (res.success) return { success: true };
    return { success: false, error: res.error };
  },

  async register(
    email: string,
    password: string,
    userData?: {
      name?: string;
      lastName?: string;
      phone?: string;
      address?: string;
    }
  ) {
    const res = await registerUser(email, password, userData);
    if (res.success) return { success: true };
    return { success: false, error: res.error };
  },
};