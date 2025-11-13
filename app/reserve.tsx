// app/reserve.tsx
import { router } from 'expo-router';
import React from 'react';
import { Restaurant } from '../models/Reservation';
import { ReserveScreen } from '../screens/ReserveScreen';

export default function Reserve() {
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    router.push({
      pathname: '/restaurant-detail' as any, // ← Agregar 'as any' para resolver el error de TypeScript
      params: {
        id: restaurant.firebaseId || restaurant.id || '',
        name: restaurant.name || '',
        description: restaurant.description || '',
        location: restaurant.location || '',
        image: restaurant.image || '',
        phone: restaurant.phone || '',
        schedule: JSON.stringify(restaurant.schedule || []),
      },
    });
  };

  return (
    <ReserveScreen
      onNavigateBack={() => router.back()}
      onSelectRestaurant={handleSelectRestaurant}
    />
  );
}