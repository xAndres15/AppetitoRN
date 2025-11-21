// screens/AdminNotificationsSettingsScreen.tsx
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
import { useAdminNotificationsSettingsViewModel } from '../viewmodels/AdminNotificationsSettingsViewModel';

interface AdminNotificationsSettingsScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
}

export function AdminNotificationsSettingsScreen({
  restaurantId,
  onNavigateBack,
}: AdminNotificationsSettingsScreenProps) {
  const {
    settings,
    loading,
    saving,
    toggleNewOrders,
    toggleNewReservations,
    toggleReservationReminders,
    setNotificationSound,
    handleSave,
  } = useAdminNotificationsSettingsViewModel(restaurantId, onNavigateBack);

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
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Ajustes de notificación</Text>

          {/* New Orders */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Nuevos pedidos</Text>
              <Text style={styles.settingDescription}>
                Recibe notificaciones cuando lleguen nuevos pedidos
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                settings.newOrders ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleNewOrders}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  settings.newOrders ? styles.toggleCircleActive : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* New Reservations */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Nuevas reservas</Text>
              <Text style={styles.settingDescription}>
                Recibe notificaciones cuando haya nuevas reservas
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                settings.newReservations ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleNewReservations}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  settings.newReservations
                    ? styles.toggleCircleActive
                    : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Reservation Reminders */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Recordatorios de reservas</Text>
              <Text style={styles.settingDescription}>
                Recibe recordatorios antes de cada reserva
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                settings.reservationReminders ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={toggleReservationReminders}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  settings.reservationReminders
                    ? styles.toggleCircleActive
                    : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Notification Sound */}
          <View style={styles.soundSection}>
            <Text style={styles.label}>Sonido de notificación</Text>
            <TextInput
              style={styles.input}
              value={settings.notificationSound}
              onChangeText={setNotificationSound}
              placeholder="Por defecto"
              placeholderTextColor="#9CA3AF"
              editable={!saving}
            />
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
    backgroundColor: '#F9FAFB',
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
  settingRow: {
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
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
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
  soundSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
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