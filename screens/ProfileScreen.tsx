// screens/ProfileScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { BottomNav } from '../components/BottomNav';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useProfileViewModel } from '../viewmodels/ProfileViewModel';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  onNavigateBack: () => void;
  onNavigateToRestaurant?: (restaurantId: string) => void;
}

export function ProfileScreen({
  onNavigateBack,
  onNavigateToRestaurant,
}: ProfileScreenProps) {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    favorites,
    dishFavorites,
    reservations,
    orders,
    isLoading,
    isEditMode,
    name,
    setName,
    lastName,
    setLastName,
    phone,
    setPhone,
    address,
    setAddress,
    toggleEditMode,
    saveProfile,
    removeFavorite,
    removeDishFromFavorites,
    cancelReservation,
    handleSignOut,
    formatDate,
  } = useProfileViewModel();

  const renderTabButton = (
    tab: 'datos' | 'favoritos' | 'reservas' | 'pedidos',
    label: string
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderDatosTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.personalInfoCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <Text style={styles.cardSubtitle}>Actualiza tu información personal</Text>
          </View>
          <TouchableOpacity
            onPress={toggleEditMode}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isEditMode ? 'close' : 'create-outline'}
              size={20}
              color="#F97316"
            />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
          <TouchableOpacity style={styles.cameraButton} activeOpacity={0.7}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Campos de información */}
        <View style={styles.infoFields}>
          {/* Nombre */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              editable={isEditMode}
              style={[styles.fieldInput, !isEditMode && styles.fieldInputDisabled]}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Apellido */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Apellido</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              editable={isEditMode}
              style={[styles.fieldInput, !isEditMode && styles.fieldInputDisabled]}
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Correo electrónico */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <TextInput
              value={userProfile?.email}
              editable={false}
              style={[styles.fieldInput, styles.fieldInputDisabled]}
            />
          </View>

          {/* Teléfono */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Teléfono</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              editable={isEditMode}
              style={[styles.fieldInput, !isEditMode && styles.fieldInputDisabled]}
              placeholder="Ingresa tu teléfono"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          {/* Dirección de entrega */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Dirección de entrega</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              editable={isEditMode}
              style={[styles.fieldInput, !isEditMode && styles.fieldInputDisabled]}
              placeholder="Ingresa tu dirección"
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>
        </View>

        {/* Botón guardar (solo visible en modo edición) */}
        {isEditMode && (
          <TouchableOpacity
            onPress={saveProfile}
            style={styles.saveButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FEC901', '#F47A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.signOutButton}
        activeOpacity={0.9}
      >
        <Ionicons name="exit-outline" size={20} color="#fff" />
        <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );

const renderFavoritosTab = () => (
  <View style={styles.tabContent}>
    {/* Sección de Restaurantes Favoritos */}
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Mis Restaurantes favoritos</Text>
      <Text style={styles.sectionSubtitle}>
        Restaurantes que has marcado como favoritos
      </Text>
    </View>

    {favorites.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No tienes restaurantes favoritos</Text>
      </View>
    ) : (
      <View style={styles.favoritesList}>
        {favorites.map((favorite) => (
          <TouchableOpacity
            key={favorite.id}
            style={styles.favoriteCard}
            onPress={() => {
              const restaurantIdToNavigate = favorite.firebaseId || favorite.restaurantId;
              if (onNavigateToRestaurant && restaurantIdToNavigate) {
                onNavigateToRestaurant(restaurantIdToNavigate);
              } else {
                Alert.alert('Error', 'No se puede abrir el restaurante');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.favoriteImageContainer}>
              <ImageWithFallback
                source={{ uri: favorite.restaurantImage }}
                style={styles.favoriteImage}
              />
            </View>

            <View style={styles.favoriteInfo}>
              <View style={styles.favoriteHeader}>
                <Text style={styles.favoriteName}>{favorite.restaurantName}</Text>
                <TouchableOpacity
                  onPress={() => removeFavorite(favorite.restaurantId)}
                  style={styles.favoriteHeartButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.favoriteCategory}>{favorite.restaurantCategory}</Text>

              <View style={styles.favoriteDetails}>
                {favorite.restaurantRating && (
                  <View style={styles.favoriteDetailItem}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.favoriteDetailText}>
                      {favorite.restaurantRating}
                    </Text>
                  </View>
                )}

                {favorite.restaurantReviews && (
                  <View style={styles.favoriteDetailItem}>
                    <Ionicons name="people-outline" size={14} color="#6B7280" />
                    <Text style={styles.favoriteDetailText}>
                      {favorite.restaurantReviews}
                    </Text>
                  </View>
                )}

                {favorite.restaurantDeliveryTime && (
                  <View style={styles.favoriteDetailItem}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.favoriteDetailText}>
                      {favorite.restaurantDeliveryTime}
                    </Text>
                  </View>
                )}

                {favorite.restaurantDistance && (
                  <View style={styles.favoriteDetailItem}>
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text style={styles.favoriteDetailText}>
                      {favorite.restaurantDistance}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}

    {/* Sección de Platos Favoritos */}
    <View style={[styles.sectionHeader, { marginTop: 32 }]}>
      <Text style={styles.sectionTitle}>Mis Platos favoritos</Text>
      <Text style={styles.sectionSubtitle}>
        Platos que has marcado como favoritos
      </Text>
    </View>

{dishFavorites.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="fast-food-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No tienes platos favoritos</Text>
      </View>
    ) : (
      <View style={styles.favoritesList}>
        {dishFavorites.map((favorite) => (
          <TouchableOpacity 
            key={favorite.id} 
            style={styles.favoriteCard}
            onPress={() => {
              const { router } = require('expo-router');
              router.push({
                pathname: '/dish-detail',
                params: {
                  dishId: favorite.dishId,
                  restaurantId: favorite.restaurantId,
                  name: favorite.dishName || '',           // ← AGREGAR
                  price: String(favorite.dishPrice || 0),  // ← AGREGAR
                  image: favorite.dishImage || '',         // ← AGREGAR
                  category: favorite.dishCategory || '',   // ← AGREGAR
                  description: 'Delicioso plato preparado con los mejores ingredientes', // ← AGREGAR (valor por defecto)
                  available: 'true',                       // ← AGREGAR
                },
              });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.favoriteImageContainer}>
              <ImageWithFallback
                source={{ uri: favorite.dishImage }}
                style={styles.favoriteImage}
              />
            </View>

            <View style={styles.favoriteInfo}>
              <View style={styles.favoriteHeader}>
                <Text style={styles.favoriteName}>{favorite.dishName}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    removeDishFromFavorites(favorite.dishId);
                  }}
                  style={styles.favoriteHeartButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.favoriteCategory}>{favorite.dishCategory}</Text>

              <View style={styles.favoriteDetails}>
                <View style={styles.favoriteDetailItem}>
                  <Text style={styles.dishPrice}>
                    ${favorite.dishPrice?.toLocaleString('es-CO')}
                  </Text>
                </View>
                <View style={styles.favoriteDetailItem}>
                  <Ionicons name="restaurant-outline" size={14} color="#6B7280" />
                  <Text style={styles.favoriteDetailText}>
                    {favorite.restaurantName}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

  const renderReservasTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderIcon}>
          <Ionicons name="calendar" size={24} color="#1F2937" />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Mis Reservas</Text>
          <Text style={styles.sectionSubtitle}>
            Historial de reservas en restaurantes
          </Text>
        </View>
      </View>

      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No tienes reservas</Text>
          <Text style={styles.emptyStateText}>
            Las reservas que hagas aparecerán aquí
          </Text>
        </View>
      ) : (
        <View style={styles.reservationsList}>
          {reservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.reservationHeader}>
                <Text style={styles.reservationRestaurant}>
                  {reservation.restaurantName || 'Restaurante'}
                </Text>
                <View
                  style={[
                    styles.reservationStatusBadge,
                    reservation.status === 'confirmed' && styles.statusConfirmed,
                    reservation.status === 'pending' && styles.statusPending,
                    reservation.status === 'cancelled' && styles.statusCancelled,
                  ]}
                >
                  <Text style={styles.reservationStatusText}>
                    {reservation.status === 'confirmed'
                      ? 'Confirmada'
                      : reservation.status === 'pending'
                      ? 'Pendiente'
                      : 'Cancelada'}
                  </Text>
                </View>
              </View>

              <View style={styles.reservationDetails}>
                <View style={styles.reservationDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.reservationDetailText}>
                    {formatDate(reservation.date)}
                  </Text>
                </View>

                <View style={styles.reservationDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.reservationDetailText}>{reservation.time}</Text>
                </View>

                <View style={styles.reservationDetailRow}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.reservationDetailText}>
                    {reservation.numberOfPeople}{' '}
                    {reservation.numberOfPeople === 1 ? 'Persona' : 'Personas'}
                  </Text>
                </View>

                {reservation.restaurantLocation && (
                  <View style={styles.reservationDetailRow}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={styles.reservationDetailText}>
                      {reservation.restaurantLocation}
                    </Text>
                  </View>
                )}
              </View>
            {reservation.status !== 'cancelled' && (
             <View style={styles.reservationActions}>
                <TouchableOpacity
                    style={styles.reservationActionButton}
                    activeOpacity={0.7}
                    onPress={() => {
                     const { router } = require('expo-router');
                     router.push({
                        pathname: '/reservation-confirmation',
                        params: {
                           reservationId: reservation.id,
                           restaurantId: reservation.restaurantId,
                       },
                   });
                 }}
                >
                  <Text style={styles.reservationActionTextModify}>Detalles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    cancelReservation(reservation.id, reservation.restaurantId)
                  }
                  style={[styles.reservationActionButton, styles.reservationActionButtonCancel]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reservationActionTextCancel}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

const renderPedidosTab = () => (
  <View style={styles.tabContent}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderIcon}>
        <Ionicons name="receipt" size={24} color="#1F2937" />
      </View>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>Mis Pedidos</Text>
        <Text style={styles.sectionSubtitle}>Historial de pedidos realizados</Text>
      </View>
    </View>

    {orders.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyStateTitle}>No tienes pedidos</Text>
        <Text style={styles.emptyStateText}>
          Los pedidos que hagas aparecerán aquí
        </Text>
      </View>
    ) : (
      <View style={styles.ordersList}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            activeOpacity={0.7}
            onPress={() => {
              // Navegar a la confirmación del pedido
              const { router } = require('expo-router');
              router.push({
                pathname: '/confirmation',
                params: {
                  orderId: order.id,
                  restaurantId: order.restaurantId,
                  subtotal: (order.subtotal || 0).toString(),
                  deliveryFee: (order.deliveryFee || 0).toString(),
                  tip: (order.tip || 0).toString(),
                  deliveryTime: order.deliveryTime || '30-45 min',
                  items: JSON.stringify(order.items || []),
                },
              });
            }}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderRestaurant}>
                  {order.restaurantName || 'Restaurante'}
                </Text>
                <Text style={styles.orderDate}>
                  {formatDate(new Date(order.createdAt).toISOString().split('T')[0])}
                </Text>
              </View>
              <View
                style={[
                  styles.orderStatusBadge,
                  order.status === 'delivered' && styles.statusDelivered,
                  order.status === 'delivering' && styles.statusDelivering,
                  order.status === 'preparing' && styles.statusPreparing,
                  order.status === 'pending' && styles.statusPending,
                  order.status === 'cancelled' && styles.statusCancelled,
                ]}
              >
                <Text style={styles.orderStatusText}>
                  {order.status === 'delivered'
                    ? 'Entregado'
                    : order.status === 'delivering'
                    ? 'En camino'
                    : order.status === 'preparing'
                    ? 'Preparando'
                    : order.status === 'pending'
                    ? 'Pendiente'
                    : 'Cancelado'}
                </Text>
              </View>
            </View>

            <View style={styles.orderItems}>
              {order.items && order.items.length > 0 && (
                <>
                  {order.items.slice(0, 2).map((item: any, index: number) => (
                    <View key={index} style={styles.orderItemRow}>
                      <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                      <Text style={styles.orderItemName}>{item.productName}</Text>
                    </View>
                  ))}
                  {order.items.length > 2 && (
                    <Text style={styles.orderItemsMore}>
                      +{order.items.length - 2} más
                    </Text>
                  )}
                </>
              )}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>
                Total: ${order.total?.toLocaleString('es-CO') || '0'}
              </Text>
              <View style={styles.orderViewButton}>
                <Text style={styles.orderViewButtonText}>Ver detalles</Text>
                <Ionicons name="chevron-forward" size={16} color="#F97316" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

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
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.pageTitle}>Mi perfil</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {renderTabButton('datos', 'Mis Datos')}
            {renderTabButton('favoritos', 'Mis favoritos')}
            {renderTabButton('reservas', 'Mis Reservas')}
            {renderTabButton('pedidos', 'Mis Pedidos')}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'datos' && renderDatosTab()}
            {activeTab === 'favoritos' && renderFavoritosTab()}
            {activeTab === 'reservas' && renderReservasTab()}
            {activeTab === 'pedidos' && renderPedidosTab()}

            {/* Espacio para bottom nav */}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="profile" />
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
  content: {
    flex: 1,
  },
  pageTitle: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  tabButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  tabContent: {
    paddingHorizontal: 16,
  },

  // Datos Tab
  personalInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  editButton: {
    padding: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoFields: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  fieldInputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  saveButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Section Headers
  sectionHeader: {
    marginBottom: 20,
  },
  sectionHeaderIcon: {
    marginBottom: 8,
  },
  sectionHeaderText: {
    gap: 4,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: '#6B7280',
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },

  // Favoritos
  favoritesList: {
    gap: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  favoriteImage: {
    width: '100%',
    height: '100%',
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: 12,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  favoriteName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  favoriteHeartButton: {
    padding: 4,
  },
  favoriteCategory: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  favoriteDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteDetailText: {
    color: '#6B7280',
    fontSize: 12,
  },

  // Reservas
  reservationsList: {
    gap: 16,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reservationRestaurant: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  reservationStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  reservationStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reservationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  reservationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reservationDetailText: {
    color: '#6B7280',
    fontSize: 14,
  },
  reservationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reservationActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  reservationActionButtonCancel: {
    borderColor: '#EF4444',
  },
  reservationActionTextModify: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
  reservationActionTextCancel: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },

  // Pedidos
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderRestaurant: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: '#D1FAE5',
  },
  statusDelivering: {
    backgroundColor: '#DBEAFE',
  },
  statusPreparing: {
    backgroundColor: '#FEF3C7',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderItems: {
    gap: 4,
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    gap: 8,
  },
  orderItemQuantity: {
    color: '#6B7280',
    fontSize: 14,
  },
  orderItemName: {
    color: '#374151',
    fontSize: 14,
  },
  orderItemsMore: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  orderTotal: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderViewButtonText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
  dishPrice: {
  color: '#EF4444',
  fontSize: 16,
  fontWeight: 'bold',
},
});