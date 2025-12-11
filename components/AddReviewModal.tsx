// components/AddReviewModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, createProductReview, getUserData } from '../lib/firebase';
import { ImageWithFallback } from './ImageWithFallback';
import StarRating from './StarRating';

// ✅ INTERFACE COMPLETAMENTE FLEXIBLE
interface OrderItem {
  id?: string;
  productId?: string;
  productName?: string;  // ✅ AHORA ES OPCIONAL
  name?: string;
  quantity: number;
  price: number;
  image?: string;
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
  originalPrice?: number;
}

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  restaurantId: string;
  items: OrderItem[];
  onReviewSubmitted: () => void;
}

export function AddReviewModal({
  visible,
  onClose,
  orderId,
  restaurantId,
  items,
  onReviewSubmitted,
}: AddReviewModalProps) {
  const [ratings, setRatings] = useState<{ [productId: string]: number }>({});
  const [comments, setComments] = useState<{ [productId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (productId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [productId]: comment }));
  };

  const handleSubmit = async () => {
    console.log('🔵 [MODAL] Iniciando envío de reviews...');
    console.log('🔵 [MODAL] Items recibidos:', items.length);
    
    const getProductId = (item: OrderItem): string | undefined => {
      return item.productId || item.id;
    };

    const allRated = items.every((item) => {
      const productId = getProductId(item);
      return productId && ratings[productId] && ratings[productId] > 0;
    });

    if (!allRated) {
      Alert.alert('Error', 'Por favor califica todos los productos');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para calificar');
        setIsSubmitting(false);
        return;
      }

      console.log('🔵 [MODAL] Usuario autenticado:', user.uid);

      // ✅ OBTENER NOMBRE COMPLETO DEL USUARIO
      const userDataResult = await getUserData(user.uid);
      
      let userName = 'Usuario';
      if (userDataResult.success && userDataResult.data) {
        const userData = userDataResult.data;
        if (userData.name && userData.lastName) {
          userName = `${userData.name} ${userData.lastName}`;
        } else if (userData.name) {
          userName = userData.name;
        } else if (user.email) {
          userName = user.email.split('@')[0];
        }
      } else if (user.displayName) {
        userName = user.displayName;
      } else if (user.email) {
        userName = user.email.split('@')[0];
      }

      console.log('🔵 [MODAL] Nombre del usuario:', userName);

      // Enviar reviews para cada producto
      for (const item of items) {
        const productId = getProductId(item);
        
        if (!productId) {
          console.error('❌ [MODAL] Item sin productId:', item);
          continue;
        }

        const rating = ratings[productId];
        const comment = comments[productId];
        const productName = item.productName || item.name || 'Producto';

        const result = await createProductReview({
          productId: productId,
          productName: productName,
          userId: user.uid,
          userName: userName,
          rating: rating,
          comment: comment || '',
          orderId: orderId,
          restaurantId: restaurantId,
          createdAt: Date.now(),
        } as any);

        if (!result.success) {
          throw new Error(result.error || 'Error al crear review');
        }

        console.log('✅ [MODAL] Review creada para:', productName);
      }

      Alert.alert('¡Éxito!', 'Gracias por tu calificación');
      onReviewSubmitted();
      onClose();
    } catch (error: any) {
      console.error('❌ [MODAL] Error:', error);
      Alert.alert('Error', 'Hubo un problema al enviar tu calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Califica tu pedido</Text>
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {items.map((item, index) => {
              const productId = item.productId || item.id || `fallback-${index}`;
              const productName = item.productName || item.name || 'Producto';
              
              return (
                <View key={productId} style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <View style={styles.productImageContainer}>
                      <ImageWithFallback
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{productName}</Text>
                      <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
                    </View>
                  </View>

                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>Tu calificación:</Text>
                    <StarRating
                      rating={ratings[productId] || 0}
                      onRatingChange={(rating) => handleRatingChange(productId, rating)}
                      size={32}
                    />
                  </View>

                  <TextInput
                    style={styles.commentInput}
                    placeholder="Comentario (opcional)"
                    placeholderTextColor="#9CA3AF"
                    value={comments[productId] || ''}
                    onChangeText={(text) => handleCommentChange(productId, text)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                  />
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar calificaciones</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollView: {
    maxHeight: 400,
  },
  productCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});