// components/AdminNavigation.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdminNavigationProps {
  activeTab: 'orders' | 'reservations' | 'menu' | 'statistics' | 'promotions' | 'none';
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToMenu: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToPromotions: () => void;
}

export function AdminNavigation({
  activeTab,
  onNavigateToOrders,
  onNavigateToReservations,
  onNavigateToMenu,
  onNavigateToStatistics,
  onNavigateToPromotions,
}: AdminNavigationProps) {
  return (
    <View style={styles.container}>
      {/* Pedidos */}
      <TouchableOpacity style={styles.tabButton} onPress={onNavigateToOrders}>
        <LinearGradient
          colors={activeTab === 'orders' ? ['#FEC901', '#F47A00'] : ['#FED7AA', '#FCA5A5']}
          style={styles.iconContainer}
        >
          <Ionicons name="bag-handle" size={28} color="#FFF" />
        </LinearGradient>
        <Text style={[styles.label, activeTab === 'orders' && styles.labelActive]}>
          Pedidos
        </Text>
      </TouchableOpacity>

      {/* Reservas */}
      <TouchableOpacity style={styles.tabButton} onPress={onNavigateToReservations}>
        <LinearGradient
          colors={activeTab === 'reservations' ? ['#FEC901', '#F47A00'] : ['#FED7AA', '#FCA5A5']}
          style={styles.iconContainer}
        >
          <Ionicons name="calendar-outline" size={28} color="#FFF" />
        </LinearGradient>
        <Text style={[styles.label, activeTab === 'reservations' && styles.labelActive]}>
          Reservas
        </Text>
      </TouchableOpacity>

      {/* Menú */}
      <TouchableOpacity style={styles.tabButton} onPress={onNavigateToMenu}>
        <LinearGradient
          colors={activeTab === 'menu' ? ['#FEC901', '#F47A00'] : ['#FED7AA', '#FCA5A5']}
          style={styles.iconContainer}
        >
          <Ionicons name="restaurant-outline" size={28} color="#FFF" />
        </LinearGradient>
        <Text style={[styles.label, activeTab === 'menu' && styles.labelActive]}>
          Menú
        </Text>
      </TouchableOpacity>

      {/* Estadísticas */}
      <TouchableOpacity style={styles.tabButton} onPress={onNavigateToStatistics}>
        <LinearGradient
          colors={activeTab === 'statistics' ? ['#FEC901', '#F47A00'] : ['#FED7AA', '#FCA5A5']}
          style={styles.iconContainer}
        >
          <Ionicons name="stats-chart-outline" size={28} color="#FFF" />
        </LinearGradient>
        <Text style={[styles.label, activeTab === 'statistics' && styles.labelActive]}>
          Estadísticas
        </Text>
      </TouchableOpacity>

      {/* Promociones */}
      <TouchableOpacity style={styles.tabButton} onPress={onNavigateToPromotions}>
        <LinearGradient
          colors={activeTab === 'promotions' ? ['#FEC901', '#F47A00'] : ['#FED7AA', '#FCA5A5']}
          style={styles.iconContainer}
        >
          <Ionicons name="pricetag-outline" size={28} color="#FFF" />
        </LinearGradient>
        <Text style={[styles.label, activeTab === 'promotions' && styles.labelActive]}>
          Promociones
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  labelActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
});