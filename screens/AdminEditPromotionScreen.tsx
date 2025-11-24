// screens/AdminEditPromotionScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAdminEditPromotionViewModel } from '../viewmodels/AdminEditPromotionViewModel';

interface AdminEditPromotionScreenProps {
  promotionId: string;
  restaurantId: string;
  onNavigateBack: () => void;
}

export function AdminEditPromotionScreen({
  promotionId,
  restaurantId,
  onNavigateBack,
}: AdminEditPromotionScreenProps) {
  const {
    promotion,
    title,
    setTitle,
    description,
    setDescription,
    discount,
    setDiscount,
    imageUri,
    minOrder,
    setMinOrder,
    deliveryTime,
    setDeliveryTime,
    expiresAt,
    setExpiresAt,
    active,
    setActive,
    loading,
    saving,
    pickImage,
    handleSubmit,
  } = useAdminEditPromotionViewModel(promotionId, restaurantId, onNavigateBack);

  const [showDatePicker, setShowDatePicker] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Cargando promoción...</Text>
      </View>
    );
  }

  if (!promotion) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No se pudo cargar la promoción</Text>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onNavigateBack}
            disabled={saving}
            style={styles.headerBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Promoción</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Imagen de la promoción <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            disabled={saving}
            activeOpacity={0.7}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
                <Text style={styles.imageHint}>Recomendado: 16:9</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Título <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Sushi DESCUENTO"
            placeholderTextColor="#9CA3AF"
            editable={!saving}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Descripción <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ej: Descuento del 10% ven y aprovecha"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!saving}
          />
        </View>

        {/* Discount */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Descuento <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={discount}
            onChangeText={setDiscount}
            placeholder="Ej: 10% OFF, 2x1"
            placeholderTextColor="#9CA3AF"
            editable={!saving}
          />
          <Text style={styles.hint}>Texto que aparecerá en la etiqueta de descuento</Text>
        </View>

        {/* Min Order */}
        <View style={styles.section}>
          <Text style={styles.label}>Pedido mínimo (opcional)</Text>
          <TextInput
            style={styles.input}
            value={minOrder}
            onChangeText={setMinOrder}
            placeholder="Ej: 20000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            editable={!saving}
          />
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Tiempo de entrega (opcional)</Text>
          <TextInput
            style={styles.input}
            value={deliveryTime}
            onChangeText={setDeliveryTime}
            placeholder="Ej: 15-20 min"
            placeholderTextColor="#9CA3AF"
            editable={!saving}
          />
        </View>

        {/* Expires At */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha de expiración (opcional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={saving}
          >
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.dateButtonText}>
              {expiresAt
                ? expiresAt.toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Seleccionar fecha'}
            </Text>
          </TouchableOpacity>
          {expiresAt && (
            <TouchableOpacity onPress={() => setExpiresAt(undefined)} disabled={saving}>
              <Text style={styles.clearDateText}>Limpiar fecha</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.hint}>Deja en blanco si no tiene fecha de expiración</Text>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={expiresAt || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setExpiresAt(selectedDate);
              }
            }}
          />
        )}

        {/* Active Switch */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.label}>Activar promoción</Text>
              <Text style={styles.hint}>La promoción estará visible para los usuarios</Text>
            </View>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ false: '#D1D5DB', true: '#FED7AA' }}
              thumbColor={active ? '#F97316' : '#9CA3AF'}
              disabled={saving}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F97316',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  imageHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  clearDateText: {
    fontSize: 12,
    color: '#F97316',
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  submitButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});