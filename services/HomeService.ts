// services/HomeService.ts
import { getAvailableProducts, getRestaurantInfo } from '../lib/firebase';

export const HomeService = {
  async getProducts() {
    const result = await getAvailableProducts();
    if (result.success && result.products) {
      return { success: true, data: result.products };
    }
    return { success: false, error: result.error || 'Error al cargar productos' };
  },

  async getRestaurantName() {
    const result = await getRestaurantInfo();
    if (result.success && result.info) {
      return { success: true, data: result.info.name || 'Appetito' };
    }
    return { success: true, data: 'Appetito' };
  },
};