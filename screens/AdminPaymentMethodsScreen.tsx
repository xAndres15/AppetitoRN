// screens/AdminPaymentMethodsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAdminPaymentMethodsViewModel } from '../viewmodels/AdminPaymentMethodsViewModel';

interface AdminPaymentMethodsScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
}

export function AdminPaymentMethodsScreen({
  restaurantId,
  onNavigateBack,
}: AdminPaymentMethodsScreenProps) {
  const {
    paymentMethods,
    loading,
    saving,
    toggleCash,
    toggleCreditCard,
    toggleDebitCard,
    handleSave,
  } = useAdminPaymentMethodsViewModel(restaurantId, onNavigateBack);

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
          <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Métodos de Pago</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Ajustes de pago</Text>

          {/* Cash */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <Ionicons name="cash" size={24} color="#10B981" />
              <Text style={styles.paymentTitle}>Efectivo</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                paymentMethods.cash ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleCash}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  paymentMethods.cash ? styles.toggleCircleActive : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Credit Card */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <Ionicons name="card" size={24} color="#3B82F6" />
              <Text style={styles.paymentTitle}>Tarjeta de crédito</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                paymentMethods.creditCard ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleCreditCard}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  paymentMethods.creditCard
                    ? styles.toggleCircleActive
                    : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Debit Card */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <Ionicons name="card-outline" size={24} color="#8B5CF6" />
              <Text style={styles.paymentTitle}>Tarjeta de débito</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                paymentMethods.debitCard ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleDebitCard}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  paymentMethods.debitCard
                    ? styles.toggleCircleActive
                    : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#F97316" />
            <Text style={styles.infoText}>
              Selecciona los métodos de pago que aceptas en tu restaurante. Los clientes verán
              estas opciones al realizar pedidos.
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleInactive: {
    backgroundColor: '#D1D5DB',
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    alignSelf: 'flex-start',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});