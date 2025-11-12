// viewmodels/DishDetailViewModel.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { addToCart, auth, Product } from '../lib/firebase';

export function useDishDetailViewModel(dish: Product) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    // Aquí puedes agregar la lógica para guardar en favoritos en Firebase
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
      // Agregar cada unidad según la cantidad seleccionada
      for (let i = 0; i < quantity; i++) {
        const result = await addToCart(user.uid, dish.id, dish.restaurantId);
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
    // Convertir a string y agregar puntos como separador de miles
    const priceStr = Math.floor(price).toString();
    const formatted = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${formatted}`;
  };

  const calculateTotalPrice = () => {
    return dish.price * quantity;
  };

  return {
    quantity,
    incrementQuantity,
    decrementQuantity,
    isFavorite,
    toggleFavorite,
    handleAddToCart,
    formatPrice,
    calculateTotalPrice,
    isAddingToCart,
  } as const;
}