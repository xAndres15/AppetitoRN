// screens/DishDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { Product } from '../lib/firebase';
import { useDishDetailViewModel } from '../viewmodels/DishDetailViewModel';

const { width } = Dimensions.get('window');

interface DishDetailScreenProps {
  dish: Product;
  onNavigateBack: () => void;
  onAddToCart: () => void;
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
}

export function DishDetailScreen({
  dish,
  onNavigateBack,
  onAddToCart,
  hasPromotion = false,
  promotionDiscount = '',
  promotionTitle = '',
}: DishDetailScreenProps) {
  const {
    quantity,
    incrementQuantity,
    decrementQuantity,
    isFavorite,
    toggleFavorite,
    handleAddToCart,
    formatPrice,
    calculateTotalPrice,
    isAddingToCart,
    checkingFavorite,
    reviews,
    loadingReviews,
    ratingStats,
  } = useDishDetailViewModel(
    dish,
    hasPromotion ? {
      hasPromotion,
      promotionDiscount,
      promotionTitle
    } : undefined
  );

  const [showAllReviews, setShowAllReviews] = useState(false);

  const parseDiscount = (discountText: string): number => {
    const match = discountText.match(/(\d+)%/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  };

  const originalPrice = dish.price;
  const discountPercentage = hasPromotion ? parseDiscount(promotionDiscount) : 0;
  const priceWithDiscount = discountPercentage > 0 
    ? originalPrice * (1 - discountPercentage / 100)
    : originalPrice;
  const finalPrice = hasPromotion && discountPercentage > 0 ? priceWithDiscount : originalPrice;
  const savings = originalPrice - finalPrice;

  const calculateFinalTotalPrice = () => {
    return finalPrice * quantity;
  };

  const handleAddToCartPress = async () => {
    const result = await handleAddToCart();
    if (result.success) {
      onAddToCart();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header naranja */}
      <LinearGradient
        colors={['#FEC901', '#F47A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onNavigateBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              editable={false}
            />
          </View>

          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenido scrolleable */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen del plato */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageContainer}>
            <ImageWithFallback source={{ uri: dish.image }} style={styles.image} />
            
            <TouchableOpacity
              onPress={toggleFavorite}
              style={styles.favoriteButton}
              activeOpacity={0.7}
              disabled={checkingFavorite}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color="#EF4444"
              />
            </TouchableOpacity>

            {hasPromotion && discountPercentage > 0 && (
              <View style={styles.promotionBadge}>
                <Ionicons name="pricetag" size={16} color="#FFF" />
                <Text style={styles.promotionBadgeText}>{promotionDiscount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card blanca con información */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{dish.name}</Text>
            {/* ✅ NUEVO: Badge de rating */}
            {ratingStats && ratingStats.averageRating > 0 && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={styles.rating}>{ratingStats.averageRating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.restaurant}>Appetito</Text>

          {hasPromotion && promotionTitle && (
            <View style={styles.promotionInfo}>
              <Ionicons name="gift-outline" size={20} color="#F97316" />
              <Text style={styles.promotionInfoText}>{promotionTitle}</Text>
            </View>
          )}

          <Text style={styles.description}>{dish.description}</Text>

          {dish.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{dish.category}</Text>
            </View>
          )}

          {/* ✅ NUEVA SECCIÓN: Reviews */}
          {ratingStats && ratingStats.totalReviews > 0 && (
            <View style={styles.reviewsSection}>
              <TouchableOpacity
                onPress={() => setShowAllReviews(!showAllReviews)}
                style={styles.reviewsHeader}
                activeOpacity={0.7}
              >
                <View style={styles.reviewsHeaderLeft}>
                  <Text style={styles.reviewsTitle}>Calificaciones</Text>
                  <View style={styles.reviewsStars}>
                    <StarRating 
                      rating={ratingStats.averageRating} 
                      size={16} 
                      readonly 
                    />
                    <Text style={styles.reviewsCount}>
                      {ratingStats.averageRating.toFixed(1)} ({ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'reseña' : 'reseñas'})
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name={showAllReviews ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#6B7280" 
                />
              </TouchableOpacity>

              {/* ✅ Lista de reviews (expandible) */}
              {showAllReviews && (
                <View style={styles.reviewsList}>
                  {loadingReviews ? (
                    <Text style={styles.loadingText}>Cargando reseñas...</Text>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <Text style={styles.noReviewsText}>No hay reseñas aún</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Sección de precio */}
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Precio</Text>
            <View style={styles.priceContainer}>
              {hasPromotion && discountPercentage > 0 ? (
                <>
                  <View>
                    <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text>
                    <Text style={styles.discountedPrice}>{formatPrice(finalPrice)}</Text>
                    <Text style={styles.savings}>Ahorras {formatPrice(savings)}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.currentPrice}>{formatPrice(originalPrice)}</Text>
              )}
            </View>
          </View>

          {/* Cantidad */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Cantidad</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={styles.quantityButton}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={24} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={incrementQuantity}
                style={styles.quantityButtonAdd}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Total y botón */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>{formatPrice(calculateFinalTotalPrice())}</Text>
              {hasPromotion && discountPercentage > 0 && quantity > 1 && (
                <Text style={styles.totalSavings}>
                  Ahorras {formatPrice(savings * quantity)} en total
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleAddToCartPress}
              style={styles.addButton}
              activeOpacity={0.9}
              disabled={isAddingToCart}
            >
              <LinearGradient
                colors={['#FEC901', '#F47A00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="cart" size={20} color="#fff" />
                <Text style={styles.addButtonText}>
                  {isAddingToCart ? 'Agregando...' : 'Añadir al carrito'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF2E3',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageWrapper: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promotionBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  promotionBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  restaurant: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  promotionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  promotionInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  // ✅ NUEVOS ESTILOS PARA REVIEWS
  reviewsSection: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsHeaderLeft: {
    flex: 1,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  reviewsStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  reviewsList: {
    gap: 12,
    marginTop: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    paddingVertical: 16,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    paddingVertical: 16,
  },
  priceSection: {
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  savings: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonAdd: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 30,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  totalSavings: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});