// services/AdminService.ts
import { getAllOrders, getAllReservations, getRestaurantInfo, updateRestaurantInfo } from '../lib/firebase';

export const AdminService = {
  async getRestaurantInfo(restaurantId: string) {
    try {
      const result = await getRestaurantInfo(restaurantId);
      if (result.success && result.info) {
        return { success: true, data: result.info };
      }
      return { success: false, error: 'Error al cargar información del restaurante' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar restaurante' };
    }
  },

  async getOrders(restaurantId: string) {
    try {
      const result = await getAllOrders(restaurantId);
      if (result.success && result.orders) {
        return { success: true, data: result.orders };
      }
      return { success: false, error: 'Error al cargar pedidos' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar pedidos' };
    }
  },

  async getReservations(restaurantId: string) {
    try {
      const result = await getAllReservations(restaurantId);
      if (result.success && result.reservations) {
        return { success: true, data: result.reservations };
      }
      return { success: false, error: 'Error al cargar reservas' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar reservas' };
    }
  },

  async updateRestaurantStatus(restaurantId: string, isOpen: boolean) {
    try {
      const result = await updateRestaurantInfo(restaurantId, { isOpen });
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al actualizar estado' };
    }
  },
};