// app/dish-detail.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Product } from '../lib/firebase';
import { DishDetailScreen } from '../screens/DishDetailScreen';

export default function DishDetail() {
  const params = useLocalSearchParams();
  
  const getParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  const dishId = getParam(params.id || params.dishId);
  const restaurantId = getParam(params.restaurantId);
  
  if (!dishId || !restaurantId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: ID del plato o restaurante no proporcionado
        </Text>
      </View>
    );
  }

  const dish: Product = {
    id: dishId,
    name: getParam(params.name) || '',
    description: getParam(params.description) || '',
    price: Number(getParam(params.price)) || 0,
    image: getParam(params.image) || '',
    category: getParam(params.category) || '',
    restaurantId: restaurantId,
    available: getParam(params.available) !== 'false',
    createdAt: Number(getParam(params.createdAt)) || Date.now(),
  };

  // ✅ DATOS DE PROMOCIÓN
  const hasPromotion = getParam(params.hasPromotion) === 'true';
  const promotionDiscount = getParam(params.promotionDiscount);
  const promotionTitle = getParam(params.promotionTitle);

  return (
    <DishDetailScreen
      dish={dish}
      onNavigateBack={() => router.back()}
      onAddToCart={() => router.push('/(tabs)/cart')}
      hasPromotion={hasPromotion}
      promotionDiscount={promotionDiscount}
      promotionTitle={promotionTitle}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});