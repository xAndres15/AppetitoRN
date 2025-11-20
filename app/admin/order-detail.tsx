// app/admin/order-detail.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Order } from '../../lib/firebase';
import { AdminOrderDetailScreen } from '../../screens/AdminOrderDetailScreen';

export default function AdminOrderDetail() {
  const params = useLocalSearchParams();
  
  // Parse the order from params
  const order: Order = params.order ? JSON.parse(params.order as string) : null;
  const restaurantId = params.restaurantId as string;

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AdminOrderDetailScreen
      order={order}
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onOrderUpdated={() => {
        // Esperar un momento antes de regresar para asegurar que Firebase se actualice
        setTimeout(() => {
          router.back();
        }, 500); // ← AGREGAR DELAY DE 500ms
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});