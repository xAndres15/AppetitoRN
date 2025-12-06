// screens/AdminAddPromotionScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useAdminAddPromotionViewModel } from '../viewmodels/AdminAddPromotionViewModel';

interface AdminAddPromotionScreenProps {
  restaurantId: string;
  onNavigateBack: () => void;
}

export function AdminAddPromotionScreen({
  restaurantId,
  onNavigateBack,
}: AdminAddPromotionScreenProps) {
  const {
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
    products,
    selectedProductId,
    setSelectedProductId,
    loadingProducts,
    pickImage,
    handleSubmit,
  } = useAdminAddPromotionViewModel(restaurantId, onNavigateBack);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

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
            disabled={loading}
            style={styles.headerBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Promoción</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* NUEVO: Selector de Producto */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Producto en oferta <Text style={styles.required}>*</Text>
          </Text>
          
          {loadingProducts ? (
            <View style={styles.loadingProductsContainer}>
              <ActivityIndicator size="small" color="#F97316" />
              <Text style={styles.loadingProductsText}>Cargando productos...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.productSelector}
              onPress={() => setShowProductModal(true)}
              disabled={loading}
            >
              {selectedProduct ? (
                <View style={styles.selectedProductContainer}>
                  <ImageWithFallback
                    source={{ uri: selectedProduct.image }}
                    style={styles.selectedProductImage}
                  />
                  <View style={styles.selectedProductInfo}>
                    <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.selectedProductPrice}>
                      ${selectedProduct.price.toLocaleString('es-CO')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </View>
              ) : (
                <View style={styles.placeholderProductContainer}>
                  <Ionicons name="fast-food-outline" size={24} color="#9CA3AF" />
                  <Text style={styles.placeholderProductText}>Seleccionar producto</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Imagen de la promoción <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            disabled={loading}
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
            placeholder="Ej: Sushi Maduro 10%"
            placeholderTextColor="#9CA3AF"
            editable={!loading}
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
            editable={!loading}
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
            editable={!loading}
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
            editable={!loading}
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
            editable={!loading}
          />
        </View>

        {/* Expires At */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha de expiración (opcional)</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
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
            <TouchableOpacity onPress={() => setExpiresAt(undefined)} disabled={loading}>
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
              disabled={loading}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creando...' : 'Crear Promoción'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de selección de productos */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Producto</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productItem,
                    selectedProductId === product.id && styles.productItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedProductId(product.id!);
                    setShowProductModal(false);
                  }}
                >
                  <ImageWithFallback
                    source={{ uri: product.image }}
                    style={styles.productItemImage}
                  />
                  <View style={styles.productItemInfo}>
                    <Text style={styles.productItemName}>{product.name}</Text>
                    <Text style={styles.productItemPrice}>
                      ${product.price.toLocaleString('es-CO')}
                    </Text>
                  </View>
                  {selectedProductId === product.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#F97316" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  loadingProductsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  loadingProductsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  productSelector: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  selectedProductImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  selectedProductInfo: {
    flex: 1,
  },
  selectedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedProductPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
  placeholderProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  placeholderProductText: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  productItemSelected: {
    backgroundColor: '#FEF3C7',
  },
  productItemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  productItemInfo: {
    flex: 1,
  },
  productItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productItemPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
});