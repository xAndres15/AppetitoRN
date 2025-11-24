// app/admin/promotions.tsx
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminPromotionsScreen } from '../../screens/AdminPromotionsScreen';

export default function AdminPromotions() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  // ✅ Recargar cuando vuelve de crear/editar
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
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

  if (!restaurantId) {
    return null;
  }

  return (
    <AdminPromotionsScreen
      key={refreshKey}
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToDashboard={() => router.push('/admin/dashboard')}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToMenu={() => router.push('/admin/menu')}
      onNavigateToStatistics={() => router.push('/admin/statistics')}
      onNavigateToSettings={() => router.push('/admin/settings')}
      onNavigateToAddPromotion={() => router.push('/admin/add-promotion')}
      onNavigateToEditPromotion={(promotionId, restaurantId) => {
        router.push({
          pathname: '/admin/edit-promotion',
          params: { promotionId, restaurantId },
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