// viewmodels/RestaurantDetailViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  addFavorite,
  auth,
  getRestaurantInfo,
  getRestaurantRatingStats,
  getRestaurantReviews,
  isFavorite,
  removeFavorite,
  RestaurantRatingStats,
  RestaurantReview,
} from '../lib/firebase';
import { Restaurant } from '../models/Reservation';

export function useRestaurantDetailViewModel(restaurant: Restaurant) {
  const [restaurantData, setRestaurantData] = useState<Restaurant>(restaurant);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);

  // ✅ NUEVOS ESTADOS PARA REVIEWS
  const [reviews, setReviews] = useState<RestaurantReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [ratingStats, setRatingStats] = useState<RestaurantRatingStats | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    loadFullRestaurantData();
    checkIfFavorite();
    loadReviews();
    loadRatingStats();
  }, [restaurant.id]);

  const loadFullRestaurantData = async () => {
    if (!restaurant.firebaseId && !restaurant.id) return;

    setIsLoading(true);
    try {
      const restaurantId = restaurant.firebaseId || restaurant.id;
      const result = await getRestaurantInfo(restaurantId);

      if (result.success && result.info) {
        setRestaurantData({
          ...restaurant,
          name: result.info.name || restaurant.name,
          description: result.info.description || restaurant.description,
          location: result.info.location || result.info.address || restaurant.location,
          phone: result.info.phone || restaurant.phone,
          schedule: result.info.schedule || restaurant.schedule,
          image: result.info.image || restaurant.image,
          cuisine: result.info.cuisine || restaurant.cuisine,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar la información completa del restaurante');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setCheckingFavorite(false);
        return;
      }

      const restaurantId = restaurant.firebaseId || restaurant.id;
      const result = await isFavorite(user.uid, restaurantId);

      if (result.success) {
        setIsFavoriteState(result.isFavorite);
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setCheckingFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para agregar favoritos');
        return;
      }

      const restaurantId = restaurant.firebaseId || restaurant.id;

      if (isFavoriteState) {
        // Remover de favoritos
        const result = await removeFavorite(user.uid, restaurantId);
        if (result.success) {
          setIsFavoriteState(false);
          Alert.alert('Éxito', 'Restaurante eliminado de favoritos');
        } else {
          Alert.alert('Error', result.error || 'Error al eliminar de favoritos');
        }
      } else {
        // Agregar a favoritos
        const result = await addFavorite(user.uid, {
          restaurantId: restaurantId,
          restaurantName: restaurantData.name,
          restaurantImage: restaurantData.image,
          restaurantCategory: restaurantData.cuisine || restaurantData.description,
          restaurantRating: 4.5,
          restaurantReviews: 100,
          restaurantDistance: '1.2 km',
          restaurantDeliveryTime: '25-30 min',
          firebaseId: restaurantId,
        });

        if (result.success) {
          setIsFavoriteState(true);
          Alert.alert('Éxito', 'Restaurante agregado a favoritos');
        } else {
          Alert.alert('Error', result.error || 'Error al agregar a favoritos');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar favoritos');
    }
  };

  // ✅ NUEVA FUNCIÓN: Cargar reviews del restaurante
  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const restaurantId = restaurant.firebaseId || restaurant.id;
      const result = await getRestaurantReviews(restaurantId);

      if (result.success && result.reviews) {
        setReviews(result.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Cargar estadísticas de rating
  const loadRatingStats = async () => {
    try {
      const restaurantId = restaurant.firebaseId || restaurant.id;
      const result = await getRestaurantRatingStats(restaurantId);

      if (result.success && result.stats) {
        setRatingStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading rating stats:', error);
    }
  };

  // ✅ NUEVA FUNCIÓN: Toggle mostrar todas las reviews
  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

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

  // ✅ NUEVAS PROPIEDADES CALCULADAS
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const hasMoreReviews = reviews.length > 3;

  return {
    restaurantData,
    isLoading,
    isFavorite: isFavoriteState,
    checkingFavorite,
    toggleFavorite,
    getSchedule,
    getPhone,
    // ✅ NUEVAS PROPIEDADES PARA REVIEWS
    reviews,
    loadingReviews,
    ratingStats,
    showAllReviews,
    toggleShowAllReviews,
    displayedReviews,
    hasMoreReviews,
  } as const;
}