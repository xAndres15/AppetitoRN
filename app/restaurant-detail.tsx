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

  // Validar que tenemos los parámetros necesarios
  if (!params.id || !params.name) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: Información del restaurante incompleta
        </Text>
      </View>
    );
  }

  // Parsear el schedule
  let schedule: { day: string; hours: string }[] = [];
  try {
    const scheduleParam = getParam(params.schedule);
    if (scheduleParam) {
      schedule = JSON.parse(scheduleParam);
    }
  } catch (error) {
    console.error('Error parsing schedule:', error);
  }

  // Reconstruir el objeto restaurant desde los parámetros
  const restaurant: Restaurant = {
    id: getParam(params.id),
    firebaseId: getParam(params.id),
    name: getParam(params.name),
    description: getParam(params.description),
    location: getParam(params.location),
    image: getParam(params.image),
    phone: getParam(params.phone),
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