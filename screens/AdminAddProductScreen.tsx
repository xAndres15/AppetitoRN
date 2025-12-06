// screens/AdminAddProductScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
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
import { useAdminAddProductViewModel } from '../viewmodels/AdminAddProductViewModel';

interface AdminAddProductScreenProps {
  restaurantId: string | null;
  onNavigateBack: () => void;
}

export function AdminAddProductScreen({
  restaurantId,
  onNavigateBack,
}: AdminAddProductScreenProps) {
  const {
    productName,
    setProductName,
    price,
    setPrice,
    description,
    setDescription,
    category,
    setCategory,
    hasDiscount,
    setHasDiscount,
    selectedDiscount,
    setSelectedDiscount,
    customDiscount,
    setCustomDiscount,
    imageUri,
    saving,
    pickImage,
    handleAddProduct,
  } = useAdminAddProductViewModel(restaurantId, onNavigateBack);

  const discountOptions = [5, 10, 15, 20];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient colors={['#FEC901', '#F47A00']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                editable={false}
              />
            </View>

            <View style={styles.notificationContainer}>
              <View style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#374151" />
              </View>
              <View style={styles.badge} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Image Upload */}
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image" size={64} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Agregar imagen</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Product Name */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nombre del Producto *"
              placeholderTextColor="#9CA3AF"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />
          </View>

          {/* Category */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Categoría (ej: hamburguesas, pizzas, bebidas) *"
              placeholderTextColor="#9CA3AF"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
          </View>

          {/* Price */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Precio *"
              placeholderTextColor="#9CA3AF"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Descripción del producto (opcional)"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          {/* Discount Toggle */}
          <View style={styles.discountSection}>
            <View style={styles.discountToggle}>
              <Text style={styles.discountLabel}>Descuento</Text>
              <Switch
                value={hasDiscount}
                onValueChange={setHasDiscount}
                trackColor={{ false: '#D1D5DB', true: '#FB923C' }}
                thumbColor={hasDiscount ? '#F97316' : '#F3F4F6'}
              />
            </View>

            {/* Discount Options */}
            {hasDiscount && (
              <View style={styles.discountOptions}>
                {/* Custom Discount Input */}
                <View style={styles.customDiscountContainer}>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={customDiscount}
                    onChangeText={(text) => {
                      setCustomDiscount(text);
                      setSelectedDiscount(null);
                    }}
                    keyboardType="numeric"
                    style={styles.customDiscountInput}
                  />
                  <Text style={styles.percentSymbol}>%</Text>
                </View>

                {/* Preset Discount Options */}
                {discountOptions.map((discount) => (
                  <TouchableOpacity
                    key={discount}
                    onPress={() => {
                      setSelectedDiscount(discount);
                      setCustomDiscount('');
                    }}
                    style={[
                      styles.discountButton,
                      selectedDiscount === discount && styles.discountButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.discountButtonText,
                        selectedDiscount === discount && styles.discountButtonTextActive,
                      ]}
                    >
                      {discount}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleAddProduct}
            disabled={saving}
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          >
            <LinearGradient
              colors={['#FEC901', '#F47A00']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Agregar al menú</Text>
              )}
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
    backgroundColor: '#FBF2E3',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 12,
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
    backgroundColor: '#FFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  discountSection: {
    marginBottom: 32,
  },
  discountToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  discountOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  customDiscountContainer: {
    width: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  customDiscountInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  percentSymbol: {
    fontSize: 14,
    color: '#6B7280',
  },
  discountButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountButtonActive: {
    backgroundColor: '#F97316',
  },
  discountButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  discountButtonTextActive: {
    color: '#FFF',
  },
  submitButton: {
    borderRadius: 24,
    overflow: 'hidden',
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});