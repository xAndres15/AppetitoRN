// viewmodels/DishDetailViewModel.ts - REEMPLAZAR FUNCIÓN COMPLETA

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  addDishFavorite,
  addToCart,
  auth,
  getProductById,
  isDishFavorite,
  Product,
  removeDishFavorite
} from '../lib/firebase';

// ✅ NUEVA INTERFACE PARA PROMOCIÓN
interface PromotionData {
  hasPromotion: boolean;
  promotionDiscount: string;
  promotionTitle: string;
}

export function useDishDetailViewModel(
  dish: Product,
  promotionData?: PromotionData // ✅ NUEVO PARÁMETRO
) {
  const [dishData, setDishData] = useState<Product>(dish);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);

  // ✅ CALCULAR PRECIO CON DESCUENTO
  const parseDiscount = (discountText: string): number => {
    const match = discountText.match(/(\d+)%/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  };

  const originalPrice = dishData.price;
  const discountPercentage = promotionData ? parseDiscount(promotionData.promotionDiscount) : 0;
  const discountedPrice = discountPercentage > 0 
    ? originalPrice * (1 - discountPercentage / 100)
    : originalPrice;

  useEffect(() => {
    if (!dish.name || dish.price === 0) {
      loadDishData();
    }
    checkIfFavorite();
  }, [dish.id]);

  const loadDishData = async () => {
    if (!dish.id || !dish.restaurantId) return;
    
    try {
      const result = await getProductById(dish.id, dish.restaurantId);
      
      if (result.success && result.product) {
        setDishData({
          ...result.product,
          id: dish.id,
          restaurantId: dish.restaurantId,
        });
      }
    } catch (error) {
      console.error('Error loading dish:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !dish.id) {
        setCheckingFavorite(false);
        return;
      }

      const result = await isDishFavorite(user.uid, dish.id);
      if (result.success) {
        setIsFavoriteState(result.isFavorite);
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setCheckingFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para agregar favoritos');
        return;
      }

      if (!dish.id) {
        Alert.alert('Error', 'Información del plato incompleta');
        return;
      }

      if (isFavoriteState) {
        const result = await removeDishFavorite(user.uid, dish.id);
        if (result.success) {
          setIsFavoriteState(false);
          Alert.alert('Éxito', 'Plato eliminado de favoritos');
        }
      } else {
        const result = await addDishFavorite(user.uid, {
          dishId: dish.id,
          dishName: dishData.name,
          dishImage: dishData.image,
          dishCategory: dishData.category,
          dishPrice: dishData.price,
          restaurantId: dish.restaurantId,
          restaurantName: 'Appetito',
        });
        
        if (result.success) {
          setIsFavoriteState(true);
          Alert.alert('Éxito', 'Plato agregado a favoritos');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar favoritos');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para agregar al carrito');
      return { success: false };
    }

    if (!dish.id || !dish.restaurantId) {
      Alert.alert('Error', 'Información del producto incompleta');
      return { success: false };
    }

    setIsAddingToCart(true);

    try {
      // ✅ PREPARAR DATOS DE PROMOCIÓN SI EXISTEN
      const cartPromotionData = promotionData && discountPercentage > 0 ? {
        hasPromotion: true,
        promotionDiscount: promotionData.promotionDiscount,
        promotionTitle: promotionData.promotionTitle,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
      } : undefined;

      for (let i = 0; i < quantity; i++) {
        const result = await addToCart(
          user.uid, 
          dish.id, 
          dish.restaurantId,
          1, // ← quantity individual
          cartPromotionData // ← ✅ PASAR DATOS DE PROMOCIÓN
        );
        
        if (!result.success) {
          Alert.alert('Error', result.error || 'Error al agregar al carrito');
          setIsAddingToCart(false);
          return { success: false };
        }
      }

      Alert.alert('Éxito', `${quantity} producto${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`);
      return { success: true };
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', error.message || 'Error al agregar al carrito');
      return { success: false };
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    const priceStr = Math.floor(price).toString();
    const formatted = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formatted}`;
  };

  const calculateTotalPrice = () => {
    return dishData.price * quantity;
  };

  return {
    dishData,
    quantity,
    incrementQuantity,
    decrementQuantity,
    isFavorite: isFavoriteState,
    toggleFavorite,
    handleAddToCart,
    formatPrice,
    calculateTotalPrice,
    isAddingToCart,
    checkingFavorite,
  } as const;
}