// app/restaurant-detail.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../models/Reservation';
import { RestaurantDetailScreen } from '../screens/RestaurantDetailScreen';

export default function RestaurantDetail() {
  const params = useLocalSearchParams();

  // Helper para obtener string desde params
  const getParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  // Solo validar que tenemos el ID
  if (!params.id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: ID del restaurante no proporcionado
        </Text>
      </View>
    );
  }

  const restaurantId = getParam(params.id);

  // Parsear el schedule si existe
  let schedule: { day: string; hours: string }[] = [];
  try {
    const scheduleParam = getParam(params.schedule);
    if (scheduleParam) {
      schedule = JSON.parse(scheduleParam);
    }
  } catch (error) {
    console.error('Error parsing schedule:', error);
  }

  // Crear el objeto restaurant con los datos disponibles
  // Si faltan datos, RestaurantDetailViewModel los cargará desde Firebase
  const restaurant: Restaurant = {
    id: restaurantId,
    firebaseId: restaurantId,
    name: getParam(params.name) || '', // Puede estar vacío
    description: getParam(params.description) || '',
    location: getParam(params.location) || '',
    image: getParam(params.image) || '',
    phone: getParam(params.phone) || '',
    schedule: schedule.length > 0 ? schedule : undefined,
  };

  const handleNavigateToReservation = (rest: Restaurant) => {
    router.push({
      pathname: '/make-reservation' as any,
      params: {
        restaurantId: rest.firebaseId || rest.id,
        restaurantName: rest.name,
        restaurantImage: rest.image || '',
        restaurantLocation: rest.location || '',
      },
    });
  };

  return (
    <RestaurantDetailScreen
      restaurant={restaurant}
      onNavigateBack={() => router.back()}
      onNavigateToReservation={handleNavigateToReservation}
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