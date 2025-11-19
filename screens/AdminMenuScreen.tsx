// screens/AdminMenuScreen.tsx
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
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Product } from '../lib/firebase';
import { useAdminMenuViewModel } from '../viewmodels/AdminMenuViewModel';

interface AdminMenuScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToSettings: () => void;
  onNavigateToPromotions: () => void;
  onNavigateToAddProduct: () => void;
  onNavigateToEditProduct?: (product: Product) => void;
}

export function AdminMenuScreen({
  restaurantId,
  onNavigateBack,
  onNavigateToOrders,
  onNavigateToReservations,
  onNavigateToStatistics,
  onNavigateToSettings,
  onNavigateToPromotions,
  onNavigateToAddProduct,
  onNavigateToEditProduct,
}: AdminMenuScreenProps) {
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    formatPrice,
    toggleAvailability,
  } = useAdminMenuViewModel(restaurantId);

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
                placeholder="Buscar producto"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.notificationContainer}>
              <View style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>

          <Text style={styles.headerTitle}>Panel de Administración</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs */}
        <AdminNavigation
          activeTab="menu"
          onNavigateToOrders={onNavigateToOrders}
          onNavigateToReservations={onNavigateToReservations}
          onNavigateToMenu={() => {}}
          onNavigateToStatistics={onNavigateToStatistics}
          onNavigateToPromotions={onNavigateToPromotions}
        />

        {/* Menu Management Header */}
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Gestión de Menú</Text>
          <TouchableOpacity style={styles.addButton} onPress={onNavigateToAddProduct}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Products List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : filteredProducts.length > 0 ? (
          <View style={styles.productsList}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productContent}>
                  {/* Product Image */}
                  <View style={styles.productImageContainer}>
                    <ImageWithFallback
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.productDescription} numberOfLines={1}>
                      {product.description}
                    </Text>

                    {/* Price and Actions */}
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                      <View style={styles.productActions}>
                        <TouchableOpacity
                          style={[
                            styles.availabilityButton,
                            product.available ? styles.availableButton : styles.unavailableButton,
                          ]}
                          onPress={() => toggleAvailability(product.id!, product.available)}
                        >
                          <Text
                            style={[
                              styles.availabilityText,
                              product.available
                                ? styles.availableText
                                : styles.unavailableText,
                            ]}
                          >
                            {product.available ? 'Disponible' : 'No disponible'}
                          </Text>
                        </TouchableOpacity>

                        {onNavigateToEditProduct && (
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => onNavigateToEditProduct(product)}
                          >
                            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No se encontraron productos' : 'No hay productos en el menú'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyButton} onPress={onNavigateToAddProduct}>
                <Text style={styles.emptyButtonText}>Agregar primer producto</Text>
              </TouchableOpacity>
            )}
          </View>
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
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  productsList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productContent: {
    flexDirection: 'row',
    gap: 16,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availableButton: {
    backgroundColor: '#D1FAE5',
  },
  unavailableButton: {
    backgroundColor: '#F3F4F6',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#059669',
  },
  unavailableText: {
    color: '#6B7280',
  },
  editButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
});