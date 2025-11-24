// screens/AdminPromotionsScreen.tsx
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
import { useAdminPromotionsViewModel } from '../viewmodels/AdminPromotionsViewModel';

interface AdminPromotionsScreenProps {
  restaurantId: string; // ← CAMBIADO: string en lugar de string | null
  onNavigateBack: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onNavigateToMenu: () => void;
  onNavigateToStatistics: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAddPromotion: () => void;
  onNavigateToEditPromotion: (promotionId: string, restaurantId: string) => void; // ← CAMBIADO
}

export function AdminPromotionsScreen({
  restaurantId,
  onNavigateBack,
  onNavigateToDashboard,
  onNavigateToOrders,
  onNavigateToReservations,
  onNavigateToMenu,
  onNavigateToStatistics,
  onNavigateToSettings,
  onNavigateToAddPromotion,
  onNavigateToEditPromotion,
}: AdminPromotionsScreenProps) {
  const {
    restaurantName,
    promotions,
    loading,
    toggleActiveStatus,
    deletePromotion,
    formatDate,
  } = useAdminPromotionsViewModel(restaurantId);

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
          activeTab="promotions" // ← CAMBIADO: de "orders" a "promotions"
          onNavigateToOrders={onNavigateToOrders}
          onNavigateToReservations={onNavigateToReservations}
          onNavigateToMenu={onNavigateToMenu}
          onNavigateToStatistics={onNavigateToStatistics}
          onNavigateToPromotions={() => {}}
        />

        {/* Promotions Header */}
        <View style={styles.promotionsHeader}>
          <Text style={styles.promotionsTitle}>Promociones</Text>
          <TouchableOpacity style={styles.addButton} onPress={onNavigateToAddPromotion}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Promotions List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
          </View>
        ) : promotions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No hay promociones creadas</Text>
            <Text style={styles.emptyText}>
              Agrega tu primera promoción para atraer más clientes
            </Text>
          </View>
        ) : (
          <View style={styles.promotionsList}>
            {promotions.map((promotion) => (
              <View key={promotion.id} style={styles.promotionCard}>
                {/* Image and Info */}
                <View style={styles.promotionContent}>
                  <View style={styles.promotionImageContainer}>
                    <ImageWithFallback
                      source={{ uri: promotion.image }}
                      style={styles.promotionImage}
                    />
                  </View>

                  <View style={styles.promotionInfo}>
                    <View style={styles.promotionHeader}>
                      <Text style={styles.promotionTitle} numberOfLines={1}>
                        {promotion.title}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          promotion.active ? styles.activeBadge : styles.inactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: promotion.active ? '#059669' : '#6B7280' },
                          ]}
                        >
                          {promotion.active ? 'Activa' : 'Inactiva'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.promotionDescription} numberOfLines={2}>
                      {promotion.description}
                    </Text>

                    <View style={styles.promotionDetails}>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{promotion.discount}</Text>
                      </View>
                      {promotion.minOrder && (
                        <Text style={styles.minOrderText}>
                          Pedido mín: ${promotion.minOrder.toLocaleString('es-CO')}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Dates */}
                <View style={styles.promotionDates}>
                  <Text style={styles.dateText}>Creada: {formatDate(promotion.createdAt)}</Text>
                  {promotion.expiresAt && (
                    <Text style={styles.dateText}>Expira: {formatDate(promotion.expiresAt)}</Text>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.promotionActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.toggleButton]}
                    onPress={() => toggleActiveStatus(promotion.id!, promotion.active)}
                  >
                    <Ionicons
                      name={promotion.active ? 'power' : 'power-outline'}
                      size={16}
                      color="#F97316"
                    />
                    <Text style={styles.actionButtonText}>
                      {promotion.active ? 'Desactivar' : 'Activar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => onNavigateToEditPromotion(promotion.id!, restaurantId)} // ← CAMBIADO
                  >
                    <Ionicons name="create-outline" size={16} color="#3B82F6" />
                    <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deletePromotion(promotion.id!)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
  promotionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  promotionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
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
    paddingVertical: 64,
    alignItems: 'center',
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
  promotionsList: {
    gap: 12,
  },
  promotionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promotionContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  promotionImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  promotionInfo: {
    flex: 1,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  promotionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  promotionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  promotionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  minOrderText: {
    fontSize: 12,
    color: '#6B7280',
  },
  promotionDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  promotionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
  },
  toggleButton: {
    borderColor: '#F97316',
    backgroundColor: '#FFF',
  },
  editButton: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFF',
  },
  deleteButton: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF',
    flex: 0,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },
});