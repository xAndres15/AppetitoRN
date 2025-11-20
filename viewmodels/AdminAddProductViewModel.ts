// viewmodels/AdminAddProductViewModel.ts
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { createProduct, updateProduct, uploadProductImage } from '../lib/firebase';

export function useAdminAddProductViewModel(
  restaurantId: string | null,
  onNavigateBack: () => void
) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [customDiscount, setCustomDiscount] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tus fotos');
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
    }
  };

  const handleAddProduct = async () => {
    // Validaciones
    if (!restaurantId) {
      Alert.alert('Error', 'No se encontró el restaurante');
      return;
    }

    if (!productName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del producto');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un precio válido');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Error', 'Por favor ingresa la categoría del producto');
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Por favor selecciona una imagen para el producto');
      return;
    }

    setSaving(true);

    try {
      // Crear el producto primero para obtener el ID
      const productData = {
        name: productName.trim(),
        description: description.trim() || 'Sin descripción',
        price: parseFloat(price),
        category: category.trim(),
        image: 'https://via.placeholder.com/300', // Temporal
        available: true,
        restaurantId: restaurantId,
      };

      const result = await createProduct(productData, restaurantId);

      if (result.success && result.productId) {
        // Convertir URI a Blob para upload
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Subir imagen
        const uploadResult = await uploadProductImage(blob, result.productId);

        if (uploadResult.success && uploadResult.imageURL) {
          // Actualizar el producto con la URL real de la imagen
          await updateProduct(result.productId, restaurantId, {
            image: uploadResult.imageURL,
          });
        }

        Alert.alert('Éxito', 'Producto agregado exitosamente', [
          { text: 'OK', onPress: onNavigateBack },
        ]);
      } else {
        Alert.alert('Error', 'Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al agregar el producto');
    } finally {
      setSaving(false);
    }
  };

  return {
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
  } as const;
}