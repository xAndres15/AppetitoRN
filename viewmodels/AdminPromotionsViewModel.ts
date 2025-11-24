// viewmodels/AdminPromotionsViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Promotion } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

export function useAdminPromotionsViewModel(restaurantId: string | null) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');

  useEffect(() => {
    if (restaurantId) {
      loadData();
    }
  }, [restaurantId]);

  const loadData = async () => {
    if (!restaurantId) return;

    setLoading(true);

    // Cargar información del restaurante
    const restaurantResult = await AdminService.getRestaurantInfo(restaurantId);
    if (restaurantResult.success && restaurantResult.data) {
      setRestaurantName(restaurantResult.data.name || 'Mi Restaurante');
    }

    // Cargar promociones
    await loadPromotions();

    setLoading(false);
  };

  const loadPromotions = async () => {
    if (!restaurantId) return;

    const result = await AdminService.getPromotions(restaurantId);
    if (result.success && result.data) {
      setPromotions(result.data);
    } else {
      setPromotions([]);
    }
  };

  const toggleActiveStatus = async (promotionId: string, currentStatus: boolean) => {
    if (!restaurantId) return;

    const result = await AdminService.updatePromotion(promotionId, restaurantId, {
      active: !currentStatus,
    });

    if (result.success) {
      Alert.alert(
        'Éxito',
        currentStatus ? 'Promoción desactivada' : 'Promoción activada'
      );
      loadPromotions();
    } else {
      Alert.alert('Error', result.error || 'No se pudo actualizar la promoción');
    }
  };

  const deletePromotion = async (promotionId: string) => {
    if (!restaurantId) return;

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta promoción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await AdminService.deletePromotion(promotionId, restaurantId);
            if (result.success) {
              Alert.alert('Éxito', 'Promoción eliminada');
              loadPromotions();
            } else {
              Alert.alert('Error', result.error || 'No se pudo eliminar la promoción');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const reload = () => {
    loadData();
  };

  return {
    restaurantName,
    promotions,
    loading,
    toggleActiveStatus,
    deletePromotion,
    formatDate,
    reload,
  } as const;
}