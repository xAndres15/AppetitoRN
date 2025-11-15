// app/(tabs)/profile.tsx
import { router } from 'expo-router';
import React from 'react';
import { ProfileScreen } from '../../screens/ProfileScreen';

export default function Profile() {
  const handleNavigateToRestaurant = (restaurantId: string) => {
    // Navegar al detalle del restaurante desde favoritos
    router.push({
      pathname: '/restaurant-detail' as any,
      params: {
        id: restaurantId,
        // Aquí deberías pasar todos los datos del restaurante
        // Por ahora solo pasamos el ID
      },
    });
  };
  

  return (
    <ProfileScreen
      onNavigateBack={() => router.back()}
      onNavigateToRestaurant={handleNavigateToRestaurant}
    />
  );
}