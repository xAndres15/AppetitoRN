// app/make-reservation.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../models/Reservation';
import { MakeReservationScreen } from '../screens/MakeReservationScreen';

export default function MakeReservation() {
  const params = useLocalSearchParams();

  const getParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  if (!params.restaurantId || !params.restaurantName) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: Información del restaurante incompleta
        </Text>
      </View>
    );
  }

  const restaurant: Restaurant = {
    id: getParam(params.restaurantId),
    firebaseId: getParam(params.restaurantId),
    name: getParam(params.restaurantName),
    description: '',
    location: getParam(params.restaurantLocation) || '',
    image: getParam(params.restaurantImage),
  };

  const handleReservationSuccess = (reservationData: any) => {
    
    // Intenta con diferentes formatos
    try {
      router.replace({
        pathname: '/reservation-confirmation',
        params: {
          date: String(reservationData.date),
          time: String(reservationData.time),
          numberOfPeople: String(reservationData.numberOfPeople),
          name: String(reservationData.name),
          email: String(reservationData.email),
          phone: String(reservationData.phone),
          restaurantName: String(reservationData.restaurantName),
          restaurantLocation: String(reservationData.restaurantLocation),
          reservationId: String(reservationData.reservationId || ''),
        },
      });
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  return (
    <MakeReservationScreen
      restaurant={restaurant}
      onNavigateBack={() => router.back()}
      onReservationSuccess={handleReservationSuccess}
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