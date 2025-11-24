// services/PromotionService.ts
import {
    child,
    get,
    push,
    ref,
    remove,
    set,
    update,
} from 'firebase/database';
import { database } from '../lib/firebase';

export interface Promotion {
  id?: string;
  restaurantId: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  active: boolean;
  minOrder?: number;
  deliveryTime?: string;
  productIds?: string[]; // IDs de productos a los que aplica
  createdAt: number;
  expiresAt?: number;
}

export interface PromotionFormData {
  title: string;
  description: string;
  discount: string;
  image: string;
  active: boolean;
  minOrder?: number;
  deliveryTime?: string;
  productIds?: string[];
  expiresAt?: number;
}

class PromotionServiceClass {
  // Crear promoción
  async createPromotion(
    restaurantId: string,
    data: PromotionFormData
  ): Promise<{ success: boolean; promotionId?: string; error?: string }> {
    try {
      const promotionsRef = ref(database, `restaurants/${restaurantId}/promotions`);
      const newPromotionRef = push(promotionsRef);
      const promotionId = newPromotionRef.key;

      if (!promotionId) {
        return { success: false, error: 'Error al generar ID de promoción' };
      }

      const promotion: Promotion = {
        id: promotionId,
        restaurantId,
        ...data,
        createdAt: Date.now(),
      };

      await set(newPromotionRef, promotion);
      return { success: true, promotionId };
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener todas las promociones de un restaurante
  async getPromotions(restaurantId: string): Promise<{
    success: boolean;
    promotions?: Promotion[];
    error?: string;
  }> {
    try {
      const dbRef = ref(database);
      const snapshot = await get(
        child(dbRef, `restaurants/${restaurantId}/promotions`)
      );

      if (snapshot.exists()) {
        const promotions: Promotion[] = [];
        snapshot.forEach((childSnapshot) => {
          promotions.push(childSnapshot.val());
        });
        promotions.sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, promotions };
      }

      return { success: true, promotions: [] };
    } catch (error: any) {
      console.error('Error getting promotions:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener promociones activas
  async getActivePromotions(restaurantId?: string): Promise<{
    success: boolean;
    promotions?: Promotion[];
    error?: string;
  }> {
    try {
      if (restaurantId) {
        const result = await this.getPromotions(restaurantId);
        if (result.success && result.promotions) {
          const now = Date.now();
          const activePromotions = result.promotions.filter(
            (promo) =>
              promo.active && (!promo.expiresAt || promo.expiresAt > now)
          );
          return { success: true, promotions: activePromotions };
        }
        return result;
      } else {
        // Obtener promociones activas de todos los restaurantes
        const restaurantsRef = ref(database, 'restaurants');
        const snapshot = await get(restaurantsRef);

        if (!snapshot.exists()) {
          return { success: true, promotions: [] };
        }

        const allPromotions: Promotion[] = [];
        const now = Date.now();

        for (const restaurantSnapshot of Object.values(snapshot.val())) {
          const restaurant = restaurantSnapshot as any;
          if (restaurant.promotions) {
            Object.values(restaurant.promotions).forEach((promo: any) => {
              if (promo.active && (!promo.expiresAt || promo.expiresAt > now)) {
                allPromotions.push(promo);
              }
            });
          }
        }

        allPromotions.sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, promotions: allPromotions };
      }
    } catch (error: any) {
      console.error('Error getting active promotions:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener promoción por ID
  async getPromotionById(
    promotionId: string,
    restaurantId: string
  ): Promise<{ success: boolean; promotion?: Promotion; error?: string }> {
    try {
      const dbRef = ref(database);
      const snapshot = await get(
        child(dbRef, `restaurants/${restaurantId}/promotions/${promotionId}`)
      );

      if (snapshot.exists()) {
        return { success: true, promotion: snapshot.val() };
      }

      return { success: false, error: 'Promoción no encontrada' };
    } catch (error: any) {
      console.error('Error getting promotion:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar promoción
  async updatePromotion(
    promotionId: string,
    restaurantId: string,
    updates: Partial<PromotionFormData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const promotionUpdates: any = {};
      Object.keys(updates).forEach((key) => {
        promotionUpdates[
          `restaurants/${restaurantId}/promotions/${promotionId}/${key}`
        ] = (updates as any)[key];
      });

      await update(ref(database), promotionUpdates);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar promoción
  async deletePromotion(
    promotionId: string,
    restaurantId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await remove(
        ref(database, `restaurants/${restaurantId}/promotions/${promotionId}`)
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener promociones aplicables a un producto
  async getProductPromotions(
    productId: string,
    restaurantId: string
  ): Promise<{ success: boolean; promotions?: Promotion[]; error?: string }> {
    try {
      const result = await this.getActivePromotions(restaurantId);
      if (result.success && result.promotions) {
        const productPromotions = result.promotions.filter(
          (promo) =>
            !promo.productIds || // Promoción general
            promo.productIds.length === 0 || // Promoción general
            promo.productIds.includes(productId) // Promoción específica para este producto
        );
        return { success: true, promotions: productPromotions };
      }
      return result;
    } catch (error: any) {
      console.error('Error getting product promotions:', error);
      return { success: false, error: error.message };
    }
  }
}

export const PromotionService = new PromotionServiceClass();