// viewmodels/RestaurantDetailViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getRestaurantInfo } from '../lib/firebase';
import { Restaurant } from '../models/Reservation';

export function useRestaurantDetailViewModel(restaurant: Restaurant) {
  const [restaurantData, setRestaurantData] = useState<Restaurant>(restaurant);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadFullRestaurantData();
  }, [restaurant.id]);

  const loadFullRestaurantData = async () => {
    if (!restaurant.firebaseId && !restaurant.id) return;

    setIsLoading(true);
    try {
      const restaurantId = restaurant.firebaseId || restaurant.id;
      const result = await getRestaurantInfo(restaurantId);

      if (result.success && result.info) {
        // Merge con los datos básicos del restaurante
        setRestaurantData({
          ...restaurant,
          name: result.info.name || restaurant.name,
          description: result.info.description || restaurant.description,
          location: result.info.location || result.info.address || restaurant.location,
          phone: result.info.phone || restaurant.phone,
          schedule: result.info.schedule || restaurant.schedule,
          image: result.info.image || restaurant.image,
        });
      }
    } catch (error: any) {
      console.error('Error loading restaurant data:', error);
      Alert.alert('Error', 'No se pudo cargar la información completa del restaurante');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Aquí puedes agregar la lógica para guardar en favoritos en Firebase
  };

  // Horarios por defecto si no se proporcionan
  const getSchedule = () => {
    return restaurantData.schedule || [
      { day: 'Lunes', hours: '12:00 - 23:00' },
      { day: 'Martes', hours: '12:00 - 23:00' },
      { day: 'Miércoles', hours: '12:00 - 23:00' },
      { day: 'Jueves', hours: '12:00 - 23:00' },
      { day: 'Viernes', hours: '12:00 - 00:00' },
      { day: 'Sábado', hours: '12:00 - 00:00' },
      { day: 'Domingo', hours: '12:00 - 22:00' },
    ];
  };

  const getPhone = () => {
    return restaurantData.phone || '+57 322 750 1226';
  };

  return {
    restaurantData,
    isLoading,
    isFavorite,
    toggleFavorite,
    getSchedule,
    getPhone,
  } as const;
}