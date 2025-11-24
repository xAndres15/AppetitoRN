// services/OrderService.ts
import { addToCart, auth, getActivePromotions, getAvailableProducts } from '../lib/firebase';

export const OrderService = {
  async getProducts() {
    try {
      // 1. Cargar productos disponibles
      const productsResult = await getAvailableProducts();
      if (!productsResult.success || !productsResult.products) {
        return { success: false, error: productsResult.error || 'Error al cargar productos' };
      }

      // 2. Cargar promociones activas (IGUAL QUE OFFERSVIEWMODEL)
      const promotionsResult = await getActivePromotions();
      
      if (!promotionsResult.success || !promotionsResult.promotions) {
        // Si no hay promociones, devolver productos sin descuento
        return { success: true, data: productsResult.products };
      }

      // 3. Crear mapa de promociones por productId
      const promotionsMap = new Map();
      promotionsResult.promotions.forEach(promo => {
        if (promo.productId) {
          promotionsMap.set(promo.productId, promo);
        }
      });

      // 4. Mapear productos con sus promociones
      const productsWithPromotions = productsResult.products.map(product => {
        const promotion = promotionsMap.get(product.id);
        
        if (promotion) {
          // Calcular precio con descuento
          const discountMatch = promotion.discount.match(/(\d+)%/);
          const discountPercentage = discountMatch ? parseInt(discountMatch[1], 10) : 0;
          const discountedPrice = discountPercentage > 0 
            ? product.price * (1 - discountPercentage / 100)
            : product.price;

          return {
            ...product,
            hasPromotion: true,
            promotionDiscount: promotion.discount,
            promotionTitle: promotion.title,
            originalPrice: product.price,
            discountedPrice: discountedPrice,
          };
        }
        
        return product;
      });

      const withPromotionsCount = productsWithPromotions.filter(p => p.hasPromotion).length;
      return { success: true, data: productsWithPromotions };
    } catch (error) {
      console.error('❌ Error in OrderService.getProducts:', error);
      return { success: false, error: 'Error al cargar productos' };
    }
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