// screens/AdminOrderDetailScreen.tsx
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
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Order } from '../lib/firebase';
import { useAdminOrderDetailViewModel } from '../viewmodels/AdminOrderDetailViewModel';

interface AdminOrderDetailScreenProps {
  order: Order;
  restaurantId: string | null;
  onNavigateBack: () => void;
  onOrderUpdated?: () => void;
}

export function AdminOrderDetailScreen({
  order,
  restaurantId,
  onNavigateBack,
  onOrderUpdated,
}: AdminOrderDetailScreenProps) {
  const {
    restaurantName,
    userData,
    loading,
    itemsWithProducts,
    currentStatus,
    isAdmin,
    updatingStatus,
    formatOrderId,
    getStatusLabel,
    updateStatus,
    formatPrice,
  } = useAdminOrderDetailViewModel(order, restaurantId, onOrderUpdated);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

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
        <View style={styles.card}>
          {/* Order ID and Customer Name */}
          <View style={styles.customerSection}>
            <View style={styles.customerInfo}>
              <Text style={styles.orderId}>Pedido ID: {formatOrderId(order.id || '')}</Text>
              <Text style={styles.customerName}>{order.userName}</Text>
            </View>
            <View style={styles.avatarContainer}>
              {userData?.photoURL ? (
                <ImageWithFallback
                  source={{ uri: userData.photoURL }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient colors={['#FB923C', '#EA580C']} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>
                    {order.userName.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
              )}
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.addressSection}>
            <Ionicons name="location" size={20} color="#EF4444" />
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Dirección de entrega</Text>
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={styles.orderDetailsSection}>
            <Text style={styles.sectionTitle}>Detalles del pedido</Text>

            <View style={styles.itemsList}>
              {itemsWithProducts.map((item, index) => (
                <View key={`${item.productId}-${index}`} style={styles.itemRow}>
                  <View style={styles.itemImageContainer}>
                    <ImageWithFallback
                      source={{
                        uri:
                          item.product?.image ||
                          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
                      }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    {item.quantity > 1 && (
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    )}
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Price Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(order.subtotal || order.total)}
              </Text>
            </View>

            {order.deliveryFee !== undefined && order.deliveryFee > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Costo de envío</Text>
                <Text style={styles.summaryValue}>{formatPrice(order.deliveryFee)}</Text>
              </View>
            )}

            {order.tip !== undefined && order.tip > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Propina</Text>
                <Text style={styles.summaryValue}>{formatPrice(order.tip)}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado:</Text>
              <Text style={styles.infoValue}>{getStatusLabel(currentStatus)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Método de pago:</Text>
              <Text style={styles.infoValue}>{order.paymentMethod}</Text>
            </View>

            {order.deliveryTime && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hora de entrega:</Text>
                <Text style={styles.infoValue}>{order.deliveryTime}</Text>
              </View>
            )}

            {order.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notas del pedido:</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{order.notes}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Status Update Buttons - SOLO 4 BOTONES */}
          {isAdmin &&
            currentStatus !== 'cancelled' &&
            currentStatus !== 'delivered' && (
              <View style={styles.statusUpdateSection}>
                <Text style={styles.statusUpdateTitle}>Actualizar estado del pedido</Text>
                <View style={styles.statusButtons}>
                  {/* Pendiente */}
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      (updatingStatus || currentStatus === 'pending') &&
                        styles.statusButtonDisabled,
                    ]}
                    onPress={() => updateStatus('pending')}
                    disabled={updatingStatus || currentStatus === 'pending'}
                  >
                    <LinearGradient
                      colors={['#FBBF24', '#F97316']}
                      style={styles.statusButtonGradient}
                    >
                      <Text style={styles.statusButtonText}>Pendiente</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Preparando */}
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      (updatingStatus || currentStatus === 'preparing') &&
                        styles.statusButtonDisabled,
                    ]}
                    onPress={() => updateStatus('preparing')}
                    disabled={updatingStatus || currentStatus === 'preparing'}
                  >
                    <LinearGradient
                      colors={['#F97316', '#EF4444']}
                      style={styles.statusButtonGradient}
                    >
                      <Text style={styles.statusButtonText}>Preparando</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* En Camino */}
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      (updatingStatus || currentStatus === 'delivering') &&
                        styles.statusButtonDisabled,
                    ]}
                    onPress={() => updateStatus('delivering')}
                    disabled={updatingStatus || currentStatus === 'delivering'}
                  >
                    <LinearGradient
                      colors={['#3B82F6', '#8B5CF6']}
                      style={styles.statusButtonGradient}
                    >
                      <Text style={styles.statusButtonText}>En Camino</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Entregado */}
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      updatingStatus &&
                        styles.statusButtonDisabled,
                    ]}
                    onPress={() => updateStatus('delivered')}
                    disabled={updatingStatus}
                  >
                    <LinearGradient
                      colors={['#10B981', '#14B8A6']}
                      style={styles.statusButtonGradient}
                    >
                      <Text style={styles.statusButtonText}>Entregado</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#FBF2E3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addressSection: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  callButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F97316',
    overflow: 'hidden',
  },
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  chatButtonText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
  orderDetailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summarySection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  additionalInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  notesContainer: {
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  notesBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
  },
  statusUpdateSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 16,
  },
  statusUpdateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusButton: {
    width: '48%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  statusButtonDisabled: {
    opacity: 0.5,
  },
  statusButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});