// viewmodels/OrderViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Product, auth, getCartItems } from '../lib/firebase';
import { OrderService } from '../services/OrderService';

export function useOrderViewModel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0); // ← AGREGADO

  useEffect(() => {
    loadProducts();
    loadCartCount(); // ← AGREGADO
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await OrderService.getProducts();
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

  // ← AGREGADO: Cargar contador del carrito
  const loadCartCount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const result = await getCartItems(user.uid);
        if (result.success && result.items) {
          const totalItems = result.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        }
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleAddToCart = async (productId: string, restaurantId: string) => {
    try {
      const result = await OrderService.addProductToCart(productId, restaurantId);
      if (result.success) {
        Alert.alert('Éxito', 'Producto agregado al carrito');
        loadCartCount(); // ← AGREGADO: Actualizar el contador después de agregar
      } else {
        Alert.alert('Error', result.error || 'Error al agregar al carrito');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', error.message || 'Error al agregar al carrito');
    }
  };

  // Obtener categorías únicas
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString('es-CO')}`;
  };

  return {
    products,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredProducts,
    formatPrice,
    handleAddToCart,
    loadProducts,
    cartItemCount, // ← AGREGADO: Exportar cartItemCount
    loadCartCount, // ← AGREGADO: Exportar loadCartCount
  } as const;
}