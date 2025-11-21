// app/admin/edit-product.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth, getProductById, getUserRole, Product } from '../../lib/firebase';
import { AdminEditProductScreen } from '../../screens/AdminEditProductScreen';

export default function AdminEditProduct() {
  const params = useLocalSearchParams();
  const { productId, restaurantId: paramRestaurantId } = params;

  const [restaurantId, setRestaurantId] = useState<string | null>(
    (paramRestaurantId as string) || null
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const roleResult = await getUserRole(user.uid);
        if (roleResult.success && roleResult.restaurantId) {
          const finalRestaurantId = (paramRestaurantId as string) || roleResult.restaurantId;
          setRestaurantId(finalRestaurantId);

          if (productId && finalRestaurantId) {
            const productResult = await getProductById(
              productId as string,
              finalRestaurantId
            );
            if (productResult.success && productResult.product) {
              setProduct(productResult.product);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <AdminEditProductScreen
      restaurantId={restaurantId}
      product={product}
      onNavigateBack={() => router.back()}
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
});