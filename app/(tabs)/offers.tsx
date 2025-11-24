// app/(tabs)/offers.tsx
import { router } from 'expo-router';
import React from 'react';
import { Product } from '../../lib/firebase';
import { OffersScreen } from '../../screens/OffersScreen';

export default function Offers() {
  return (
    <OffersScreen
      onNavigateBack={() => router.back()}
      onNavigateToProduct={(product: Product, promotion) => { // ← RECIBIR PROMOCIÓN
        // Navegar con TODOS los datos del producto + promoción
        router.push({
          pathname: '/dish-detail',
          params: {
            id: product.id,
            dishId: product.id,
            restaurantId: product.restaurantId,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            image: product.image,
            category: product.category,
            available: product.available.toString(),
            createdAt: product.createdAt.toString(),
            // ✅ NUEVO: Datos de promoción
            hasPromotion: 'true',
            promotionDiscount: promotion.discount, // ej: "15% OFF"
            promotionTitle: promotion.title,
          },
        });
      }}
    />
  );
}