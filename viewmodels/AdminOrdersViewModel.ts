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
    return id.substring(0, 8).toUpperCase();
  };

  const getStatusLabel = (status: Order['status']): string => {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparación',
      ready: 'Listo',
      delivering: 'En Camino',
      cancelled: 'Cancelado',
      delivered: 'Entregado',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['status']): string => {
    const colorMap: { [key: string]: string } = {
      pending: '#9CA3AF',
      confirmed: '#3B82F6',
      preparing: '#F97316',
      ready: '#8B5CF6',
      delivering: '#8B5CF6',
      cancelled: '#EF4444',
      delivered: '#10B981',
    };
    return colorMap[status] || '#9CA3AF';
  };

  // ← AGREGAR ESTA FUNCIÓN
  const reload = () => {
    loadOrders();
  };

  return {
    restaurantName,
    orders,
    loading,
    formatOrderId,
    getStatusLabel,
    getStatusColor,
    reload, // ← EXPORTAR LA FUNCIÓN
  } as const;
}