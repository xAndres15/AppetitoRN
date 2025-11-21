// viewmodels/AdminNotificationsSettingsViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getRestaurantInfo, updateRestaurantInfo } from '../lib/firebase';

interface NotificationSettings {
  newOrders: boolean;
  newReservations: boolean;
  reservationReminders: boolean;
  notificationSound: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  newOrders: true,
  newReservations: true,
  reservationReminders: false,
  notificationSound: 'Por defecto',
};

export function useAdminNotificationsSettingsViewModel(
  restaurantId: string | null,
  onNavigateBack: () => void
) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, [restaurantId]);

  const loadSettings = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getRestaurantInfo(restaurantId);

    if (result.success && result.info && result.info.notificationSettings) {
      setSettings(result.info.notificationSettings);
    }
    setLoading(false);
  };

  const toggleNewOrders = () => {
    setSettings((prev) => ({ ...prev, newOrders: !prev.newOrders }));
  };

  const toggleNewReservations = () => {
    setSettings((prev) => ({ ...prev, newReservations: !prev.newReservations }));
  };

  const toggleReservationReminders = () => {
    setSettings((prev) => ({ ...prev, reservationReminders: !prev.reservationReminders }));
  };

  const setNotificationSound = (sound: string) => {
    setSettings((prev) => ({ ...prev, notificationSound: sound }));
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'ID de restaurante no válido');
      return;
    }

    setSaving(true);
    const result = await updateRestaurantInfo(restaurantId, {
      notificationSettings: settings,
    });

    if (result.success) {
      Alert.alert('Éxito', 'Configuración de notificaciones actualizada', [
        { text: 'OK', onPress: onNavigateBack },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al guardar la configuración');
    }
    setSaving(false);
  };

  return {
    settings,
    loading,
    saving,
    toggleNewOrders,
    toggleNewReservations,
    toggleReservationReminders,
    setNotificationSound,
    handleSave,
  } as const;
}