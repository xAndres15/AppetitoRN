// app/admin/menu.tsx
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminMenuScreen, AdminMenuScreenRef } from '../../screens/AdminMenuScreen';

export default function AdminMenu() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const screenRef = useRef<AdminMenuScreenRef>(null);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AdminMenuScreen
      ref={screenRef}
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToStatistics={() => router.push('/admin/statistics')}
      onNavigateToSettings={() => router.push('/admin/settings')}
      onNavigateToPromotions={() => {}}
      onNavigateToAddProduct={() =>
        router.push({
          pathname: '/admin/add-product',
          params: { restaurantId: restaurantId || '' },
        })
      }
      onNavigateToEditProduct={() => {}}
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