// app/dish-detail.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Product } from '../lib/firebase';
import { DishDetailScreen } from '../screens/DishDetailScreen';

export default function DishDetail() {
  const params = useLocalSearchParams();
  
  // Función helper para obtener string desde params
  const getParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  // Validar que tenemos todos los parámetros necesarios
  if (!params.id || !params.name) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Información del producto incompleta</Text>
      </View>
    );
  }

  // Reconstruir el objeto dish desde los parámetros
  const dish = {
    id: getParam(params.id),
    name: getParam(params.name),
    description: getParam(params.description),
    price: Number(getParam(params.price)) || 0,
    image: getParam(params.image),
    category: getParam(params.category),
    restaurantId: getParam(params.restaurantId),
    available: getParam(params.available) === 'true',
  } as Product;

  return (
    <DishDetailScreen
      dish={dish}
      onNavigateBack={() => router.back()}
      onAddToCart={() => router.push('/(tabs)/cart')}
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