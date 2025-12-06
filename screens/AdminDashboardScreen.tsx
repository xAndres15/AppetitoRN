// screens/AdminDashboardScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AdminNavigation } from '../components/AdminNavigation';
import { useAdminViewModel } from '../viewmodels/AdminViewModel';

interface AdminDashboardScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
  onLogout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToMenu: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToSettings: () => void;
  onNavigateToPromotions: () => void;
}

const screenWidth = Dimensions.get('window').width;

export function AdminDashboardScreen({
  restaurantId,
  onNavigateBack,
  onLogout,
  onNavigateToOrders,
  onNavigateToReservations,
  onNavigateToMenu,
  onNavigateToStatistics,
  onNavigateToSettings,
  onNavigateToPromotions,
}: AdminDashboardScreenProps) {
  const {
    restaurantName,
    isOpen,
    orders,
    reservations,
    loading,
    todayIncome,
    salesChartData,
    toggleOpenStatus,
    formatOrderId,
    formatDate,
    getStatusLabel,
    getStatusColor,
  } = useAdminViewModel(restaurantId);

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#F97316',
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>


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
          activeTab="none"
          onNavigateToOrders={onNavigateToOrders}
          onNavigateToReservations={onNavigateToReservations}
          onNavigateToMenu={onNavigateToMenu}
          onNavigateToStatistics={onNavigateToStatistics}
          onNavigateToPromotions={onNavigateToPromotions}
        />

        {/* Status Toggle */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Estado</Text>
            <View style={styles.statusToggle}>
              <Switch
                value={isOpen}
                onValueChange={toggleOpenStatus}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFF"
              />
              <Text style={[styles.statusLabel, isOpen && styles.statusLabelActive]}>
                {isOpen ? 'ABIERTO' : 'CERRADO'}
              </Text>
            </View>
          </View>
        </View>

        {/* Current Orders */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleOrange}>Pedidos actuales</Text>
            <TouchableOpacity onPress={onNavigateToOrders}>
              <Ionicons name="chevron-forward" size={20} color="#F97316" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#F97316" />
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No hay pedidos activos</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {orders.map((order) => (
                <View key={order.id} style={styles.listItem}>
                  <Text style={styles.listItemLabel}>
                    Pedido ID: {formatOrderId(order.id || '')}
                  </Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                    <View
                      style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Current Reservations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleOrange}>Reservas actuales</Text>
            <TouchableOpacity onPress={onNavigateToReservations}>
              <Ionicons name="chevron-forward" size={20} color="#F97316" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#F97316" />
            </View>
          ) : reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No hay reservas activas</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {reservations.map((reservation) => (
                <View key={reservation.id} style={styles.listItem}>
                  <Text style={styles.listItemLabel}>Reserva: {reservation.userName}</Text>
                  <Text style={styles.listItemValue}>{formatDate(reservation.date)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Income Today */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresos generados hoy</Text>
          <Text style={styles.incomeAmount}>${todayIncome.toLocaleString('es-CO')}</Text>
        </View>

        {/* Sales Chart */}
        {((salesChartData.datasets?.[0]?.data?.length ?? 0) > 0) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Ventas últimos 7 días</Text>
              <TouchableOpacity onPress={onNavigateToStatistics}>
                <Ionicons name="chevron-forward" size={20} color="#F97316" />
              </TouchableOpacity>
            </View>
            <LineChart
              data={salesChartData}
              width={screenWidth - 64}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              formatYLabel={(value) => `$${parseFloat(value).toFixed(0)}`}
            />
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardTitleOrange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusLabelActive: {
    color: '#10B981',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listItemLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  listItemValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});