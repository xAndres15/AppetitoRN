// screens/CheckoutScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
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
import {
  PaymentMethod,
  TipAmount,
  useCheckoutViewModel
} from '../viewmodels/CheckoutViewModel';

const { width } = Dimensions.get('window');

interface CheckoutScreenProps {
  subtotal: number;
  onNavigateBack: () => void;
  onConfirmOrder: (orderId: string, restaurantId: string, deliveryFee: number, tip: number, deliveryTime: string) => void;
}

export function CheckoutScreen({
  subtotal,
  onNavigateBack,
  onConfirmOrder,
}: CheckoutScreenProps) {
  const {
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    deliveryTime,
    setDeliveryTime,
    selectedTip,
    setSelectedTip,
    customTip,
    setCustomTip,
    notes,
    setNotes,
    isProcessing,
    isLoadingAddress,
    loadUserAddress,
    calculateDeliveryFee,
    calculateTip,
    calculateTotal,
    formatPrice,
    handleConfirmOrder,
  } = useCheckoutViewModel(subtotal);

  useEffect(() => {
    loadUserAddress();
  }, []);

  const onConfirm = async () => {
    const result = await handleConfirmOrder();
    if (result.success && result.orderId && result.restaurantId) {
      onConfirmOrder(
        result.orderId,
        result.restaurantId,
        calculateDeliveryFee(),
        calculateTip(),
        deliveryTime === 'express' ? '15-20 min' : '30-45 min'
      );
    }
  };

  const paymentMethods: PaymentMethod[] = ['Efectivo', 'Tarjeta', 'Nequi'];
  const tipOptions: { label: string; value: TipAmount }[] = [
    { label: 'Sin propina', value: 0 },
    { label: '$ 2.000', value: 2000 },
    { label: '$ 5.000', value: 5000 },
    { label: 'Personalizada', value: 'custom' },
  ];

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
              onPress={onNavigateBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Finalizar Pedido</Text>
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
        <View style={styles.formContainer}>
          {/* Dirección de entrega */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dirección de entrega</Text>
            {isLoadingAddress ? (
              <ActivityIndicator size="small" color="#F97316" />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu dirección"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
              />
            )}
          </View>

          {/* Método de pago */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de pago</Text>
            <View style={styles.optionsContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.optionCard,
                    paymentMethod === method && styles.optionCardActive,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOuter}>
                    {paymentMethod === method && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      paymentMethod === method && styles.optionTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tiempo de entrega */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiempo de entrega</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  deliveryTime === 'standard' && styles.optionCardActive,
                ]}
                onPress={() => setDeliveryTime('standard')}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {deliveryTime === 'standard' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      deliveryTime === 'standard' && styles.optionTextActive,
                    ]}
                  >
                    Estándar
                  </Text>
                  <Text style={styles.optionSubtext}>30-45 minutos</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  deliveryTime === 'express' && styles.optionCardActive,
                ]}
                onPress={() => setDeliveryTime('express')}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {deliveryTime === 'express' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      deliveryTime === 'express' && styles.optionTextActive,
                    ]}
                  >
                    Rápido
                  </Text>
                  <Text style={styles.optionSubtext}>
                    15-20 minutos (+$ 2.000)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Propina */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propina</Text>
            <View style={styles.tipsGrid}>
              {tipOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.tipOption,
                    selectedTip === option.value && styles.tipOptionActive,
                  ]}
                  onPress={() => setSelectedTip(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tipText,
                      selectedTip === option.value && styles.tipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedTip === 'custom' && (
              <TextInput
                style={styles.input}
                placeholder="Ingresa el monto de la propina"
                value={customTip}
                onChangeText={setCustomTip}
                keyboardType="numeric"
              />
            )}
          </View>

          {/* Notas adicionales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas adicionales (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ej: Sin cebolla, extra picante, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Resumen del pedido */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del pedido</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Costo de envío</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(calculateDeliveryFee())}
              </Text>
            </View>

            {calculateTip() > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Propina</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(calculateTip())}
                </Text>
              </View>
            )}

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                {formatPrice(calculateTotal())}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer - Botón de confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={isProcessing}
          style={styles.confirmButton}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FEC901', '#F47A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmGradient}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.confirmButtonText}>Confirmar pedido</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  formContainer: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  optionCardActive: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F97316',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  optionSubtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tipOptionActive: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  tipText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  tipTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  summaryValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  confirmButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});