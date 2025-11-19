// screens/AdminReservationsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AdminNavigation } from '../components/AdminNavigation';
import { useAdminReservationsViewModel } from '../viewmodels/AdminReservationsViewModel';

interface AdminReservationsScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
  onNavigateToOrders: () => void;
  onNavigateToMenu: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToSettings: () => void;
  onNavigateToPromotions: () => void;
}

export function AdminReservationsScreen({
  restaurantId,
  onNavigateBack,
  onNavigateToOrders,
  onNavigateToMenu,
  onNavigateToStatistics,
  onNavigateToSettings,
  onNavigateToPromotions,
}: AdminReservationsScreenProps) {
  const {
    restaurantName,
    reservations,
    loading,
    formatReservationId,
    getStatusLabel,
    getStatusColor,
  } = useAdminReservationsViewModel(restaurantId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
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

            <View style={styles.notificationContainer}>
              <View style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
              </View>
              <View style={styles.badge} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeLabel}>Bienvenido</Text>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="home" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onNavigateToSettings}>
              <Ionicons name="settings" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Tabs */}
        <AdminNavigation
          activeTab="reservations"
          onNavigateToOrders={onNavigateToOrders}
          onNavigateToReservations={() => {}}
          onNavigateToMenu={onNavigateToMenu}
          onNavigateToStatistics={onNavigateToStatistics}
          onNavigateToPromotions={onNavigateToPromotions}
        />

        {/* Reservations List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reservas actuales</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F97316" />
            </View>
          ) : reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No hay reservas</Text>
              <Text style={styles.emptyText}>
                Las reservas aparecerán aquí cuando los clientes las realicen
              </Text>
            </View>
          ) : (
            <View style={styles.reservationsList}>
              {reservations.map((reservation) => (
                <View key={reservation.id} style={styles.reservationItem}>
                  {/* Header */}
                  <View style={styles.reservationHeader}>
                    <Text style={styles.reservationId}>
                      ID: {formatReservationId(reservation.id || '')}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                      <Text style={styles.statusText}>{getStatusLabel(reservation.status)}</Text>
                    </View>
                  </View>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Cliente:</Text>
                      <Text style={styles.detailValue}>{reservation.userName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Teléfono:</Text>
                      <Text style={styles.detailValue}>{reservation.userPhone}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Fecha:</Text>
                      <Text style={styles.detailValue}>{reservation.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Hora:</Text>
                      <Text style={styles.detailValue}>{reservation.time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Personas:</Text>
                      <Text style={styles.detailValue}>{reservation.numberOfPeople}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValueSmall} numberOfLines={1}>
                        {reservation.userEmail}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
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
    backgroundColor: '#FFF',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 12,
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
    backgroundColor: '#FFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  reservationsList: {
    gap: 12,
  },
  reservationItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reservationId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  detailsGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailValueSmall: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});