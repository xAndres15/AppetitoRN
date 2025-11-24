// services/AdminService.ts
import {
  Product,
  Promotion,
  createPromotion,
  deletePromotion,
  getActivePromotions,
  getAllOrders,
  getAllReservations,
  getProductPromotions,
  getProducts,
  getPromotions,
  getRestaurantInfo,
  updatePromotion,
  updateRestaurantInfo,
} from '../lib/firebase';

export const AdminService = {
  // ============================================
  // FUNCIONES EXISTENTES
  // ============================================

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

  // ============================================
  // FUNCIONES PARA PROMOCIONES (NUEVAS)
  // ============================================

  async getPromotions(restaurantId: string): Promise<{
    success: boolean;
    data?: Promotion[];
    error?: string;
  }> {
    try {
      const result = await getPromotions(restaurantId);
      return {
        success: result.success,
        data: result.promotions,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al obtener promociones',
      };
    }
  },

  async getActivePromotions(restaurantId?: string): Promise<{
    success: boolean;
    data?: Promotion[];
    error?: string;
  }> {
    try {
      const result = await getActivePromotions(restaurantId);
      return {
        success: result.success,
        data: result.promotions,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al obtener promociones activas',
      };
    }
  },

  async createPromotion(
    restaurantId: string,
    data: {
      productId: string; // ← CAMBIADO: singular
      title: string;
      description: string;
      discount: string;
      image: string;
      active: boolean;
      minOrder?: number;
      deliveryTime?: string;
      expiresAt?: number;
    }
  ): Promise<{ success: boolean; promotionId?: string; error?: string }> {
    try {
      // Construir el objeto con el formato correcto para firebase
      const promotionData = {
        restaurantId,
        productId: data.productId, // ← CAMBIADO: singular
        title: data.title,
        description: data.description,
        discount: data.discount,
        image: data.image,
        active: data.active,
        ...(data.minOrder && { minOrder: data.minOrder }),
        ...(data.deliveryTime && { deliveryTime: data.deliveryTime }),
        ...(data.expiresAt && { expiresAt: data.expiresAt }),
      };

      const result = await createPromotion(promotionData, restaurantId);
      return {
        success: result.success,
        promotionId: result.promotionId,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al crear promoción',
      };
    }
  },

  async updatePromotion(
    promotionId: string,
    restaurantId: string,
    updates: Partial<Promotion>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await updatePromotion(promotionId, restaurantId, updates);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al actualizar promoción',
      };
    }
  },

  async deletePromotion(
    promotionId: string,
    restaurantId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await deletePromotion(promotionId, restaurantId);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al eliminar promoción',
      };
    }
  },

  async getProductPromotions(
    productId: string,
    restaurantId: string
  ): Promise<{ success: boolean; data?: Promotion[]; error?: string }> {
    try {
      const result = await getProductPromotions(productId, restaurantId);
      return {
        success: result.success,
        data: result.promotions,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al obtener promociones del producto',
      };
    }
  },

  async getProducts(restaurantId: string): Promise<{
    success: boolean;
    data?: Product[];
    error?: string;
  }> {
    try {
      const result = await getProducts(restaurantId);
      return {
        success: result.success,
        data: result.products,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al obtener productos',
      };
    }
  },
};