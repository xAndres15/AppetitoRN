// app/admin/add-product.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { AdminAddProductScreen } from '../../screens/AdminAddProductScreen';

export default function AdminAddProduct() {
  const params = useLocalSearchParams();
  const restaurantId = params.restaurantId as string;

  return (
    <AdminAddProductScreen
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
    />
  );
}