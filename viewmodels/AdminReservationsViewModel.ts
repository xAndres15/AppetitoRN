// viewmodels/AdminReservationsViewModel.ts
import { useEffect, useState } from 'react';
import { Reservation } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

export function useAdminReservationsViewModel(restaurantId: string | null) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantInfo();
      loadReservations();
    }
  }, [restaurantId]);

  const loadRestaurantInfo = async () => {
    if (!restaurantId) return;

    const result = await AdminService.getRestaurantInfo(restaurantId);
    if (result.success && result.data) {
      setRestaurantName(result.data.name || 'Mi Restaurante');
    }
  };

  const loadReservations = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await AdminService.getReservations(restaurantId);
    if (result.success && result.data) {
      setReservations(result.data);
    }
    setLoading(false);
  };

  const formatReservationId = (id: string): string => {
    return id.substring(0, 8).toUpperCase();
  };

  const getStatusLabel = (status: Reservation['status']): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'completed': 'Completada',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Reservation['status']): string => {
    const colorMap: { [key: string]: string } = {
      'pending': '#FBBF24',
      'confirmed': '#10B981',
      'cancelled': '#EF4444',
      'completed': '#3B82F6',
    };
    return colorMap[status] || '#9CA3AF';
  };

  return {
    restaurantName,
    reservations,
    loading,
    formatReservationId,
    getStatusLabel,
    getStatusColor,
    loadReservations,
  } as const;
}