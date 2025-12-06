// screens/OrderScreen.tsx
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
import { BottomNav } from '../components/BottomNav';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Product } from '../lib/firebase';
import { useOrderViewModel } from '../viewmodels/OrderViewModel';

const { width } = Dimensions.get('window');

interface OrderScreenProps {
  onNavigateBack: () => void;
  onSelectDish?: (dish: Product) => void;
}

export function OrderScreen({
  onNavigateBack,
  onSelectDish,
}: OrderScreenProps) {
  const {
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredProducts,
    formatPrice,
    handleAddToCart,
    cartItemCount,
  } = useOrderViewModel();

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
          <Text style={styles.headerTitle}>¿Qué quieres pedir?</Text>

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
                placeholder="Buscar comida"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

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
        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de productos */}
        <View style={styles.productsSection}>
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>Platos Disponibles</Text>
            <Text style={styles.productsEmoji}>🔥</Text>
          </View>

          <View style={styles.productsList}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <View key={idx} style={styles.productCard}>
                  <View style={styles.productImageSkeleton} />
                  <View style={styles.productDetails}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: '80%' }]} />
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                    <View style={[styles.skeletonLine, { width: '40%' }]} />
                  </View>
                </View>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((dish) => (
                <TouchableOpacity
                  key={dish.id}
                  style={styles.productCard}
                  onPress={() => onSelectDish && onSelectDish(dish)}
                  activeOpacity={0.7}
                >
                  <View style={styles.productImageContainer}>
                    <ImageWithFallback
                      source={{ uri: dish.image }}
                      style={styles.productImage}
                    />
                    {/* ✅ NUEVO: Badge de promoción */}
                    {dish.hasPromotion && dish.promotionDiscount && (
                      <View style={styles.promotionBadge}>
                        <Text style={styles.promotionText}>
                          {dish.promotionDiscount}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.productDetails}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {dish.name}
                      </Text>
                      {/* ✅ NUEVO: Título de promoción */}
                      {dish.hasPromotion && dish.promotionTitle && (
                        <Text style={styles.promotionTitle} numberOfLines={1}>
                          🎁 {dish.promotionTitle}
                        </Text>
                      )}
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {dish.description}
                      </Text>
                      {/* ✅ NUEVO: Precio con descuento */}
                      {dish.hasPromotion && dish.originalPrice && dish.discountedPrice ? (
                        <View>
                          <Text style={styles.originalPrice}>
                            {formatPrice(dish.originalPrice)}
                          </Text>
                          <Text style={styles.productPrice}>
                            {formatPrice(dish.discountedPrice)}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.productPrice}>
                          {formatPrice(dish.price)}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(dish.id!, dish.restaurantId);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'No se encontraron productos'
                    : 'No hay productos disponibles'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="home"
        cartItemCount={cartItemCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF2E3',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#F97316',
  },
  categoryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productsTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  productsEmoji: {
    fontSize: 20,
  },
  productsList: {
    gap: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageSkeleton: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
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
  promotionTitle: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    color: '#F97316',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F97316',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});