// viewmodels/OrderConfirmationViewModel.ts
import { getDatabase, off, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { auth, createOrder, OrderItem as FirebaseOrderItem, getRestaurantInfo, getUserData, hasUserReviewedOrder } from '../lib/firebase';

// ✅ INTERFACE FLEXIBLE PARA SOPORTAR AMBOS FORMATOS
interface OrderItem {
  id?: string;
  productId?: string;
  productName?: string;
  name?: string;
  price: number;
  restaurant?: string;
  image?: string;
  quantity: number;
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
  originalPrice?: number;
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
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  const total = (subtotal || 0) + (deliveryFee || 0) + (tip || 0);
  const estimatedTime = deliveryTime || '30-40 min';

  useEffect(() => {
    loadOrderData();
    if (!orderId && items && items.length > 0 && restaurantId) {
      saveOrderToFirebase();
    }
  }, []);

  // Verificar si el usuario ya calificó este pedido
  useEffect(() => {
    const checkIfReviewed = async () => {
      const currentOrderId = savedOrderId || orderId;
      const user = auth.currentUser;

      if (!currentOrderId || !user) {
        setCheckingReview(false);
        return;
      }

      setCheckingReview(true);
      const result = await hasUserReviewedOrder(user.uid, currentOrderId);
      
      if (result.success) {
        setHasReviewed(result.hasReviewed);
      }
      
      setCheckingReview(false);
    };

    if (orderStatus === 'delivered') {
      checkIfReviewed();
    }
  }, [orderStatus, savedOrderId, orderId]);

  // Listener en tiempo real para detectar cambios de estado
  useEffect(() => {
    const currentOrderId = savedOrderId || orderId;
    if (!currentOrderId || !restaurantId) return;

    const db = getDatabase();
    const orderRef = ref(db, `restaurants/${restaurantId}/orders/${currentOrderId}`);

    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const orderData = snapshot.val();
        if (orderData.status) {
          setOrderStatus(orderData.status);
        }
      }
    }, (error) => {
      console.error('Error en listener de pedido:', error);
    });

    return () => {
      off(orderRef);
    };
  }, [savedOrderId, orderId, restaurantId]);

  const loadOrderData = async () => {
    setIsLoading(true);
    try {
      if (restaurantId) {
        const restaurantResult = await getRestaurantInfo(restaurantId);
        if (restaurantResult.success && restaurantResult.info) {
          setRestaurantName(restaurantResult.info.name || 'Restaurante');
          setRestaurantImage(restaurantResult.info.logo || restaurantResult.info.coverImage || '');
        }
      }

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

  const saveOrderToFirebase = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !items || !restaurantId) return;

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

      let address = deliveryAddress;
      if (!address) {
        const userResult = await getUserData(user.uid);
        if (userResult.success && userResult.data) {
          address = userResult.data.address || 'Dirección no disponible';
          setDeliveryAddress(address);
        }
      }

      const userResult = await getUserData(user.uid);
      const userName = userResult.success && userResult.data 
        ? `${userResult.data.name || ''} ${userResult.data.lastName || ''}`.trim() 
        : 'Usuario';
      const userPhone = userResult.success && userResult.data 
        ? userResult.data.phone || '' 
        : '';

      // ✅ MAPEO FLEXIBLE PARA SOPORTAR AMBOS FORMATOS
      const orderItems: FirebaseOrderItem[] = items.map(item => ({
        productId: item.productId || item.id || '',
        productName: item.productName || item.name || 'Producto',
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        userId: user.uid,
        userName: userName,
        userPhone: userPhone,
        restaurantId: restaurantId,
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

      const result = await createOrder(orderData, restaurantId);

      if (result.success && result.orderId) {
        setSavedOrderId(result.orderId);
      }
    } catch (error: any) {
      console.error('Error saving order:', error);
    }
  };

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
      case 'delivering':
        return 90;
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
    hasReviewed,
    checkingReview,
  } as const;
}