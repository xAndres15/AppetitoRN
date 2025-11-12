// viewmodels/OrderConfirmationViewModel.ts
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { auth, database, getRestaurantInfo, getUserData } from '../lib/firebase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  restaurant?: string;
  image: string;
  quantity: number;
}

export function useOrderConfirmationViewModel(
  orderId: string | undefined,
  restaurantId: string | undefined,
  items: OrderItem[],
  subtotal: number,
  deliveryFee: number,
  tip: number,
  deliveryTime: string
) {
  const [orderStatus, setOrderStatus] = useState<'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'>('pending');
  const [restaurantName, setRestaurantName] = useState('Restaurante');
  const [deliveryAddress, setDeliveryAddress] = useState('Cargando dirección...');
  const [isLoading, setIsLoading] = useState(true);

  const total = subtotal + deliveryFee + tip;
  const estimatedTime = deliveryTime === '15-20 min' ? '25 min' : '50 min';

  useEffect(() => {
    loadInitialData();
    
    // Escuchar cambios en el estado del pedido en tiempo real
    if (orderId && restaurantId) {
      const orderRef = ref(database, `restaurants/${restaurantId}/orders/${orderId}`);
      const unsubscribe = onValue(orderRef, (snapshot) => {
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          setOrderStatus(orderData.status || 'pending');
        }
      });

      return () => unsubscribe();
    }
  }, [orderId, restaurantId]);

  const loadInitialData = async () => {
    setIsLoading(true);
    
    // Cargar nombre del restaurante
    if (restaurantId) {
      const restaurantResult = await getRestaurantInfo(restaurantId);
      if (restaurantResult.success && restaurantResult.info) {
        setRestaurantName(restaurantResult.info.name || 'Appetito');
      }
    }

    // Cargar dirección del usuario
    const user = auth.currentUser;
    if (user) {
      const userResult = await getUserData(user.uid);
      if (userResult.success && userResult.data?.address) {
        setDeliveryAddress(userResult.data.address);
      }
    }

    setIsLoading(false);
  };

  const getStatusLabel = () => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo',
      delivering: 'En camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return statusMap[orderStatus] || 'Pendiente';
  };

  const getProgressPercentage = () => {
    const progressMap = {
      pending: 0,
      confirmed: 25,
      preparing: 50,
      ready: 75,
      delivering: 90,
      delivered: 100,
      cancelled: 0,
    };
    return progressMap[orderStatus] || 0;
  };

  const formatPrice = (price: number) => {
    const formatted = price.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `$ ${formatted}`;
  };

  return {
    orderStatus,
    restaurantName,
    deliveryAddress,
    isLoading,
    total,
    estimatedTime,
    formatPrice,
    getStatusLabel,
    getProgressPercentage,
  } as const;
}