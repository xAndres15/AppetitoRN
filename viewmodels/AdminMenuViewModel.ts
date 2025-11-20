// viewmodels/AdminMenuViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Product, getProducts, updateProduct } from '../lib/firebase';

export function useAdminMenuViewModel(restaurantId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (restaurantId) {
      loadProducts();
    }
  }, [restaurantId]);

  const loadProducts = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getProducts(restaurantId);
    if (result.success && result.products) {
      setProducts(result.products);
    } else {
      Alert.alert('Error', 'Error al cargar productos');
    }
    setLoading(false);
  };

  const reload = () => {
    loadProducts();
  };

  const toggleAvailability = async (productId: string, currentAvailability: boolean) => {
    if (!restaurantId) return;

    const result = await updateProduct(productId, restaurantId, {
      available: !currentAvailability,
    });

    if (result.success) {
      Alert.alert(
        'Éxito',
        currentAvailability
          ? 'Producto marcado como no disponible'
          : 'Producto marcado como disponible'
      );
      loadProducts();
    } else {
      Alert.alert('Error', 'Error al actualizar producto');
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    products,
    loading,
    searchQuery,
    reload,
    setSearchQuery,
    filteredProducts,
    formatPrice,
    toggleAvailability,
    loadProducts,
  } as const;
}