// app/admin/edit-promotion.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AdminEditPromotionScreen } from '../../screens/AdminEditPromotionScreen';

export default function AdminEditPromotion() {
  const params = useLocalSearchParams();
  const promotionId = params.promotionId as string;
  const restaurantId = params.restaurantId as string;

  if (!promotionId || !restaurantId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AdminEditPromotionScreen
      promotionId={promotionId}
      restaurantId={restaurantId}
      onNavigateBack={() => router.back()}
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