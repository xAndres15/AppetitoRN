// app/admin/dashboard.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getUserRole } from '../../lib/firebase';
import { AdminDashboardScreen } from '../../screens/AdminDashboardScreen';

export default function AdminDashboard() {
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
    <AdminDashboardScreen
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
      onLogout={async () => {
        await auth.signOut();
        router.replace('/login');
      }}
      onNavigateToOrders={() => router.push('/admin/orders')}
      onNavigateToReservations={() => router.push('/')}
      onNavigateToMenu={() => router.push('/')}
      onNavigateToStatistics={() => router.push('/')}
      onNavigateToSettings={() => router.push('/')}
      onNavigateToPromotions={() => router.push('/')}
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