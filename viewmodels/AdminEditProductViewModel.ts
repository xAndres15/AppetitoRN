// viewmodels/AdminEditProductViewModel.ts
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { deleteProduct, Product, updateProduct, uploadProductImage } from '../lib/firebase';

export function useAdminEditProductViewModel(
  restaurantId: string | null,
  product: Product,
  onNavigateBack: () => void
) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setProductName = (name: string) => {
    setEditedProduct({ ...editedProduct, name });
  };

  const setProductPrice = (priceText: string) => {
    const price = parseFloat(priceText) || 0;
    setEditedProduct({ ...editedProduct, price });
  };

  const setProductDescription = (description: string) => {
    setEditedProduct({ ...editedProduct, description });
  };

  const setProductCategory = (category: string) => {
    setEditedProduct({ ...editedProduct, category });
  };

  const setProductAvailable = (available: boolean) => {
    setEditedProduct({ ...editedProduct, available });
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
      Alert.alert('Error', 'No se encontró el restaurante');
      return;
    }

    if (!editedProduct.name.trim()) {
      Alert.alert('Error', 'El nombre del producto es requerido');
      return;
    }

    if (!editedProduct.price || editedProduct.price <= 0) {
      Alert.alert('Error', 'El precio del producto debe ser mayor a 0');
      return;
    }

    if (!editedProduct.category.trim()) {
      Alert.alert('Error', 'La categoría del producto es requerida');
      return;
    }

    if (!editedProduct.id) {
      Alert.alert('Error', 'ID de producto no válido');
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = editedProduct.image;

      // Si se seleccionó una nueva imagen, subirla
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadResult = await uploadProductImage(blob, editedProduct.id);

        if (uploadResult.success && uploadResult.imageURL) {
          finalImageUrl = uploadResult.imageURL;
        } else {
          Alert.alert('Advertencia', 'No se pudo actualizar la imagen, pero el producto se guardará');
        }
      }

      const result = await updateProduct(editedProduct.id, restaurantId, {
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
        category: editedProduct.category,
        image: finalImageUrl,
        available: editedProduct.available,
      });

      if (result.success) {
        Alert.alert('Éxito', 'Producto actualizado exitosamente', [
          { text: 'OK', onPress: onNavigateBack },
        ]);
      } else {
        Alert.alert('Error', 'Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!restaurantId) {
      Alert.alert('Error', 'No se encontró el restaurante');
      return;
    }

    if (!editedProduct.id) {
      Alert.alert('Error', 'ID de producto no válido');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            const result = await deleteProduct(editedProduct.id!, restaurantId);
            setSaving(false);

            if (result.success) {
              Alert.alert('Éxito', 'Producto eliminado exitosamente', [
                { text: 'OK', onPress: onNavigateBack },
              ]);
            } else {
              Alert.alert('Error', 'Error al eliminar el producto');
            }
          },
        },
      ]
    );
  };

  return {
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
  } as const;
}