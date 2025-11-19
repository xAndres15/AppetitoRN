// app/admin/menu.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminMenuScreen } from '../../screens/AdminMenuScreen';

export default function AdminMenu() {
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
    <AdminMenuScreen
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/admin/reservations')}
      onNavigateToStatistics={() => router.push('/admin/statistics')} // TODO: Implementar
      onNavigateToSettings={() => {}} // TODO: Implementar
      onNavigateToPromotions={() => {}} // TODO: Implementar
      onNavigateToAddProduct={() => {}} // TODO: Implementar pantalla de agregar producto
      onNavigateToEditProduct={() => {}} // TODO: Implementar pantalla de editar producto
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