// screens/AdminRestaurantInfoEditScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useAdminRestaurantInfoEditViewModel } from '../viewmodels/AdminRestaurantInfoEditViewModel';

interface AdminRestaurantInfoEditScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
}

export function AdminRestaurantInfoEditScreen({
  restaurantId,
  onNavigateBack,
}: AdminRestaurantInfoEditScreenProps) {
  const {
    formData,
    loading,
    saving,
    imageUri,
    updateField,
    pickImage,
    handleSave,
  } = useAdminRestaurantInfoEditViewModel(restaurantId, onNavigateBack);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Información del restaurante</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Restaurant Image */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Imagen del restaurante</Text>
            <View style={styles.imageContainer}>
              {imageUri || formData.image ? (
                <ImageWithFallback
                  source={{ uri: imageUri || formData.image }}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyImage}>
                  <Ionicons name="camera-outline" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyImageText}>Sin imagen</Text>
                </View>
              )}

              {/* Edit Image Button */}
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={pickImage}
                disabled={saving}
              >
                <Ionicons name="camera" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información básica</Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del restaurante *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Ej: Burger Bros"
                placeholderTextColor="#9CA3AF"
                editable={!saving}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                placeholder="Describe tu restaurante"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!saving}
              />
            </View>

            {/* Cuisine */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de cocina</Text>
              <TextInput
                style={styles.input}
                value={formData.cuisine}
                onChangeText={(value) => updateField('cuisine', value)}
                placeholder="Ej: Comida rápida, hamburguesas"
                placeholderTextColor="#9CA3AF"
                editable={!saving}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                placeholder="Ej: Zona T, Bogotá"
                placeholderTextColor="#9CA3AF"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección completa</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                placeholder="Ej: Calle 82 #12-34"
                placeholderTextColor="#9CA3AF"
                editable={!saving}
              />
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="Ej: +57 322 750 1226"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Ej: contacto@restaurant.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!saving}
              />
            </View>
          </View>

          {/* Social Media */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redes Sociales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Facebook</Text>
              <TextInput
                style={styles.input}
                value={formData.facebook}
                onChangeText={(value) => updateField('facebook', value)}
                placeholder="https://facebook.com/..."
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram</Text>
              <TextInput
                style={styles.input}
                value={formData.instagram}
                onChangeText={(value) => updateField('instagram', value)}
                placeholder="https://instagram.com/..."
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Twitter</Text>
              <TextInput
                style={styles.input}
                value={formData.twitter}
                onChangeText={(value) => updateField('twitter', value)}
                placeholder="https://twitter.com/..."
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TikTok</Text>
              <TextInput
                style={styles.input}
                value={formData.tiktok}
                onChangeText={(value) => updateField('tiktok', value)}
                placeholder="https://tiktok.com/@..."
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                editable={!saving}
              />
            </View>
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
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  emptyImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImageText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
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