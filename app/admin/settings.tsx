// app/admin/settings.tsx
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { auth } from '../../lib/firebase';
import { AdminSettingsScreen } from '../../screens/AdminSettingsScreen';

export default function AdminSettings() {
  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await auth.signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <AdminSettingsScreen
      onNavigateBack={() => router.back()}
      onLogout={handleLogout}
      onNavigateToRestaurantInfo={() => {
        router.push('/admin/restaurant-info-edit'); // ← ACTUALIZADO
      }}
      onNavigateToOperatingHours={() => {
        // TODO: Implementar pantalla de horarios
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      }}
      onNavigateToNotifications={() => {
        // TODO: Implementar pantalla de notificaciones
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      }}
      onNavigateToPaymentMethods={() => {
        // TODO: Implementar pantalla de métodos de pago
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      }}
    />
  );
}