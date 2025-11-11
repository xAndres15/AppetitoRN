// viewmodels/HomeViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Product } from '../lib/firebase';
import { HomeService } from '../services/HomeService';

export function useHomeViewModel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantName, setRestaurantName] = useState('Appetito');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadProducts(), loadRestaurantName()]);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await HomeService.getProducts();
      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        Alert.alert('Error', 'Error al cargar productos');
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      Alert.alert('Error', error.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantName = async () => {
    try {
      const result = await HomeService.getRestaurantName();
      if (result.success && result.data) {
        setRestaurantName(result.data);
      }
    } catch (error) {
      console.error('Error loading restaurant name:', error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularItems = filteredProducts.slice(0, 6);

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString('es-CO')}`;
  };

  return {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    restaurantName,
    filteredProducts,
    popularItems,
    formatPrice,
    loadProducts,
  } as const;
}