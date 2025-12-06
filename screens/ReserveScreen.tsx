// screens/ReserveScreen.tsx
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
import { Restaurant } from '../models/Reservation';
import { useReservationViewModel } from '../viewmodels/ReservationViewModel';

const { width } = Dimensions.get('window');

interface ReserveScreenProps {
  onNavigateBack: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export function ReserveScreen({
  onNavigateBack,
  onSelectRestaurant,
}: ReserveScreenProps) {
  const {
    restaurants,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = useReservationViewModel();

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
          <Text style={styles.headerTitle}>¿Dónde quieres comer hoy?</Text>

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
                placeholder="Buscar restaurante"
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

        {/* Lista de restaurantes */}
        <View style={styles.restaurantsSection}>
          <View style={styles.restaurantsHeader}>
            <Text style={styles.restaurantsTitle}>Restaurantes populares</Text>
            <Text style={styles.restaurantsEmoji}>🔥</Text>
          </View>

          <View style={styles.restaurantsGrid}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <View key={idx} style={styles.restaurantCard}>
                  <View style={styles.restaurantImageSkeleton} />
                  <View style={styles.restaurantInfo}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: '80%' }]} />
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                  </View>
                </View>
              ))
            ) : restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  onPress={() => onSelectRestaurant(restaurant)}
                  activeOpacity={0.7}
                >
                  <View style={styles.restaurantImageContainer}>
                    <ImageWithFallback
                      source={{ uri: restaurant.image }}
                      style={styles.restaurantImage}
                    />
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Lógica para agregar a favoritos
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="heart-outline" size={20} color="#374151" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                      {restaurant.name}
                    </Text>
                    <Text style={styles.restaurantDescription} numberOfLines={1}>
                      {restaurant.description}
                    </Text>
                    <Text style={styles.restaurantLocation} numberOfLines={1}>
                      {restaurant.location}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'No se encontraron restaurantes'
                    : 'No hay restaurantes disponibles'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="home" />
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
    borderWidth: 2,
    borderColor: '#F97316',
    backgroundColor: '#fff',
  },
  categoryButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  categoryText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  restaurantsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  restaurantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  restaurantsTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  restaurantsEmoji: {
    fontSize: 20,
  },
  restaurantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  restaurantCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantImageSkeleton: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E5E7EB',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  restaurantLocation: {
    color: '#F97316',
    fontSize: 12,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});