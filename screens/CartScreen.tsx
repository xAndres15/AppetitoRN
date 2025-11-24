// screens/CartScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { CartItem, useCartViewModel } from '../viewmodels/CartViewModel';

const { width } = Dimensions.get('window');

interface CartScreenProps {
  onNavigateBack: () => void;
  onNavigateToCheckout: (subtotal: number, items: CartItem[]) => void;
}

export function CartScreen({
  onNavigateBack,
  onNavigateToCheckout,
}: CartScreenProps) {
  const {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    subtotal,
    formatPrice,
  } = useCartViewModel();

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#FEC901', '#F47A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tu Carrito</Text>

          <View style={styles.searchRow}>
            {/* Botón Back */}
            <TouchableOpacity
              onPress={onNavigateBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.itemCount}>
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          // Loading skeleton
          <View style={styles.loadingContainer}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <View key={idx} style={styles.cartItemCard}>
                <View style={styles.itemImageSkeleton} />
                <View style={styles.itemDetails}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, { width: '60%' }]} />
                  <View style={[styles.skeletonLine, { width: '40%' }]} />
                </View>
              </View>
            ))}
          </View>
        ) : cartItems.length === 0 ? (
          // Carrito vacío
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Agrega productos para comenzar tu orden
            </Text>
          </View>
        ) : (
          // Items del carrito
          <View style={styles.itemsContainer}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemCard}>
                <View style={styles.itemImageContainer}>
                  <ImageWithFallback
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  {/* ✅ NUEVO: Badge de promoción */}
                  {item.hasPromotion && item.promotionDiscount && (
                    <View style={styles.promotionBadge}>
                      <Text style={styles.promotionText}>{item.promotionDiscount}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {/* ✅ NUEVO: Título de promoción */}
                      {item.hasPromotion && item.promotionTitle && (
                        <Text style={styles.promotionTitle}>
                          🎁 {item.promotionTitle}
                        </Text>
                      )}
                      {item.restaurant && (
                        <Text style={styles.restaurantName}>
                          {item.restaurant}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemFooter}>
                    <View>
                      {/* ✅ NUEVO: Precio original tachado si hay promoción */}
                      {item.hasPromotion && item.originalPrice && (
                        <Text style={styles.originalPrice}>
                          {formatPrice(item.originalPrice)}
                        </Text>
                      )}
                      <Text style={styles.itemPrice}>
                        {formatPrice(item.discountedPrice || item.price)}
                      </Text>
                      {/* ✅ NUEVO: Ahorro */}
                      {item.hasPromotion && item.originalPrice && item.discountedPrice && (
                        <Text style={styles.savings}>
                          Ahorras {formatPrice(item.originalPrice - item.discountedPrice)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        style={[
                          styles.quantityButton,
                          styles.decreaseButton,
                          item.quantity <= 1 && styles.quantityButtonDisabled,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="remove" size={16} color="#374151" />
                      </TouchableOpacity>

                      <Text style={styles.quantityText}>{item.quantity}</Text>

                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        style={[styles.quantityButton, styles.increaseButton]}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer - Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalAmount}>{formatPrice(subtotal)}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onNavigateToCheckout(subtotal, cartItems)}
            style={styles.checkoutButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FEC901', '#F47A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutButtonText}>
                Continuar con el pago
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    gap: 16,
  },
  itemsContainer: {
    gap: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  // ✅ NUEVOS ESTILOS PARA PROMOCIONES
  promotionBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  promotionText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemImageSkeleton: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  promotionTitle: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
    marginBottom: 2,
  },
  restaurantName: {
    color: '#6B7280',
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  itemPrice: {
    color: '#F97316',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savings: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButton: {
    backgroundColor: '#F3F4F6',
  },
  increaseButton: {
    backgroundColor: '#F97316',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalLabel: {
    color: '#6B7280',
    fontSize: 16,
  },
  subtotalAmount: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});