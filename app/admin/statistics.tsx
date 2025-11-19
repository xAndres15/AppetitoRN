// app/admin/statistics.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminStatisticsScreen } from '../../screens/AdminStatisticsScreen';

export default function AdminStatistics() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

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
    <AdminStatisticsScreen
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToMenu={() => router.push('/admin/menu')}
      onNavigateToSettings={() => {}} // TODO: Implementar
      onNavigateToPromotions={() => {}} // TODO: Implementar
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