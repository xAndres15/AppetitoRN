// screens/MakeReservationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomNav } from '../components/BottomNav';
import { Restaurant } from '../models/Reservation';
import { useMakeReservationViewModel } from '../viewmodels/MakeReservationViewModel';

interface MakeReservationScreenProps {
  restaurant: Restaurant;
  onNavigateBack: () => void;
  onReservationSuccess: (reservationData: any) => void;
}

export function MakeReservationScreen({
  restaurant,
  onNavigateBack,
  onReservationSuccess,
}: MakeReservationScreenProps) {
  const {
    date,
    setDate,
    time,
    setTime,
    numberOfPeople,
    setNumberOfPeople,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    isLoading,
    isLoadingUserData,
    handleSubmit,
    timeOptions,
    peopleOptions,
    formatDateForDisplay,
  } = useMakeReservationViewModel(restaurant);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (result.success && result.data) {
      // Llamar al callback con todos los datos necesarios
      onReservationSuccess({
        date: result.data.date,
        time: result.data.time,
        numberOfPeople: result.data.numberOfPeople,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        restaurantName: restaurant.name,
        restaurantLocation: restaurant.location,
        reservationId: result.reservationId,
      });
    }
  };

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
          <View style={styles.searchRow}>
            {/* Botón Back */}
            <TouchableOpacity
              onPress={onNavigateBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Buscar"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                editable={false}
              />
            </View>

            {/* Botón de notificaciones */}
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Reserva tu mesa</Text>

        {/* Fecha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.pickerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.pickerIcon} />
            <Text style={date ? styles.pickerText : styles.pickerPlaceholder}>
              {date ? formatDateForDisplay(date) : 'Seleccionar Fecha'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Hora */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.pickerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={20} color="#6B7280" style={styles.pickerIcon} />
            <Text style={time ? styles.pickerText : styles.pickerPlaceholder}>
              {time || 'Seleccionar Hora'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal para seleccionar hora */}
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Hora</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modalOption,
                      time === option && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setTime(option);
                      setShowTimePicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        time === option && styles.modalOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Personas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Personas</Text>
          <TouchableOpacity
            onPress={() => setShowPeoplePicker(true)}
            style={styles.pickerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={20} color="#6B7280" style={styles.pickerIcon} />
            <Text style={numberOfPeople ? styles.pickerText : styles.pickerPlaceholder}>
              {numberOfPeople
                ? peopleOptions.find((p) => p.value === numberOfPeople)?.label
                : 'Seleccionar Personas'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal para seleccionar personas */}
        <Modal
          visible={showPeoplePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPeoplePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar Personas</Text>
                <TouchableOpacity onPress={() => setShowPeoplePicker(false)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {peopleOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      numberOfPeople === option.value && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setNumberOfPeople(option.value);
                      setShowPeoplePicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        numberOfPeople === option.value && styles.modalOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Tu nombre completo"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="tu@email.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            placeholder="+57 321 ___ ____"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>

        {/* Botón de reservar */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={isLoading || isLoadingUserData}
          style={[
            styles.submitButton,
            (isLoading || isLoadingUserData) && styles.submitButtonDisabled,
          ]}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FEC901', '#F47A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Reservando...' : 'Reserva Ahora'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Espacio para bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="home" />
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  pageTitle: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerText: {
    color: '#374151',
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#374151',
  },
  submitButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#FEF3C7',
  },
  modalOptionText: {
    color: '#374151',
    fontSize: 16,
  },
  modalOptionTextSelected: {
    color: '#F97316',
    fontWeight: '600',
  },
});