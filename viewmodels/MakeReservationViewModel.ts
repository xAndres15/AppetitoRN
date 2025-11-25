// viewmodels/MakeReservationViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { auth } from '../lib/firebase';
import { Restaurant } from '../models/Reservation';
import { ReservationService } from '../services/ReservationService';

export function useMakeReservationViewModel(restaurant: Restaurant) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const result = await ReservationService.getUserData();
      
      if (result.success && result.data) {
        const fullName = `${result.data.name || ''} ${result.data.lastName || ''}`.trim();
        setName(fullName || '');
        setEmail(result.data.email || '');
        setPhone(result.data.phone || '');
      }
    } catch (error: any) {
      // Error silencioso, no afecta la experiencia del usuario
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const validateForm = (): boolean => {
    if (!date) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return false;
    }
    if (!time) {
      Alert.alert('Error', 'Por favor selecciona una hora');
      return false;
    }
    if (!numberOfPeople) {
      Alert.alert('Error', 'Por favor selecciona el número de personas');
      return false;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu teléfono');
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<{
    success: boolean;
    reservationId?: string;
    data?: {
      date: string;
      time: string;
      numberOfPeople: string;
      name: string;
      email: string;
      phone: string;
    };
  }> => {
    if (!validateForm()) return { success: false };

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para hacer una reserva');
      return { success: false };
    }

    if (!restaurant.firebaseId) {
      Alert.alert('Error', 'Error: Restaurante no válido');
      return { success: false };
    }

    setIsLoading(true);

    try {
      const dateString = date!.toISOString().split('T')[0];

      const reservationData = {
        userId: user.uid,
        userName: name.trim(),
        userPhone: phone.trim(),
        userEmail: email.trim(),
        date: dateString,
        time: time,
        numberOfPeople: parseInt(numberOfPeople),
        status: 'pending' as const,
        restaurantId: restaurant.firebaseId,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.location || restaurant.address || 'Ubicación no disponible',
      };

      const result = await ReservationService.createReservation(
        reservationData,
        restaurant.firebaseId
      );

      if (result.success) {
        Alert.alert('¡Éxito!', 'Reserva creada exitosamente');
        return { 
          success: true, 
          reservationId: result.reservationId || undefined,
          data: {
            date: dateString,
            time,
            numberOfPeople,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }
        };
      } else {
        Alert.alert('Error', result.error || 'Error al crear la reserva');
        return { success: false };
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la reserva');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const timeOptions = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
    '21:30', '22:00', '22:30', '23:00',
  ];

  const peopleOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: i === 0 ? '1 persona' : `${i + 1} personas`,
  }));

  const formatDateForDisplay = (date: Date): string => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} ${year}`;
  };

  return {
    date,
    setDate,
    time,
    setTime,
    numberOfPeople,
    setNumberOfPeople,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    isLoading,
    isLoadingUserData,
    handleSubmit,
    timeOptions,
    peopleOptions,
    formatDateForDisplay,
  } as const;
}