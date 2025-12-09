// screens/AdminEditProductScreen.tsx
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
  View
} from 'react-native';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ReviewCard } from '../components/ReviewCard';
import { StarRating } from '../components/StarRating';
import { Product } from '../lib/firebase';
import { useAdminEditProductViewModel } from '../viewmodels/AdminEditProductViewModel';

interface AdminEditProductScreenProps {
  restaurantId: string | null;
  product: Product;
  onNavigateBack: () => void;
}

export function AdminEditProductScreen({
  restaurantId,
  product,
  onNavigateBack,
}: AdminEditProductScreenProps) {
  const {
    editedProduct,
    setProductName,
    setProductPrice,
    setProductDescription,
    setProductCategory,
    setProductAvailable,
    imageUri,
    saving,
    pickImage,
    handleSave,
    handleDelete,
    // ✅ NUEVO: Reviews data
    reviews,
    loadingReviews,
    ratingStats,
    showAllReviews,
    setShowAllReviews,
  } = useAdminEditProductViewModel(restaurantId, product, onNavigateBack);

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
          <Text style={styles.headerTitle}>Editar Producto</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <ImageWithFallback
              source={{ uri: imageUri || editedProduct.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            
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

        {/* Product Details Form */}
        <View style={styles.formContainer}>
          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del producto</Text>
            <TextInput
              style={styles.input}
              value={editedProduct.name}
              onChangeText={setProductName}
              placeholder="Ej: Hamburguesa Especial"
              placeholderTextColor="#9CA3AF"
              editable={!saving}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              value={editedProduct.category}
              onChangeText={setProductCategory}
              placeholder="Ej: Hamburguesas"
              placeholderTextColor="#9CA3AF"
              editable={!saving}
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={editedProduct.price.toString()}
                onChangeText={setProductPrice}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                editable={!saving}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedProduct.description}
              onChangeText={setProductDescription}
              placeholder="Describe tu producto..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!saving}
            />
          </View>

          {/* Availability Toggle */}
          <View style={styles.availabilityContainer}>
            <View>
              <Text style={styles.availabilityLabel}>Disponibilidad</Text>
              <Text style={styles.availabilityHint}>
                {editedProduct.available ? 'El producto está disponible' : 'El producto no está disponible'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                editedProduct.available ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={() => setProductAvailable(!editedProduct.available)}
              disabled={saving}
            >
              <View
                style={[
                  styles.toggleCircle,
                  editedProduct.available ? styles.toggleCircleActive : styles.toggleCircleInactive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* ✅ NUEVA SECCIÓN: Calificaciones y Reseñas */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Calificaciones y Reseñas</Text>
            
            {loadingReviews ? (
              <View style={styles.reviewsLoading}>
                <ActivityIndicator size="small" color="#F97316" />
                <Text style={styles.loadingText}>Cargando calificaciones...</Text>
              </View>
            ) : ratingStats && ratingStats.totalReviews > 0 ? (
              <>
                {/* Rating Summary */}
                <View style={styles.ratingSummary}>
                  <View style={styles.ratingOverview}>
                    <Text style={styles.ratingNumber}>{ratingStats.averageRating.toFixed(1)}</Text>
                    <StarRating rating={ratingStats.averageRating} size={20} readonly />
                    <Text style={styles.totalReviews}>
                      {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'reseña' : 'reseñas'}
                    </Text>
                  </View>

                  {/* Rating Distribution */}
                  <View style={styles.ratingDistribution}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingStats.ratingDistribution[star as keyof typeof ratingStats.ratingDistribution] || 0;
                      const percentage = (count / ratingStats.totalReviews) * 100;
                      
                      return (
                        <View key={star} style={styles.distributionRow}>
                          <Text style={styles.starLabel}>{star}★</Text>
                          <View style={styles.progressBarContainer}>
                            <View 
                              style={[
                                styles.progressBar, 
                                { width: `${percentage}%` }
                              ]} 
                            />
                          </View>
                          <Text style={styles.countLabel}>{count}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Reviews List */}
                {reviews.length > 0 && (
                  <View style={styles.reviewsList}>
                    <TouchableOpacity
                      style={styles.reviewsHeader}
                      onPress={() => setShowAllReviews(!showAllReviews)}
                    >
                      <Text style={styles.reviewsTitle}>Reseñas recientes</Text>
                      <Ionicons 
                        name={showAllReviews ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#6B7280" 
                      />
                    </TouchableOpacity>

                    {showAllReviews && (
                      <View style={styles.reviewsContent}>
                        {reviews.map((review, index) => (
                          <ReviewCard key={review.id || index} review={review} />
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noReviews}>
                <Ionicons name="star-outline" size={48} color="#D1D5DB" />
                <Text style={styles.noReviewsText}>Este producto aún no tiene calificaciones</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.deleteButton, saving && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={saving}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Ionicons name="checkmark" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 20,
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
  imageSection: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
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
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  availabilityHint: {
    fontSize: 14,
    color: '#6B7280',
  },
  toggleButton: {
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
  // ✅ NUEVOS ESTILOS PARA REVIEWS
  reviewsSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  reviewsLoading: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSummary: {
    gap: 16,
  },
  ratingOverview: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  ratingDistribution: {
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 24,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  countLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 30,
    textAlign: 'right',
  },
  reviewsList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewsContent: {
    gap: 12,
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});