// viewmodels/AdminEditPromotionViewModel.ts
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Promotion, uploadPromotionImage } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

export function useAdminEditPromotionViewModel(
  promotionId: string,
  restaurantId: string,
  onSuccess: () => void
) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [imageUri, setImageUri] = useState<string>('');
  const [minOrder, setMinOrder] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    loadPromotion();
  }, [promotionId, restaurantId]);

  const loadPromotion = async () => {
    setLoading(true);
    const result = await AdminService.getPromotions(restaurantId);

    if (result.success && result.data) {
      const foundPromotion = result.data.find((p) => p.id === promotionId);
      if (foundPromotion) {
        setPromotion(foundPromotion);
        setTitle(foundPromotion.title);
        setDescription(foundPromotion.description);
        setDiscount(foundPromotion.discount);
        setImageUri(foundPromotion.image);
        setMinOrder(foundPromotion.minOrder?.toString() || '');
        setDeliveryTime(foundPromotion.deliveryTime || '');
        setExpiresAt(
          foundPromotion.expiresAt ? new Date(foundPromotion.expiresAt) : undefined
        );
        setActive(foundPromotion.active);
      } else {
        Alert.alert('Error', 'No se encontró la promoción');
      }
    } else {
      Alert.alert('Error', 'No se pudo cargar la promoción');
    }

    setLoading(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    if (!discount.trim()) {
      Alert.alert('Error', 'El descuento es obligatorio');
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Debes seleccionar una imagen');
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUri;

      // Si la imagen cambió, subirla
      if (imageChanged) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageResult = await uploadPromotionImage(blob, promotionId);

        if (!imageResult.success || !imageResult.imageURL) {
          Alert.alert('Error', 'No se pudo procesar la imagen');
          setSaving(false);
          return;
        }

        finalImageUrl = imageResult.imageURL;
      }

      // Preparar datos de actualización
      const updates: Partial<Promotion> = {
        title: title.trim(),
        description: description.trim(),
        discount: discount.trim(),
        image: finalImageUrl,
        active,
        minOrder: minOrder && parseFloat(minOrder) > 0 ? parseFloat(minOrder) : undefined,
        deliveryTime: deliveryTime.trim() || undefined,
        expiresAt: expiresAt ? expiresAt.getTime() : undefined,
      };

      // Actualizar promoción
      const result = await AdminService.updatePromotion(promotionId, restaurantId, updates);

      if (result.success) {
        Alert.alert('Éxito', 'Promoción actualizada exitosamente', [
          { text: 'OK', onPress: onSuccess },
        ]);
      } else {
        Alert.alert('Error', result.error || 'No se pudo actualizar la promoción');
      }
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar la promoción');
    }

    setSaving(false);
  };

  return {
    promotion,
    title,
    setTitle,
    description,
    setDescription,
    discount,
    setDiscount,
    imageUri,
    setImageUri,
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
  } as const;
}