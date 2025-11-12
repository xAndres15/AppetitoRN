// screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
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
import { useHomeViewModel } from '../viewmodels/HomeViewModel';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateToOrder: () => void;
  onNavigateToReserve: () => void;
  onNavigateToCart?: () => void; // ← AGREGADO
  onNavigateToDishDetail?: (dish: Product) => void; // ← AGREGAR ESTA LÍNEA
}

export function HomeScreen({
  onNavigateToOrder,
  onNavigateToReserve,
  onNavigateToCart, // ← AGREGADO
  onNavigateToDishDetail, // ← AGREGAR ESTA LÍNEA
}: HomeScreenProps) {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    restaurantName,
    popularItems,
    formatPrice,
    cartItemCount, // ← AGREGADO
  } = useHomeViewModel();

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
          <Text style={styles.headerTitle}>¿De qué estás antojado hoy?</Text>

          <View style={styles.searchRow}>
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

            {/* Botón de notificaciones CON BADGE DEL CARRITO */}
            {/* Botón de notificaciones */}
            <TouchableOpacity 
                  style={styles.notificationButton}
                  onPress={onNavigateToCart}
>
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
        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          {/* Pedir Card */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={onNavigateToOrder}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/images/pedirCard.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Reservar Card */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={onNavigateToReserve}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/images/reservarCard.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Sección de Populares */}
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text style={styles.popularTitle}>Populares en tu área</Text>
            <Text style={styles.popularEmoji}>🔥</Text>
          </View>

          <View style={styles.productsGrid}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <View key={idx} style={styles.productCard}>
                  <View style={styles.productImageSkeleton} />
                  <View style={styles.productInfo}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                    <View style={[styles.skeletonLine, { width: '40%' }]} />
                  </View>
                </View>
              ))
            ) : popularItems.length > 0 ? (
                popularItems.map((item) => (
              <TouchableOpacity
                 key={item.id}
                 style={styles.productCard}
                 onPress={() => onNavigateToDishDetail && onNavigateToDishDetail(item)}
                 activeOpacity={0.7}
              >
                  <View style={styles.productImageContainer}>
                   <ImageWithFallback
                    source={{ uri: item.image }}
                   style={styles.productImage}
                 />
                  </View>
                    <View style={styles.productInfo}>
                   <Text style={styles.productName} numberOfLines={1}>
                   {item.name}
                   </Text>
                  <Text style={styles.productPrice}>
                   {formatPrice(item.price)}
                   </Text>
                   <Text style={styles.restaurantName} numberOfLines={1}>
                   {restaurantName}
                   </Text>
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
        cartItemCount={cartItemCount} // ← AGREGADO
      />
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
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.15,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  starIcon: {
    marginLeft: 8,
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
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 100,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  popularSection: {
    marginBottom: 20,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  popularTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  popularEmoji: {
    fontSize: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  productCard: {
    width: (width - 48) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageSkeleton: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E5E7EB',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    color: '#1F2937',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  productPrice: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantName: {
    color: '#6B7280',
    fontSize: 11,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});