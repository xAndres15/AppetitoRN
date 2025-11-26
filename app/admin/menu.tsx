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
      onNavigateToDashboard={() => router.push('/admin/dashboard')}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToStatistics={() => router.push('/admin/statistics')}
      onNavigateToSettings={() => router.push('/admin/settings')}
      onNavigateToPromotions={() => router.push('/admin/promotions')}
      onNavigateToAddProduct={() =>
        router.push({
          pathname: '/admin/add-product',
          params: { restaurantId: restaurantId || '' },
        })
      }
      onNavigateToEditProduct={(product) => {
        if (!product.id || !restaurantId) return;

        router.push({
          pathname: '/admin/edit-product' as any,
          params: {
            productId: product.id,
            restaurantId: restaurantId,
          },
        });
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