// screens/AdminOperatingHoursScreen.tsx
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
import { useAdminOperatingHoursViewModel } from '../viewmodels/AdminOperatingHoursViewModel';

interface AdminOperatingHoursScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
}

export function AdminOperatingHoursScreen({
  restaurantId,
  onNavigateBack,
}: AdminOperatingHoursScreenProps) {
  const {
    schedule,
    loading,
    saving,
    handleHoursChange,
    handleToggleDay,
    handleSave,
  } = useAdminOperatingHoursViewModel(restaurantId, onNavigateBack);

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
          <Text style={styles.headerTitle}>Horarios de operación</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Schedule List */}
          {schedule.map((item, index) => (
            <View key={item.day} style={styles.scheduleRow}>
              {/* Day Name */}
              <Text style={styles.dayText}>{item.day}</Text>

              {/* Hours Input */}
              <TextInput
                style={[
                  styles.hoursInput,
                  !item.isOpen && styles.hoursInputDisabled,
                ]}
                value={item.hours}
                onChangeText={(value) => handleHoursChange(index, value)}
                placeholder="HH:MM - HH:MM"
                placeholderTextColor="#9CA3AF"
                editable={item.isOpen && !saving}
              />

              {/* Toggle */}
              <TouchableOpacity
                style={[
                  styles.toggle,
                  item.isOpen ? styles.toggleActive : styles.toggleInactive,
                ]}
                onPress={() => handleToggleDay(index)}
                disabled={saving}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    item.isOpen ? styles.toggleCircleActive : styles.toggleCircleInactive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          ))}

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#F97316" />
            <Text style={styles.infoText}>
              Estos horarios se mostrarán en la información del restaurante visible para los
              clientes.
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
                {saving ? 'Guardando...' : 'Guardar horarios'}
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
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 90,
  },
  hoursInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    marginRight: 12,
  },
  hoursInputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
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