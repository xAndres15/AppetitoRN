// app/order.tsx
import { router } from 'expo-router';
import React from 'react';
import { Product } from '../lib/firebase';
import { OrderScreen } from '../screens/OrderScreen';

export default function Order() {
  const handleSelectDish = (dish: Product) => {
    // Navegar al detalle del plato pasando todos los datos necesarios
    router.push({
      pathname: '/dish-detail',
      params: {
        id: dish.id || '',
        name: dish.name || '',
        description: dish.description || '',
        price: String(dish.price || 0),
        image: dish.image || '',
        category: dish.category || '',
        restaurantId: dish.restaurantId || '',
        available: String(dish.available ?? true),
      },
    });
  };

  return (
    <OrderScreen
      onNavigateBack={() => router.back()}
      onSelectDish={handleSelectDish}
    />
  );
}