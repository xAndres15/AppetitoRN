// viewmodels/AdminOrdersViewModel.ts
import { useEffect, useState } from 'react';
import { Order } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

export function useAdminOrdersViewModel(restaurantId: string | null) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantInfo();
      loadOrders();
    }
  }, [restaurantId]);

  const loadRestaurantInfo = async () => {
    if (!restaurantId) return;

    const result = await AdminService.getRestaurantInfo(restaurantId);
    if (result.success && result.data) {
      setRestaurantName(result.data.name || 'Mi Restaurante');
    }
  };

  const loadOrders = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await AdminService.getOrders(restaurantId);
    if (result.success && result.data) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  const formatOrderId = (id: string): string => {
    return '#' + id.slice(-8).toUpperCase();
  };

  const getStatusLabel = (status: Order['status']): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'preparing': 'Preparación',
      'ready': 'Listo',
      'delivering': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['status']): string => {
    const colorMap: { [key: string]: string } = {
      'pending': '#9CA3AF',
      'confirmed': '#3B82F6',
      'preparing': '#F97316',
      'ready': '#A855F7',
      'delivering': '#FBBF24',
      'delivered': '#10B981',
      'cancelled': '#EF4444',
    };
    return colorMap[status] || '#9CA3AF';
  };

  return {
    restaurantName,
    orders,
    loading,
    formatOrderId,
    getStatusLabel,
    getStatusColor,
    loadOrders,
  } as const;
}