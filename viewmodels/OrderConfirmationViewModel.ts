// viewmodels/OrderConfirmationViewModel.ts
import { useEffect, useState } from 'react';
import { auth, createOrder, OrderItem as FirebaseOrderItem, getRestaurantInfo, getUserData } from '../lib/firebase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  restaurant?: string;
  image: string;
  quantity: number;
}

export function useOrderConfirmationViewModel(
  orderId?: string,
  restaurantId?: string,
  items?: OrderItem[],
  subtotal?: number,
  deliveryFee?: number,
  tip?: number,
  deliveryTime?: string
) {
  const [orderStatus, setOrderStatus] = useState('pending');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantImage, setRestaurantImage] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savedOrderId, setSavedOrderId] = useState(orderId);

  const total = (subtotal || 0) + (deliveryFee || 0) + (tip || 0);
  const estimatedTime = deliveryTime || '30-40 min';

  useEffect(() => {
    loadOrderData();
    // Solo guardar el pedido si no tenemos un orderId (nuevo pedido)
    if (!orderId && items && items.length > 0 && restaurantId) {
      saveOrderToFirebase();
    }
  }, []);

  const loadOrderData = async () => {
    setIsLoading(true);
    try {
      // Cargar información del restaurante
      if (restaurantId) {
        const restaurantResult = await getRestaurantInfo(restaurantId);
        if (restaurantResult.success && restaurantResult.info) {
          setRestaurantName(restaurantResult.info.name || 'Restaurante');
          setRestaurantImage(restaurantResult.info.logo || restaurantResult.info.coverImage || '');
        }
      }

      // Cargar dirección del usuario
      const user = auth.currentUser;
      if (user) {
        const userResult = await getUserData(user.uid);
        if (userResult.success && userResult.data) {
          setDeliveryAddress(userResult.data.address || 'Dirección no disponible');
        }
      }
    } catch (error: any) {
      // Error silencioso
    } finally {
      setIsLoading(false);
    }
  };

  // viewmodels/OrderConfirmationViewModel.ts
// ... todo el código anterior igual ...

const saveOrderToFirebase = async () => {
  try {
    const user = auth.currentUser;
    if (!user || !items || !restaurantId) return;

    // Cargar nombre del restaurante primero si no lo tenemos
    let restName = restaurantName;
    let restImage = restaurantImage;
    
    if (!restName) {
      const restaurantResult = await getRestaurantInfo(restaurantId);
      if (restaurantResult.success && restaurantResult.info) {
        restName = restaurantResult.info.name || 'Restaurante';
        restImage = restaurantResult.info.logo || restaurantResult.info.coverImage || '';
        setRestaurantName(restName);
        setRestaurantImage(restImage);
      }
    }

    // Cargar dirección del usuario
    let address = deliveryAddress;
    if (!address) {
      const userResult = await getUserData(user.uid);
      if (userResult.success && userResult.data) {
        address = userResult.data.address || 'Dirección no disponible';
        setDeliveryAddress(address);
      }
    }

    // Cargar nombre y teléfono del usuario
    const userResult = await getUserData(user.uid);
    const userName = userResult.success && userResult.data 
      ? `${userResult.data.name || ''} ${userResult.data.lastName || ''}`.trim() 
      : 'Usuario';
    const userPhone = userResult.success && userResult.data 
      ? userResult.data.phone || '' 
      : '';

    // Convertir items al tipo correcto FirebaseOrderItem[]
    const orderItems: FirebaseOrderItem[] = items.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // ← AQUÍ ESTÁ EL FIX: Asegurar que orderData tenga TODAS las propiedades requeridas
    const orderData = {
      userId: user.uid,
      userName: userName,
      userPhone: userPhone,
      restaurantId: restaurantId, // ← CRÍTICO: Debe estar aquí
      restaurantName: restName || 'Restaurante',
      restaurantImage: restImage || '',
      items: orderItems,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      tip: tip || 0,
      total: total,
      deliveryAddress: address,
      deliveryTime: deliveryTime || '30-40 min',
      paymentMethod: 'Efectivo',
      status: 'pending' as const,
      notes: '',
    };

    const result = await createOrder(orderData);

    if (result.success && result.orderId) {
      setSavedOrderId(result.orderId);
    }
  } catch (error: any) {
    console.error('Error saving order:', error);
  }
};

// ... resto del código igual ...

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const getStatusLabel = (): string => {
    switch (orderStatus) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'delivering':
        return 'En camino';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  const getProgressPercentage = (): number => {
    switch (orderStatus) {
      case 'pending':
        return 25;
      case 'confirmed':
        return 50;
      case 'preparing':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 25;
    }
  };

  return {
    orderStatus,
    restaurantName,
    restaurantImage,
    deliveryAddress,
    isLoading,
    total,
    estimatedTime,
    savedOrderId,
    formatPrice,
    getStatusLabel,
    getProgressPercentage,
  } as const;
}