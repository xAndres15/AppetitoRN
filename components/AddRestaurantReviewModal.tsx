// components/AddRestaurantReviewModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, createRestaurantReview, getUserData } from '../lib/firebase';
import StarRating from './StarRating';

interface AddRestaurantReviewModalProps {
  visible: boolean;
  onClose: () => void;
  reservationId: string;
  restaurantId: string;
  restaurantName: string;
  onReviewSubmitted: () => void;
}

export default function AddRestaurantReviewModal({
  visible,
  onClose,
  reservationId,
  restaurantId,
  restaurantName,
  onReviewSubmitted,
}: AddRestaurantReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validación
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para calificar');
      return;
    }

    try {
      setIsSubmitting(true);

      // Obtener nombre completo del usuario
      const userDataResult = await getUserData(user.uid);
      let userName = user.email || 'Usuario';

      if (userDataResult.success && userDataResult.data) {
        const { name, lastName } = userDataResult.data;
        if (name && lastName) {
          userName = `${name} ${lastName}`;
        } else if (name) {
          userName = name;
        }
      }

      // Crear la review
      const result = await createRestaurantReview({
        restaurantId,
        restaurantName,
        userId: user.uid,
        userName,
        rating,
        comment: comment.trim(),
        reservationId,
        createdAt: Date.now(),
      });

      if (result.success) {
        Alert.alert('¡Éxito!', 'Tu calificación ha sido enviada');
        resetForm();
        onReviewSubmitted();
      } else {
        Alert.alert('Error', result.error || 'No se pudo enviar la calificación');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error.message || 'Error al enviar la calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Calificar Restaurante</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSubmitting}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Restaurant Info */}
            <View style={styles.restaurantInfo}>
              <Ionicons name="restaurant" size={24} color="#F97316" />
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            </View>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.label}>Tu calificación</Text>
              <View style={styles.starsContainer}>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={40}
                  readonly={false}
                  color="#F97316"
                />
              </View>
              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating} {rating === 1 ? 'estrella' : 'estrellas'}
                </Text>
              )}
            </View>

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <Text style={styles.label}>
                Comentario <Text style={styles.optional}>(opcional)</Text>
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Cuéntanos sobre tu experiencia..."
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                editable={!isSubmitting}
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.submitButtonText}>Enviar Calificación</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF2E3',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  optional: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  starsContainer: {
    marginVertical: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});