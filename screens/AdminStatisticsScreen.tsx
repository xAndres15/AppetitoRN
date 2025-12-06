// screens/AdminStatisticsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { AdminNavigation } from '../components/AdminNavigation';
import { useAdminStatisticsViewModel } from '../viewmodels/AdminStatisticsViewModel';

interface AdminStatisticsScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
  onNavigateToDashboard: () => void; // ← NUEVO
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToMenu: () => void;
  onNavigateToSettings: () => void;
  onNavigateToPromotions: () => void;
}

const screenWidth = Dimensions.get('window').width;

export function AdminStatisticsScreen({
  restaurantId,
  onNavigateBack,
  onNavigateToDashboard, // ← NUEVO
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
    salesChartData,
    topProductsData,
    orderStatusData,
    formatPrice,
  } = useAdminStatisticsViewModel(restaurantId);

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
            <TouchableOpacity style={styles.iconButton} onPress={onNavigateToDashboard}>
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

            {/* Sales Chart */}
            {((salesChartData.datasets?.[0]?.data?.length ?? 0) > 0) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Ventas últimos 7 días</Text>
                <LineChart
                  data={salesChartData}
                  width={screenWidth - 64}
                  height={220}
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

            {/* Top Products Chart */}
            {((topProductsData.datasets?.[0]?.data?.length ?? 0) > 0) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Productos más vendidos</Text>
                <BarChart
                  data={topProductsData}
                  width={screenWidth - 64}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    barPercentage: 0.7,
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  fromZero
                  withInnerLines={false}
                />
              </View>
            )}

            {/* Order Status Chart */}
            {orderStatusData.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Distribución de pedidos</Text>
                <PieChart
                  data={orderStatusData.map((item) => ({
                    ...item,
                    population: item.count,
                  }))}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.chart}
                />
              </View>
            )}

            {/* No Data Message */}
            {totalOrders === 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Gráficas y reportes</Text>
                <View style={styles.noDataContainer}>
                  <Ionicons name="analytics-outline" size={48} color="#D1D5DB" />
                  <Text style={styles.noDataText}>No hay datos suficientes</Text>
                  <Text style={styles.noDataDesc}>
                    Las gráficas se mostrarán cuando tengas pedidos registrados.
                  </Text>
                </View>
              </View>
            )}
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataDesc: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});