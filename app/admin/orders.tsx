// app/admin/orders.tsx
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole, Order } from '../../lib/firebase';
import { AdminOrdersScreen, AdminOrdersScreenRef } from '../../screens/AdminOrdersScreen';

export default function AdminOrders() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const screenRef = useRef<AdminOrdersScreenRef>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  // Recargar cuando la pantalla vuelve al foco
  useFocusEffect(
    useCallback(() => {
      if (screenRef.current && !loading) {
        screenRef.current.reload();
      }
    }, [loading])
  );

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const roleResult = await getUserRole(user.uid);
      if (roleResult.success && roleResult.restaurantId) {
        setRestaurantId(roleResult.restaurantId);
      }
    }
    setLoading(false);
  };

  const handleNavigateToOrderDetail = (order: Order) => {
    router.push({
      pathname: '/admin/order-detail',
      params: {
        order: JSON.stringify(order),
        restaurantId: restaurantId || '',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AdminOrdersScreen
      ref={screenRef}
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToMenu={() => router.push('/admin/menu')}
      onNavigateToStatistics={() => router.push('/admin/statistics')}
      onNavigateToSettings={() => router.push('/admin/settings')}
      onNavigateToPromotions={() => {}}
      onNavigateToOrderDetail={handleNavigateToOrderDetail}
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