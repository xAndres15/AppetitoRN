// viewmodels/AdminViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  getRestaurantRatingStats,
  getRestaurantReviews,
  Order,
  Reservation,
  RestaurantRatingStats,
  RestaurantReview,
} from '../lib/firebase';
import { AdminService } from '../services/AdminService';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export function useAdminViewModel(restaurantId: string | null) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesChartData, setSalesChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [0] }],
  });

  // ✅ NUEVOS ESTADOS PARA REVIEWS
  const [restaurantReviews, setRestaurantReviews] = useState<RestaurantReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [ratingStats, setRatingStats] = useState<RestaurantRatingStats | null>(null);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantInfo();
      loadData();
      loadRestaurantReviews();
      loadRatingStats();
    }
  }, [restaurantId]);

  const loadRestaurantInfo = async () => {
    if (!restaurantId) return;

    const result = await AdminService.getRestaurantInfo(restaurantId);
    if (result.success && result.data) {
      setRestaurantName(result.data.name || 'Mi Restaurante');
      setIsOpen(result.data.isOpen !== undefined ? result.data.isOpen : true);
    }
  };

  const loadData = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Cargar pedidos
    const ordersResult = await AdminService.getOrders(restaurantId);
    if (ordersResult.success && ordersResult.data) {
      setOrders(ordersResult.data.slice(0, 5));
      generateSalesChart(ordersResult.data);
    }

    // Cargar reservas
    const reservationsResult = await AdminService.getReservations(restaurantId);
    if (reservationsResult.success && reservationsResult.data) {
      setReservations(reservationsResult.data.slice(0, 5));
    }

    setLoading(false);
  };

  // ✅ NUEVA FUNCIÓN: Cargar reviews del restaurante
  const loadRestaurantReviews = async () => {
    if (!restaurantId) return;

    try {
      setLoadingReviews(true);
      const result = await getRestaurantReviews(restaurantId);

      if (result.success && result.reviews) {
        // Mostrar solo las últimas 5 reviews
        setRestaurantReviews(result.reviews.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading restaurant reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Cargar estadísticas de rating
  const loadRatingStats = async () => {
    if (!restaurantId) return;

    try {
      const result = await getRestaurantRatingStats(restaurantId);

      if (result.success && result.stats) {
        setRatingStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading rating stats:', error);
    }
  };

  // ✅ NUEVA FUNCIÓN: Toggle mostrar reviews
  const toggleShowReviews = () => {
    setShowReviews(!showReviews);
  };

  const generateSalesChart = (allOrders: Order[]) => {
    const labels: string[] = [];
    const data: number[] = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = allOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDay;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

      labels.push(days[date.getDay()]);
      data.push(dayRevenue);
    }

    setSalesChartData({
      labels,
      datasets: [{ data: data.length > 0 && data.some((d) => d > 0) ? data : [0] }],
    });
  };

  const toggleOpenStatus = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'No se ha configurado el restaurante');
      return;
    }

    const result = await AdminService.updateRestaurantStatus(restaurantId, !isOpen);
    if (result.success) {
      setIsOpen(!isOpen);
      Alert.alert('Éxito', `Restaurante ${!isOpen ? 'abierto' : 'cerrado'}`);
    } else {
      Alert.alert('Error', 'Error al actualizar el estado');
    }
  };

  const formatOrderId = (id: string): string => {
    return '#' + id.slice(-8).toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const getStatusLabel = (status: Order['status']): string => {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparación',
      ready: 'Listo',
      delivering: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['status']): string => {
    const colorMap: { [key: string]: string } = {
      pending: '#9CA3AF',
      confirmed: '#3B82F6',
      preparing: '#F97316',
      ready: '#A855F7',
      delivering: '#FBBF24',
      delivered: '#10B981',
      cancelled: '#EF4444',
    };
    return colorMap[status] || '#9CA3AF';
  };

  const todayIncome = orders
    .filter((o) => {
      const today = new Date();
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((sum, order) => sum + order.total, 0);

  return {
    restaurantName,
    isOpen,
    orders,
    reservations,
    loading,
    todayIncome,
    salesChartData,
    toggleOpenStatus,
    formatOrderId,
    formatDate,
    getStatusLabel,
    getStatusColor,
    loadData,
    // ✅ NUEVAS PROPIEDADES PARA REVIEWS
    restaurantReviews,
    loadingReviews,
    showReviews,
    toggleShowReviews,
    ratingStats,
  } as const;
}