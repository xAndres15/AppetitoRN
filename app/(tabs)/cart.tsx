// app/(tabs)/cart.tsx
import { router } from 'expo-router';
import React from 'react';
import { CartScreen } from '../../screens/CartScreen';
import { CartItem } from '../../viewmodels/CartViewModel';

export default function Cart() {
  const handleCheckout = (subtotal: number, items: CartItem[]) => {
    // Por ahora solo mostramos el total
    console.log('Ir a checkout con:', subtotal, items);
    // Cuando tengas el CheckoutScreen:
    // router.push({ pathname: '/checkout', params: { subtotal } });
  };

  return (
    <CartScreen
      onNavigateBack={() => router.back()}
      onNavigateToCheckout={handleCheckout}
    />
  );
}