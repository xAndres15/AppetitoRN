// viewmodels/OffersViewModel.ts
import { useEffect, useState } from 'react';
import { getActivePromotions, getProductById, Product, Promotion } from '../lib/firebase';

export function useOffersViewModel() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    const result = await getActivePromotions();

    if (result.success && result.promotions) {
      setPromotions(result.promotions);
    }

    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const reload = () => {
    loadPromotions();
  };

  // ✅ NUEVA FUNCIÓN: Obtener producto completo
  const getProductDetails = async (
    productId: string,
    restaurantId: string
  ): Promise<Product | null> => {
    try {
      const result = await getProductById(productId, restaurantId);
      if (result.success && result.product) {
        return result.product;
      }
      return null;
    } catch (error) {
      console.error('Error loading product:', error);
      return null;
    }
  };

  return {
    promotions,
    loading,
    formatPrice,
    reload,
    getProductDetails, // ← EXPORTAR
  } as const;
}