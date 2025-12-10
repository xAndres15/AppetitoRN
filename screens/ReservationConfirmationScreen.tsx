// screens/ReservationConfirmationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AddRestaurantReviewModal from '../components/AddRestaurantReviewModal';
import { BottomNav } from '../components/BottomNav';
import { useReservationConfirmationViewModel } from '../viewmodels/ReservationConfirmationViewModel';

const { width } = Dimensions.get('window');

interface ReservationConfirmationScreenProps {
  reservationData: {
    date: string;
    time: string;
    numberOfPeople: string;
    name: string;
    email: string;
    phone: string;
    restaurantName: string;
    restaurantLocation: string;
    reservationId?: string;
    restaurantId?: string;
  };
  onNavigateBack: () => void;
  onNavigateHome: () => void;
}

export function ReservationConfirmationScreen({
  reservationData,
  onNavigateBack,
  onNavigateHome,
}: ReservationConfirmationScreenProps) {
  const { 
    reservationNumber, 
    formatDate, 
    getPeopleLabel,
    hasReviewed,
    checkingReview 
  } = useReservationConfirmationViewModel(reservationData);

  const [showReviewModal, setShowReviewModal] = useState(false);

  // ✅ LOGS DE DEBUG - VER QUÉ DATOS LLEGAN
  console.log('🔍 ========== RESERVATION CONFIRMATION DEBUG ==========');
  console.log('🔍 [reservationData]:', JSON.stringify(reservationData, null, 2));
  console.log('🔍 [reservationId]:', reservationData.reservationId);
  console.log('🔍 [restaurantId]:', reservationData.restaurantId);
  console.log('🔍 [hasReviewed]:', hasReviewed);
  console.log('🔍 [checkingReview]:', checkingReview);
  console.log('🔍 ===================================================');

  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
  };

  // ✅ VERIFICAR SI TENEMOS LOS DATOS MÍNIMOS PARA MOSTRAR EL BOTÓN
  const canShowRateButton = reservationData.restaurantId && (reservationData.reservationId || reservationData.date);
  
  console.log('🔍 [canShowRateButton]:', canShowRateButton);

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

            {/* Botón de notificaciones con badge */}
            <View style={styles.notificationContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de éxito */}
        <View style={styles.successCard}>
          <View style={styles.checkIconContainer}>
            <Ionicons name="checkmark" size={40} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>¡Reserva Confirmada!</Text>
          <Text style={styles.successSubtitle}>
            Tu reserva ha sido confirmada. Hemos enviado los detalles al correo
            electrónico
          </Text>
        </View>

        {/* Nombre del restaurante y número de reserva */}
        <View style={styles.restaurantSection}>
          <Text style={styles.restaurantName}>{reservationData.restaurantName}</Text>
          <Text style={styles.reservationNumberText}>
            Número de reserva:{' '}
            <Text style={styles.reservationNumber}>{reservationNumber}</Text>
          </Text>
        </View>

        {/* Detalles de la reserva */}
        <View style={styles.detailsSection}>
          {/* Fecha */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={28} color="#374151" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Fecha</Text>
              <Text style={styles.detailValue}>
                {formatDate(reservationData.date)}
              </Text>
            </View>
          </View>

          {/* Hora */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={28} color="#374151" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Hora</Text>
              <Text style={styles.detailValue}>{reservationData.time}</Text>
            </View>
          </View>

          {/* Personas */}
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="people-outline" size={28} color="#374151" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Personas</Text>
              <Text style={styles.detailValue}>
                {getPeopleLabel(reservationData.numberOfPeople)}
              </Text>
            </View>
          </View>

          {/* Ubicación */}
          <View style={[styles.detailRow, styles.detailRowLast]}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={28} color="#374151" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Ubicación</Text>
              <Text style={styles.detailValue}>
                {reservationData.restaurantLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* ✅ SECCIÓN DE CALIFICACIÓN - MOSTRAR SIEMPRE PARA DEBUG */}
        {canShowRateButton && !checkingReview && (
          <View style={styles.rateSection}>
            {!hasReviewed ? (
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => {
                  console.log('🔵 [BUTTON PRESSED] Abriendo modal de review');
                  setShowReviewModal(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="star" size={24} color="#fff" />
                <Text style={styles.rateButtonText}>Calificar Restaurante</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ratedContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.ratedText}>Ya calificaste este restaurante</Text>
              </View>
            )}
          </View>
        )}

        {/* ✅ DEBUG INFO - MOSTRAR SI NO HAY BOTÓN */}
        {!canShowRateButton && (
          <View style={styles.debugSection}>
            <Text style={styles.debugText}>
              ⚠️ DEBUG: Botón de calificación oculto
            </Text>
            <Text style={styles.debugText}>
              restaurantId: {reservationData.restaurantId || 'FALTANTE'}
            </Text>
            <Text style={styles.debugText}>
              reservationId: {reservationData.reservationId || 'FALTANTE'}
            </Text>
          </View>
        )}

        {/* Aviso importante */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeText}>
            Por favor, llega 10 minutos antes de tu reserva. Si necesitas
            cancelar o modificar tu reserva, hazlo con al menos 2 horas de
            anticipación.
          </Text>
        </View>

        {/* Espacio para bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ✅ MODAL DE CALIFICACIÓN */}
      {canShowRateButton && (
        <AddRestaurantReviewModal
          visible={showReviewModal}
          onClose={() => {
            console.log('🔵 [MODAL] Cerrando modal');
            setShowReviewModal(false);
          }}
          reservationId={reservationData.reservationId || `temp-${Date.now()}`}
          restaurantId={reservationData.restaurantId!}
          restaurantName={reservationData.restaurantName}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

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
  notificationContainer: {
    position: 'relative',
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  successCard: {
    backgroundColor: '#10B981',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  restaurantSection: {
    marginBottom: 24,
  },
  restaurantName: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reservationNumberText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  reservationNumber: {
    color: '#6B7280',
    fontWeight: '500',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  detailRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  rateSection: {
    marginBottom: 24,
  },
  rateButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  ratedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  ratedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  debugSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  debugText: {
    color: '#92400E',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  noticeSection: {
    marginBottom: 24,
  },
  noticeText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
  },
});