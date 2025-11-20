// app/admin/reservations.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminReservationsScreen } from '../../screens/AdminReservationsScreen';

export default function AdminReservations() {
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
    <AdminReservationsScreen
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToMenu={() => router.push('/admin/menu')} // TODO: Implementar cuando esté listo
      onNavigateToStatistics={() => router.push('/admin/statistics')} // TODO: Implementar cuando esté listo
      onNavigateToSettings={() => router.push('/admin/settings')} // TODO: Implementar cuando esté listo
      onNavigateToPromotions={() => {}} // TODO: Implementar cuando esté listo
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