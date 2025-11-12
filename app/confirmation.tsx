// app/confirmation.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';

export default function Confirmation() {
  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const restaurantId = params.restaurantId as string;
  const subtotal = Number(params.subtotal) || 0;
  const deliveryFee = Number(params.deliveryFee) || 0;
  const tip = Number(params.tip) || 0;
  const deliveryTime = (params.deliveryTime as string) || '30-45 min';
  
  // Parsear los items del JSON
  let items: any[] = [];
  try {
    if (params.items && typeof params.items === 'string') {
      items = JSON.parse(params.items);
    }
  } catch (error) {
    console.error('Error parsing items:', error);
  }

  if (!orderId || !restaurantId || items.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Datos del pedido incompletos</Text>
      </View>
    );
  }

  return (
    <OrderConfirmationScreen
      orderId={orderId}
      restaurantId={restaurantId}
      items={items}
      subtotal={subtotal}
      deliveryFee={deliveryFee}
      tip={tip}
      deliveryTime={deliveryTime}
      onNavigateToHome={() => router.push('/(tabs)/home')}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});