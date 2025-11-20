// viewmodels/AdminOrderDetailViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    Order,
    Product,
    auth,
    getProductById,
    getRestaurantInfo,
    getUserData,
    getUserRole,
    updateOrderStatus,
} from '../lib/firebase';

interface OrderItemWithProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  product?: Product;
}

export function useAdminOrderDetailViewModel(
  order: Order,
  restaurantId: string | null,
  onOrderUpdated?: () => void
) {
  const [restaurantName, setRestaurantName] = useState('Mi Restaurante');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [itemsWithProducts, setItemsWithProducts] = useState<OrderItemWithProduct[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ← ACTUALIZAR currentStatus cuando order.status cambie
  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order.status]);

  useEffect(() => {
    loadData();
  }, [restaurantId, order]);

  const loadData = async () => {
    // Cargar nombre del restaurante
    if (restaurantId) {
      const result = await getRestaurantInfo(restaurantId);
      if (result.success && result.info) {
        setRestaurantName(result.info.name || 'Mi Restaurante');
      }
    }

    // Verificar si el usuario actual es administrador
    const user = auth.currentUser;
    if (user) {
      const roleResult = await getUserRole(user.uid);
      setIsAdmin(roleResult.role === 'admin');
    }

    // Cargar datos del usuario que hizo el pedido
    if (order.userId) {
      const userResult = await getUserData(order.userId);
      if (userResult.success && userResult.data) {
        setUserData(userResult.data);
      }
    }

    // Cargar los productos completos para cada item del pedido
    if (order.restaurantId && order.items) {
      const itemsWithProductData: OrderItemWithProduct[] = [];

      for (const item of order.items) {
        const productResult = await getProductById(item.productId, order.restaurantId);
        itemsWithProductData.push({
          ...item,
          product: productResult.success ? productResult.product : undefined,
        });
      }

      setItemsWithProducts(itemsWithProductData);
    } else {
      setItemsWithProducts(order.items);
    }

    setLoading(false);
  };

  const formatOrderId = (id: string): string => {
    return '#' + id.slice(-8).toUpperCase();
  };

  const getStatusLabel = (status: Order['status']): string => {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparación',
      ready: 'Listo',
      delivering: 'En Camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const updateStatus = async (newStatus: Order['status']) => {
    if (!order.id || !order.restaurantId) {
      Alert.alert('Error', 'Información del pedido incompleta');
      return;
    }

    if (updatingStatus) return;
    setUpdatingStatus(true);

    const result = await updateOrderStatus(order.id, order.restaurantId, newStatus);
    if (result.success) {
      setCurrentStatus(newStatus); // ← Actualiza el estado local inmediatamente
      Alert.alert('Éxito', 'Estado del pedido actualizado');
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } else {
      Alert.alert('Error', 'Error al actualizar el estado del pedido');
    }
    setUpdatingStatus(false);
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  return {
    restaurantName,
    userData,
    loading,
    itemsWithProducts,
    currentStatus,
    isAdmin,
    updatingStatus,
    formatOrderId,
    getStatusLabel,
    updateStatus,
    formatPrice,
  } as const;
}