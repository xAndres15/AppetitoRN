// services/OrderService.ts
import { addToCart, auth, getAvailableProducts } from '../lib/firebase';

export const OrderService = {
  async getProducts() {
    const result = await getAvailableProducts();
    if (result.success && result.products) {
      return { success: true, data: result.products };
    }
    return { success: false, error: result.error || 'Error al cargar productos' };
  },

  async addProductToCart(productId: string, restaurantId: string) {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión para agregar al carrito' };
    }

    const result = await addToCart(user.uid, productId, restaurantId);
    return result;
  },
};