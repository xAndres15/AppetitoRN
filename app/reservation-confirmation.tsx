// app/reservation-confirmation.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReservationConfirmationScreen } from '../screens/ReservationConfirmationScreen';

export default function ReservationConfirmation() {
  const params = useLocalSearchParams();

  const getParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  // Validar que tenemos los parámetros necesarios
  if (!params.date || !params.time || !params.numberOfPeople) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: Datos de la reserva incompletos
        </Text>
      </View>
    );
  }

  const reservationData = {
    date: getParam(params.date),
    time: getParam(params.time),
    numberOfPeople: getParam(params.numberOfPeople),
    name: getParam(params.name),
    email: getParam(params.email),
    phone: getParam(params.phone),
    restaurantName: getParam(params.restaurantName),
    restaurantLocation: getParam(params.restaurantLocation),
    reservationId: getParam(params.reservationId),
  };

  return (
    <ReservationConfirmationScreen
      reservationData={reservationData}
      onNavigateBack={() => router.back()}
      onNavigateHome={() => router.push('/(tabs)/home')}
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