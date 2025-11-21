// viewmodels/AdminRestaurantInfoEditViewModel.ts
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    getRestaurantInfo,
    updateRestaurantInfo,
    uploadRestaurantImage,
} from '../lib/firebase';

interface FormData {
  name: string;
  description: string;
  cuisine: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
}

export function useAdminRestaurantInfoEditViewModel(
  restaurantId: string | null,
  onNavigateBack: () => void
) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    cuisine: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    image: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
  });

  useEffect(() => {
    loadRestaurantInfo();
  }, [restaurantId]);

  const loadRestaurantInfo = async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getRestaurantInfo(restaurantId);

    if (result.success && result.info) {
      setFormData({
        name: result.info.name || '',
        description: result.info.description || '',
        cuisine: result.info.cuisine || '',
        location: result.info.location || '',
        address: result.info.address || '',
        phone: result.info.phone || '',
        email: result.info.email || '',
        image: result.info.image || '',
        facebook: result.info.facebook || '',
        instagram: result.info.instagram || '',
        twitter: result.info.twitter || '',
        tiktok: result.info.tiktok || '',
      });
    }
    setLoading(false);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'ID de restaurante no válido');
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del restaurante es obligatorio');
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = formData.image;

      // Si se seleccionó una nueva imagen, subirla
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadResult = await uploadRestaurantImage(blob, restaurantId);

        if (uploadResult.success && uploadResult.imageURL) {
          finalImageUrl = uploadResult.imageURL;
        }
      }

      // Guardar todos los datos
      const dataToSave = {
        ...formData,
        image: finalImageUrl,
      };

      const result = await updateRestaurantInfo(restaurantId, dataToSave);

      if (result.success) {
        Alert.alert('Éxito', 'Información actualizada correctamente', [
          { text: 'OK', onPress: onNavigateBack },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Error al guardar la información');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al guardar la información');
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    imageUri,
    updateField,
    pickImage,
    handleSave,
  } as const;
}