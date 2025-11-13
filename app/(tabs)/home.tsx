// app/(tabs)/home.tsx
import { router } from 'expo-router';
import React from 'react';
import { Product } from '../../lib/firebase';
import { HomeScreen } from '../../screens/HomeScreen';

export default function Home() {
  const handleNavigateToDishDetail = (dish: Product) => {
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
    <HomeScreen
      onNavigateToOrder={() => router.push('/order')}
      onNavigateToReserve={() => router.push('/reserve')} 
      onNavigateToCart={() => router.push('/(tabs)/cart')}
      onNavigateToDishDetail={handleNavigateToDishDetail}
    />
  );
}