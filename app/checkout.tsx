// app/checkout.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth, getCartItems } from '../lib/firebase';
import { CheckoutScreen } from '../screens/CheckoutScreen';

export default function Checkout() {
  const params = useLocalSearchParams();
  const subtotal = Number(params.subtotal) || 0;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    const user = auth.currentUser;
    if (user) {
      const result = await getCartItems(user.uid);
      if (result.success && result.items) {
        const formattedItems = result.items.map(item => ({
          id: item.productId,
          name: item.product?.name || 'Producto',
          price: item.discountedPrice || item.product?.price || 0, // ✅ Usar precio con descuento
          image: item.product?.image || '',
          quantity: item.quantity,
          restaurantId: item.restaurantId,
          // ✅ CAMPOS DE PROMOCIÓN
          hasPromotion: item.hasPromotion,
          promotionDiscount: item.promotionDiscount,
          promotionTitle: item.promotionTitle,
          originalPrice: item.originalPrice,
        }));
        setItems(formattedItems);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!subtotal || subtotal === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Subtotal inválido</Text>
      </View>
    );
  }

  return (
    <CheckoutScreen
      subtotal={subtotal}
      onNavigateBack={() => router.back()}
      onConfirmOrder={(orderId, restaurantId, deliveryFee, tip, deliveryTime) => {
        router.push({
          pathname: '/confirmation',
          params: {
            orderId: orderId,
            restaurantId: restaurantId,
            subtotal: subtotal.toString(),
            deliveryFee: deliveryFee.toString(),
            tip: tip.toString(),
            deliveryTime,
            items: JSON.stringify(items),
          },
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});