// screens/OffersScreen.tsx
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

const { width } = Dimensions.get('window');

interface OffersScreenProps {
  onNavigateBack: () => void;
}

export function OffersScreen({ onNavigateBack }: OffersScreenProps) {
  // Datos estáticos de ejemplo para la vista
  const promotions = [
    {
      id: '1',
      title: '2x1 en Hamburguesas',
      description: 'Lleva dos hamburguesas al precio de una',
      discount: '50% OFF',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      minOrder: 25000,
      deliveryTime: '25-30 min',
    },
    {
      id: '2',
      title: 'Pizza Familiar',
      description: 'Pizza familiar con bebida gratis',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      minOrder: 35000,
      deliveryTime: '20-25 min',
    },
    {
      id: '3',
      title: 'Sushi Rolls',
      description: '20% de descuento en todos los rolls',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      minOrder: 40000,
      deliveryTime: '30-35 min',
    },
    {
      id: '4',
      title: 'Tacos al Pastor',
      description: 'Orden de tacos con guacamole gratis',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
      minOrder: 20000,
      deliveryTime: '15-20 min',
    },
  ];

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

            {/* Botón de notificaciones con badge */}
            <View style={styles.notificationContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ofertas destacadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ofertas destacadas</Text>
          
          <View style={styles.featuredGrid}>
            {promotions.slice(0, 4).map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.featuredCard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#F97316', '#EF4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredGradient}
                >
                  {/* Badge de descuento */}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>

                  {/* Imagen */}
                  <View style={styles.featuredImageContainer}>
                    <ImageWithFallback
                      source={{ uri: offer.image }}
                      style={styles.featuredImage}
                    />
                  </View>

                  {/* Info */}
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {offer.title}
                    </Text>
                    <Text style={styles.featuredDescription} numberOfLines={2}>
                      {offer.description}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Restaurantes con ofertas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurantes con ofertas</Text>
          
          <View style={styles.restaurantsList}>
            {promotions.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
                activeOpacity={0.7}
              >
                <View style={styles.restaurantImageContainer}>
                  <ImageWithFallback
                    source={{ uri: restaurant.image }}
                    style={styles.restaurantImage}
                  />
                </View>

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {restaurant.title}
                  </Text>

                  <View style={styles.restaurantDiscountBadge}>
                    <Text style={styles.restaurantDiscountText}>
                      {restaurant.discount}
                    </Text>
                  </View>

                  <Text style={styles.restaurantMinOrder}>
                    Pedido mínimo: ${restaurant.minOrder?.toLocaleString('es-CO')}
                  </Text>

                  <View style={styles.restaurantTime}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.restaurantTimeText}>
                      {restaurant.deliveryTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="offers" />
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
  notificationContainer: {
    position: 'relative',
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
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featuredCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredGradient: {
    width: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredImageContainer: {
    height: 112,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  featuredInfo: {
    padding: 12,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    lineHeight: 16,
  },
  restaurantsList: {
    gap: 12,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  restaurantDiscountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  restaurantDiscountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  restaurantMinOrder: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  restaurantTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantTimeText: {
    color: '#6B7280',
    fontSize: 12,
  },
});