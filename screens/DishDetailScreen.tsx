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
    checkingFavorite,
  } = useDishDetailViewModel(dish);

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
            
            {/* Botón de favorito sobre la imagen */}
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
          </View>
        </View>

        {/* Card blanca con información */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{dish.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.rating}>4.5</Text>
            </View>
          </View>

          <Text style={styles.restaurant}>Appetito</Text>
          <Text style={styles.description}>{dish.description}</Text>

          {dish.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{dish.category}</Text>
            </View>
          )}

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
              <Text style={styles.totalPrice}>{formatPrice(calculateTotalPrice())}</Text>
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
    backgroundColor: '#F9FAFB',
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