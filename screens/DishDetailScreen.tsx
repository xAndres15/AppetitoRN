// screens/DishDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
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
import { Product } from '../lib/firebase';
import { useDishDetailViewModel } from '../viewmodels/DishDetailViewModel';

const { width } = Dimensions.get('window');

interface DishDetailScreenProps {
  dish: Product;
  onNavigateBack: () => void;
  onAddToCart: () => void;
}

export function DishDetailScreen({
  dish,
  onNavigateBack,
  onAddToCart,
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
  } = useDishDetailViewModel(dish);

  const description =
    dish.description || 'Delicioso plato preparado con los mejores ingredientes';

  const onAddToCartPress = async () => {
    const result = await handleAddToCart();
    if (result.success) {
      onAddToCart();
    }
  };

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
          <View style={styles.searchRow}>
            {/* Botón Back */}
            <TouchableOpacity
              onPress={onNavigateBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Buscar"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                editable={false}
              />
            </View>

            {/* Botón de notificaciones */}
            {/* Botón de notificaciones */}
            <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card contenedor */}
        <View style={styles.contentCard}>
          {/* Imagen del plato */}
          <View style={styles.imageContainer}>
            <ImageWithFallback
              source={{ uri: dish.image }}
              style={styles.dishImage}
            />
            {/* Botón de favoritos */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#EF4444' : '#374151'}
              />
            </TouchableOpacity>
          </View>

          {/* Información del plato */}
          <View style={styles.infoSection}>
            <View style={styles.dishHeader}>
              <View style={styles.dishTitleContainer}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.restaurantName}>Appetito</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>

            <Text style={styles.description}>{description}</Text>

            {/* Categoría */}
            {dish.category && (
              <View style={styles.categoryContainer}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{dish.category}</Text>
                </View>
              </View>
            )}

            {/* Selector de cantidad */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Cantidad</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                  style={[
                    styles.quantityButton,
                    styles.decreaseButton,
                    quantity <= 1 && styles.quantityButtonDisabled,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color="#374151" />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{quantity}</Text>

                <TouchableOpacity
                  onPress={incrementQuantity}
                  style={[styles.quantityButton, styles.increaseButton]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Precio y botón de agregar */}
            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Total</Text>
                <Text style={styles.price}>{formatPrice(calculateTotalPrice())}</Text>
              </View>

              <TouchableOpacity
                onPress={onAddToCartPress}
                disabled={isAddingToCart}
                style={styles.addToCartButton}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FEC901', '#F47A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addToCartGradient}
                >
                  <Ionicons name="cart" size={20} color="#fff" />
                  <Text style={styles.addToCartText}>
                    {isAddingToCart ? 'Agregando...' : 'Añadir al carrito'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 16,
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
    alignItems: 'flex-start',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationDot: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dishTitleContainer: {
    flex: 1,
  },
  dishName: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantName: {
    color: '#6B7280',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityLabel: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: '#EF4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});