// screens/RestaurantDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Restaurant } from '../models/Reservation';
import { useRestaurantDetailViewModel } from '../viewmodels/RestaurantDetailViewModel';

const { width } = Dimensions.get('window');

interface RestaurantDetailScreenProps {
  restaurant: Restaurant;
  onNavigateBack: () => void;
  onNavigateToReservation: (restaurant: Restaurant) => void;
}

export function RestaurantDetailScreen({
  restaurant,
  onNavigateBack,
  onNavigateToReservation,
}: RestaurantDetailScreenProps) {
  const {
    restaurantData,
    isLoading,
    isFavorite,
    toggleFavorite,
    getSchedule,
    getPhone,
  } = useRestaurantDetailViewModel(restaurant);

  const schedule = getSchedule();
  const phone = getPhone();

  const handleCallPress = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSocialPress = (platform: string) => {
    // Lógica para abrir redes sociales
    console.log(`Opening ${platform}`);
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
        {/* Imagen del restaurante */}
        <View style={styles.imageContainer}>
          <ImageWithFallback
            source={{ uri: restaurantData.image }}
            style={styles.restaurantImage}
          />
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

        {/* Información del restaurante */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurantData.description}
          </Text>
          <Text style={styles.restaurantLocation}>{restaurantData.location}</Text>

          {/* Redes sociales */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialPress('facebook')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-facebook" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialPress('instagram')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-instagram" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialPress('twitter')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-twitter" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialPress('tiktok')}
              activeOpacity={0.7}
            >
              <Ionicons name="musical-notes" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario</Text>
          <View style={styles.scheduleContainer}>
            {schedule.map((item, index) => (
              <View key={index} style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>{item.day}</Text>
                <Text style={styles.scheduleHours}>{item.hours}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sección de contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TouchableOpacity onPress={handleCallPress} activeOpacity={0.7}>
            <Text style={styles.phoneText}>{phone}</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de mapa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={48} color="#F97316" />
              <Text style={styles.mapText}>Mapa del restaurante</Text>
              <Text style={styles.mapSubtext}>{restaurantData.location}</Text>
            </View>
          </View>
        </View>

        {/* Espacio para el botón flotante */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón de agendar flotante */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onNavigateToReservation(restaurantData)}
          style={styles.reserveButton}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FEC901', '#F47A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reserveGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.reserveButtonText}>Agendar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 24,
  },
  restaurantName: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  restaurantLocation: {
    color: '#F97316',
    fontSize: 16,
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F97316',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  scheduleContainer: {
    gap: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleDay: {
    color: '#374151',
    fontSize: 14,
    width: 96,
  },
  scheduleHours: {
    color: '#6B7280',
    fontSize: 14,
  },
  phoneText: {
    color: '#374151',
    fontSize: 16,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    aspectRatio: 16 / 9,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mapText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  mapSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reserveButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  reserveGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});