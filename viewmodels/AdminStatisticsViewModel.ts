// viewmodels/AdminStatisticsViewModel.ts
import { useEffect, useState } from 'react';
import { Order } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface ProductSales {
  name: string;
  quantity: number;
}

interface OrderStatusData {
  name: string;
  count: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export function useAdminStatisticsViewModel(restaurantId: string | null) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  
  // Datos para gráficas
  const [salesChartData, setSalesChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [topProductsData, setTopProductsData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);

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
      const todayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= today;
      });
      const todayRev = todayOrders.reduce((sum, order) => sum + order.total, 0);
      setTodayRevenue(todayRev);

      // Calcular ingresos de esta semana
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= weekStart;
      });
      const weekRev = weekOrders.reduce((sum, order) => sum + order.total, 0);
      setWeekRevenue(weekRev);

      // Calcular ingresos de este mes
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= monthStart;
      });
      const monthRev = monthOrders.reduce((sum, order) => sum + order.total, 0);
      setMonthRevenue(monthRev);

      // Generar datos para gráficas
      generateSalesChart(orders);
      generateTopProductsChart(orders);
      generateOrderStatusChart(orders);
    }

    // Cargar reservas
    const reservationsResult = await AdminService.getReservations(restaurantId);
    if (reservationsResult.success && reservationsResult.data) {
      setTotalReservations(reservationsResult.data.length);
    }

    setLoading(false);
  };

  const generateSalesChart = (orders: Order[]) => {
    // Ventas de los últimos 7 días
    const labels: string[] = [];
    const data: number[] = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDay;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      labels.push(days[date.getDay()]);
      data.push(dayRevenue);
    }

    setSalesChartData({
      labels,
      datasets: [{ data: data.length > 0 ? data : [0] }],
    });
  };

  const generateTopProductsChart = (orders: Order[]) => {
    // Contar productos vendidos
    const productMap: { [key: string]: ProductSales } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productMap[item.productName]) {
          productMap[item.productName] = {
            name: item.productName,
            quantity: 0,
          };
        }
        productMap[item.productName].quantity += item.quantity;
      });
    });

    // Ordenar y obtener top 5
    const sortedProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    if (sortedProducts.length === 0) {
      setTopProductsData({
        labels: ['Sin datos'],
        datasets: [{ data: [0] }],
      });
      return;
    }

    const labels = sortedProducts.map((p) => 
      p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name
    );
    const data = sortedProducts.map((p) => p.quantity);

    setTopProductsData({
      labels,
      datasets: [{ data }],
    });
  };

  const generateOrderStatusChart = (orders: Order[]) => {
    const statusColors: { [key: string]: string } = {
      pending: '#FCD34D',
      confirmed: '#60A5FA',
      preparing: '#A78BFA',
      ready: '#34D399',
      delivering: '#FBBF24',
      delivered: '#10B981',
      cancelled: '#EF4444',
    };

    const statusLabels: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo',
      delivering: 'En camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };

    const statusCount: { [key: string]: number } = {};
    
    orders.forEach((order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    const data: OrderStatusData[] = Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status] || status,
      count,
      color: statusColors[status] || '#9CA3AF',
      legendFontColor: '#374151',
      legendFontSize: 12,
    }));

    setOrderStatusData(data.length > 0 ? data : []);
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
    salesChartData,
    topProductsData,
    orderStatusData,
    formatPrice,
    loadData,
  } as const;
}