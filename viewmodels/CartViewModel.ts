// viewmodels/CartViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { CartService } from '../services/CartService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurant?: string;
  image: string;
  quantity: number;
  restaurantId: string;
  // ✅ AGREGAR CAMPOS DE PROMOCIÓN
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
  originalPrice?: number;
  discountedPrice?: number;
}

export function useCartViewModel() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      const result = await CartService.getCartItems();
      if (result.success && result.data) {
        setCartItems(result.data);
      } else {
        Alert.alert('Error', result.error || 'Error al cargar el carrito');
      }
    } catch (error: any) {
      console.error('Error loading cart:', error);
      Alert.alert('Error', error.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    
    try {
      const result = await CartService.updateQuantity(productId, newQuantity);
      if (result.success) {
        setCartItems(cartItems.map(i => 
          i.id === productId ? { ...i, quantity: newQuantity } : i
        ));
      } else {
        Alert.alert('Error', 'Error al actualizar cantidad');
      }
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', error.message || 'Error al actualizar cantidad');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const result = await CartService.removeItem(productId);
      if (result.success) {
        setCartItems(cartItems.filter(item => item.id !== productId));
        Alert.alert('Éxito', 'Producto eliminado del carrito');
      } else {
        Alert.alert('Error', 'Error al eliminar producto');
      }
    } catch (error: any) {
      console.error('Error removing item:', error);
      Alert.alert('Error', error.message || 'Error al eliminar producto');
    }
  };

  // ✅ ACTUALIZAR PARA USAR PRECIO CON DESCUENTO
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const finalPrice = item.discountedPrice || item.price;
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString('es-CO')}`;
  };

  const subtotal = calculateSubtotal();

  return {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    loadCartItems,
    subtotal,
    formatPrice,
  } as const;
}