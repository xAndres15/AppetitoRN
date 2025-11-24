// viewmodels/AdminAddPromotionViewModel.ts
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Product, uploadPromotionImage } from '../lib/firebase';
import { AdminService } from '../services/AdminService';

export function useAdminAddPromotionViewModel(restaurantId: string, onSuccess: () => void) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [imageUri, setImageUri] = useState<string>('');
  const [minOrder, setMinOrder] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // NUEVO: Estado para productos
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [restaurantId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const result = await AdminService.getProducts(restaurantId);
    
    if (result.success && result.data) {
      setProducts(result.data);
    } else {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
    
    setLoadingProducts(false);
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
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!selectedProductId) {
      Alert.alert('Error', 'Debes seleccionar un producto');
      return;
    }

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

    setLoading(true);

    try {
      // Convertir imagen a base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageResult = await uploadPromotionImage(blob, Date.now().toString());

      if (!imageResult.success || !imageResult.imageURL) {
        Alert.alert('Error', 'No se pudo procesar la imagen');
        setLoading(false);
        return;
      }

      // Preparar datos de la promoción
      const promotionData = {
        restaurantId,
        productId: selectedProductId, // ← PRODUCTO SELECCIONADO
        title: title.trim(),
        description: description.trim(),
        discount: discount.trim(),
        image: imageResult.imageURL,
        active,
        ...(minOrder && { minOrder: parseFloat(minOrder) }),
        ...(deliveryTime && { deliveryTime: deliveryTime.trim() }),
        ...(expiresAt && { expiresAt: expiresAt.getTime() }),
      };

      // Crear promoción
      const result = await AdminService.createPromotion(restaurantId, promotionData);

      if (result.success) {
        Alert.alert('Éxito', 'Promoción creada exitosamente', [
          { text: 'OK', onPress: onSuccess },
        ]);
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear la promoción');
      }
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      Alert.alert('Error', 'Ocurrió un error al crear la promoción');
    }

    setLoading(false);
  };

  return {
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
    products,
    selectedProductId,
    setSelectedProductId,
    loadingProducts,
    pickImage,
    handleSubmit,
  } as const;
}