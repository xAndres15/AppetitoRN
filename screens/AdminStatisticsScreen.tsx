// screens/AdminStatisticsScreen.tsx
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
import { useAdminStatisticsViewModel } from '../viewmodels/AdminStatisticsViewModel';

interface AdminStatisticsScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToMenu: () => void;
  onNavigateToSettings: () => void;
  onNavigateToPromotions: () => void;
}

export function AdminStatisticsScreen({
  restaurantId,
  onNavigateBack,
  onNavigateToOrders,
  onNavigateToReservations,
  onNavigateToMenu,
  onNavigateToSettings,
  onNavigateToPromotions,
}: AdminStatisticsScreenProps) {
  const {
    restaurantName,
    loading,
    totalOrders,
    totalRevenue,
    totalReservations,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    formatPrice,
  } = useAdminStatisticsViewModel(restaurantId);

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

          <Text style={styles.headerTitle}>Panel de Administración</Text>
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
          activeTab="statistics"
          onNavigateToOrders={onNavigateToOrders}
          onNavigateToReservations={onNavigateToReservations}
          onNavigateToMenu={onNavigateToMenu}
          onNavigateToStatistics={() => {}}
          onNavigateToPromotions={onNavigateToPromotions}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : (
          <>
            {/* Statistics Cards */}
            <View style={styles.statsGrid}>
              {/* Total Orders */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="receipt-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.statValue}>{totalOrders}</Text>
                <Text style={styles.statLabel}>Pedidos totales</Text>
              </View>

              {/* Total Revenue */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="cash-outline" size={24} color="#10B981" />
                </View>
                <Text style={styles.statValue}>{formatPrice(totalRevenue)}</Text>
                <Text style={styles.statLabel}>Ingresos totales</Text>
              </View>

              {/* Total Reservations */}
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color="#F97316" />
                </View>
                <Text style={styles.statValue}>{totalReservations}</Text>
                <Text style={styles.statLabel}>Reservas totales</Text>
              </View>
            </View>

            {/* Revenue by Period */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ingresos por período</Text>

              <View style={styles.periodItem}>
                <View style={styles.periodInfo}>
                  <Ionicons name="today-outline" size={20} color="#6B7280" />
                  <Text style={styles.periodLabel}>Hoy</Text>
                </View>
                <Text style={styles.periodValue}>{formatPrice(todayRevenue)}</Text>
              </View>

              <View style={styles.periodItem}>
                <View style={styles.periodInfo}>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={styles.periodLabel}>Esta semana</Text>
                </View>
                <Text style={styles.periodValue}>{formatPrice(weekRevenue)}</Text>
              </View>

              <View style={styles.periodItem}>
                <View style={styles.periodInfo}>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={styles.periodLabel}>Este mes</Text>
                </View>
                <Text style={styles.periodValue}>{formatPrice(monthRevenue)}</Text>
              </View>
            </View>

            {/* Coming Soon */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gráficas y reportes</Text>
              <Text style={styles.comingSoon}>Próximamente...</Text>
              <Text style={styles.comingSoonDesc}>
                Aquí podrás ver gráficas detalladas de ventas, productos más vendidos, horarios
                pico y más.
              </Text>
            </View>
          </>
        )}

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
    marginBottom: 16,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
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
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  periodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  comingSoon: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
});