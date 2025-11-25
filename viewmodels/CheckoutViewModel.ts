// viewmodels/CheckoutViewModel.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { auth, clearCart, createOrder, getCartItems, getUserData } from '../lib/firebase';

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Nequi';
export type DeliveryTime = 'standard' | 'express';
export type TipAmount = 0 | 2000 | 5000 | 'custom';

export function useCheckoutViewModel(subtotal: number) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>('standard');
  const [selectedTip, setSelectedTip] = useState<TipAmount>(0);
  const [customTip, setCustomTip] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  const DELIVERY_FEE = 3000;
  const EXPRESS_FEE = 2000;

  // Cargar dirección del usuario
  const loadUserAddress = async () => {
    setIsLoadingAddress(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const result = await getUserData(user.uid);
        if (result.success && result.data?.address) {
          setDeliveryAddress(result.data.address);
        }
      }
    } catch (error) {
      console.error('Error loading address:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const calculateDeliveryFee = () => {
    let fee = DELIVERY_FEE;
    if (deliveryTime === 'express') {
      fee += EXPRESS_FEE;
    }
    return fee;
  };

  const calculateTip = () => {
    if (selectedTip === 'custom') {
      return parseInt(customTip) || 0;
    }
    return selectedTip;
  };

  const calculateTotal = () => {
    return subtotal + calculateDeliveryFee() + calculateTip();
  };

  const formatPrice = (price: number) => {
    const formatted = price.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `$ ${formatted}`;
  };

  const validateOrder = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Por favor ingresa una dirección de entrega');
      return false;
    }
    if (selectedTip === 'custom' && customTip && parseInt(customTip) < 0) {
      Alert.alert('Error', 'La propina no puede ser negativa');
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateOrder()) return { success: false };

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return { success: false };
    }

    setIsProcessing(true);

    try {
      const deliveryFee = calculateDeliveryFee();
      const tip = calculateTip();
      const total = calculateTotal();

      // Obtener datos del usuario
      const userDataResult = await getUserData(user.uid);
      const userData = userDataResult.success ? userDataResult.data : null;

      // Obtener el restaurantId y los items del carrito
      const cartResult = await getCartItems(user.uid);
      if (!cartResult.success || !cartResult.items || cartResult.items.length === 0) {
        Alert.alert('Error', 'El carrito está vacío');
        setIsProcessing(false);
        return { success: false };
      }

      const restaurantId = cartResult.items[0].restaurantId;

      // ✅ CORREGIDO: Construir los items de la orden evitando valores undefined
      const orderItems = cartResult.items.map(item => {
        // Base del item (siempre presente)
        const orderItem: any = {
          productId: item.productId,
          productName: item.product?.name || 'Producto',
          quantity: item.quantity,
          price: item.discountedPrice || item.product?.price || 0,
          image: item.product?.image || '', // ✅ AGREGAR IMAGEN
        };

        // ✅ SOLO agregar campos de promoción si existen (evita undefined)
        if (item.hasPromotion && item.promotionDiscount) {
          orderItem.hasPromotion = true;
          orderItem.promotionDiscount = item.promotionDiscount;
          orderItem.promotionTitle = item.promotionTitle || '';
          orderItem.originalPrice = item.originalPrice || item.product?.price || 0;
        }

        return orderItem;
      });

      // Crear el objeto de orden
      const orderData: any = {
        userId: user.uid,
        userName: userData?.name || user.displayName || user.email || 'Usuario',
        userPhone: userData?.phone || '',
        restaurantId: restaurantId,
        restaurantName: 'Big Bros',
        restaurantImage: '',
        items: orderItems,
        total: total,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tip: tip,
        status: 'pending',
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        deliveryTime: deliveryTime === 'express' ? '15-20 min' : '30-45 min',
      };

      // Solo agregar notes si tiene contenido
      if (notes.trim()) {
        orderData.notes = notes.trim();
      }

      const result = await createOrder(orderData, restaurantId);

      if (result.success) {
        await clearCart(user.uid);
        Alert.alert('¡Pedido confirmado!', 'Tu pedido ha sido creado exitosamente');
        return { 
          success: true, 
          orderId: result.orderId,
          restaurantId: restaurantId
        };
      } else {
        Alert.alert('Error', result.error || 'Error al crear el pedido');
        return { success: false };
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert('Error', error.message || 'Error al procesar el pedido');
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    deliveryTime,
    setDeliveryTime,
    selectedTip,
    setSelectedTip,
    customTip,
    setCustomTip,
    notes,
    setNotes,
    isProcessing,
    isLoadingAddress,
    loadUserAddress,
    calculateDeliveryFee,
    calculateTip,
    calculateTotal,
    formatPrice,
    handleConfirmOrder,
  } as const;
}