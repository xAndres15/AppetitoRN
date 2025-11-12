// services/CartService.ts
import {
    auth,
    getCartItems,
    removeFromCart,
    updateCartItemQuantity
} from '../lib/firebase';

export const CartService = {
  async getCartItems() {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión' };
    }

    const result = await getCartItems(user.uid);
    if (result.success && result.items) {
      return { 
        success: true, 
        data: result.items.map(item => ({
          id: item.productId,
          name: item.product?.name || 'Producto',
          price: item.product?.price || 0,
          image: item.product?.image || '',
          quantity: item.quantity,
          restaurantId: item.restaurantId,
          restaurant: 'Appetito'
        }))
      };
    }
    return { success: false, error: result.error || 'Error al cargar el carrito' };
  },

  async updateQuantity(productId: string, newQuantity: number) {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión' };
    }

    const result = await updateCartItemQuantity(user.uid, productId, newQuantity);
    return result;
  },

  async removeItem(productId: string) {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Debes iniciar sesión' };
    }

    const result = await removeFromCart(user.uid, productId);
    return result;
  },
};