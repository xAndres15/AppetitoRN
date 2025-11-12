// app/(tabs)/cart.tsx
import { router } from 'expo-router';
import React from 'react';
import { CartScreen } from '../../screens/CartScreen';
import { CartItem } from '../../viewmodels/CartViewModel';

export default function Cart() {
  const handleCheckout = (subtotal: number, items: CartItem[]) => {
    router.push({
      pathname: '/checkout',
      params: {
        subtotal: subtotal.toString(),
      },
    });
  };

  return (
    <CartScreen
      onNavigateBack={() => router.back()}
      onNavigateToCheckout={handleCheckout}
    />
  );
}