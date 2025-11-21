// viewmodels/AdminOperatingHoursViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getRestaurantInfo, updateRestaurantInfo } from '../lib/firebase';

interface Schedule {
  day: string;
  hours: string;
  isOpen: boolean;
}

const DEFAULT_SCHEDULE: Schedule[] = [
  { day: 'Lunes', hours: '12:00 - 23:00', isOpen: true },
  { day: 'Martes', hours: '12:00 - 23:00', isOpen: true },
  { day: 'Miércoles', hours: '12:00 - 23:00', isOpen: true },
  { day: 'Jueves', hours: '12:00 - 23:00', isOpen: true },
  { day: 'Viernes', hours: '12:00 - 00:00', isOpen: true },
  { day: 'Sábado', hours: '12:00 - 00:00', isOpen: true },
  { day: 'Domingo', hours: '12:00 - 22:00', isOpen: true },
];

export function useAdminOperatingHoursViewModel(
  restaurantId: string | null,
  onNavigateBack: () => void
) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<Schedule[]>(DEFAULT_SCHEDULE);

  useEffect(() => {
    loadSchedule();
  }, [restaurantId]);

  const loadSchedule = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getRestaurantInfo(restaurantId);

    if (result.success && result.info && result.info.schedule) {
      setSchedule(result.info.schedule);
    }
    setLoading(false);
  };

  const handleHoursChange = (index: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index].hours = value;
    setSchedule(newSchedule);
  };

  const handleToggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;

    if (!newSchedule[index].isOpen) {
      newSchedule[index].hours = 'Cerrado';
    } else if (newSchedule[index].hours === 'Cerrado') {
      newSchedule[index].hours = '12:00 - 23:00';
    }

    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'ID de restaurante no válido');
      return;
    }

    setSaving(true);
    const result = await updateRestaurantInfo(restaurantId, { schedule });

    if (result.success) {
      Alert.alert('Éxito', 'Horarios actualizados correctamente', [
        { text: 'OK', onPress: onNavigateBack },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al guardar los horarios');
    }
    setSaving(false);
  };

  return {
    schedule,
    loading,
    saving,
    handleHoursChange,
    handleToggleDay,
    handleSave,
  } as const;
}