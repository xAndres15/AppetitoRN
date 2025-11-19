// viewmodels/AdminStatisticsViewModel.ts
import { useEffect, useState } from 'react';
import { AdminService } from '../services/AdminService';

export function useAdminStatisticsViewModel(restaurantId: string | null) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);

  useEffect(() => {
    if (restaurantId) {
      loadData();
    }
  }, [restaurantId]);

  const loadData = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Cargar nombre del restaurante
    const restaurantResult = await AdminService.getRestaurantInfo(restaurantId);
    if (restaurantResult.success && restaurantResult.data) {
      setRestaurantName(restaurantResult.data.name || 'Mi Restaurante');
    }

    // Cargar órdenes
    const ordersResult = await AdminService.getOrders(restaurantId);
    if (ordersResult.success && ordersResult.data) {
      const orders = ordersResult.data;
      setTotalOrders(orders.length);

      // Calcular ingresos totales
      const revenue = orders.reduce((sum, order) => sum + order.total, 0);
      setTotalRevenue(revenue);

      // Calcular ingresos de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= today;
      });
      const todayRev = todayOrders.reduce((sum, order) => sum + order.total, 0);
      setTodayRevenue(todayRev);

      // Calcular ingresos de esta semana
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= weekStart;
      });
      const weekRev = weekOrders.reduce((sum, order) => sum + order.total, 0);
      setWeekRevenue(weekRev);

      // Calcular ingresos de este mes
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= monthStart;
      });
      const monthRev = monthOrders.reduce((sum, order) => sum + order.total, 0);
      setMonthRevenue(monthRev);
    }

    // Cargar reservas
    const reservationsResult = await AdminService.getReservations(restaurantId);
    if (reservationsResult.success && reservationsResult.data) {
      setTotalReservations(reservationsResult.data.length);
    }

    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  return {
    restaurantName,
    loading,
    totalOrders,
    totalRevenue,
    totalReservations,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    formatPrice,
    loadData,
  } as const;
}