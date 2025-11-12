// screens/OrderConfirmationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useOrderConfirmationViewModel } from '../viewmodels/OrderConfirmationViewModel';

const { width } = Dimensions.get('window');

interface OrderItem {
  id: string;
  name: string;
  price: number;
  restaurant?: string;
  image: string;
  quantity: number;
}

interface OrderConfirmationScreenProps {
  orderId?: string;
  restaurantId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  deliveryTime: string;
  onNavigateToHome: () => void;
}

export function OrderConfirmationScreen({
  orderId,
  restaurantId,
  items,
  subtotal,
  deliveryFee,
  tip,
  deliveryTime,
  onNavigateToHome,
}: OrderConfirmationScreenProps) {
  const {
    orderStatus,
    restaurantName,
    deliveryAddress,
    isLoading,
    total,
    estimatedTime,
    formatPrice,
    getStatusLabel,
    getProgressPercentage,
  } = useOrderConfirmationViewModel(
    orderId,
    restaurantId,
    items,
    subtotal,
    deliveryFee,
    tip,
    deliveryTime
  );

  const displayOrderId = orderId 
    ? `#${orderId.slice(-8).toUpperCase()}` 
    : `#RFD-${Math.floor(Math.random() * 10000)}`;

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
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={onNavigateToHome}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Confirmación</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de confirmación */}
        <View style={styles.confirmationCard}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={48} color="#10B981" />
          </View>
          <Text style={styles.confirmationTitle}>¡Pedido Confirmado!</Text>
          <Text style={styles.confirmationSubtitle}>
            Pedido {displayOrderId} ha sido creado
          </Text>
        </View>

        {/* Estado del pedido */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Estado del pedido</Text>
            <Text style={styles.statusBadge}>{getStatusLabel()}</Text>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#FEC901', '#F47A00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Pedido</Text>
              <Text style={styles.progressLabel}>Aceptado</Text>
              <Text style={styles.progressLabel}>Preparando</Text>
              <Text style={styles.progressLabel}>Entregado</Text>
            </View>
          </View>

          {/* Tiempo estimado */}
          <View style={styles.timeCard}>
            <View style={styles.timeLeft}>
              <View style={styles.timeIcon}>
                <Ionicons name="time" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.timeTitle}>Tiempo estimado de entrega</Text>
                <Text style={styles.timeSubtitle}>Tu pedido llegará pronto</Text>
              </View>
            </View>
            <Text style={styles.timeValue}>{estimatedTime}</Text>
          </View>
        </View>

        {/* Mapa con dirección real */}
        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={48} color="#EF4444" />
            {isLoading ? (
              <ActivityIndicator size="small" color="#F97316" style={{ marginTop: 12 }} />
            ) : (
              <>
                <Text style={styles.mapAddress}>{deliveryAddress}</Text>
                <View style={styles.mapStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.mapStatusText}>{restaurantName}</Text>
                </View>
                <Text style={styles.mapStatusLabel}>{getStatusLabel()}</Text>
              </>
            )}
          </View>
        </View>

        {/* Detalles del pedido */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Detalles del pedido</Text>

          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemImageContainer}>
                  <ImageWithFallback
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.quantity > 1 && (
                        <Text style={styles.itemQuantityLabel}>x{item.quantity}</Text>
                      )}
                    </View>
                    <View style={styles.itemPriceContainer}>
                      <Text style={styles.itemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Costo de envío</Text>
              <Text style={styles.totalValue}>{formatPrice(deliveryFee)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Propina</Text>
              <Text style={styles.totalValue}>{formatPrice(tip)}</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        {/* Botón nuevo pedido */}
        <View style={styles.newOrderContainer}>
          <TouchableOpacity
            onPress={onNavigateToHome}
            style={styles.newOrderButton}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FEC901', '#F47A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newOrderGradient}
            >
              <Text style={styles.newOrderText}>Realizar nuevo pedido</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  confirmationCard: {
    backgroundColor: '#10B981',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    color: '#6B7280',
    fontSize: 11,
  },
  timeCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timeIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F97316',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTitle: {
    color: '#374151',
    fontSize: 14,
  },
  timeSubtitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  timeValue: {
    color: '#F97316',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 192,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mapAddress: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  mapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  mapStatusText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  mapStatusLabel: {
    color: '#F97316',
    fontSize: 14,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  itemQuantityLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 2,
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  itemPrice: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  totalsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
    paddingTop: 16,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  totalValue: {
    color: '#1F2937',
    fontSize: 14,
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalFinalLabel: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalFinalValue: {
    color: '#F97316',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newOrderContainer: {
    marginTop: 0,
  },
  newOrderButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  newOrderGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  newOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});