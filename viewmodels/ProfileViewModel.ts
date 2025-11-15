// viewmodels/ProfileViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { auth, getUserDishFavorites, removeDishFavorite } from '../lib/firebase';
import { ProfileService } from '../services/ProfileService';

export function useProfileViewModel() {
  const [activeTab, setActiveTab] = useState<'datos' | 'favoritos' | 'reservas' | 'pedidos'>('datos');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [dishFavorites, setDishFavorites] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Campos editables
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'favoritos') {
      loadFavorites();
      loadDishFavorites();
    } else if (activeTab === 'reservas') {
      loadReservations();
    } else if (activeTab === 'pedidos') {
      loadOrders();
    }
  }, [activeTab]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const result = await ProfileService.getUserProfile();
      
      if (result.success && result.data) {
        setUserProfile(result.data);
        setName(result.data.name);
        setLastName(result.data.lastName);
        setPhone(result.data.phone);
        setAddress(result.data.address);
      } else {
        Alert.alert('Error', result.error || 'Error al cargar perfil');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const result = await ProfileService.getFavorites();
      
      if (result.success && result.data) {
        setFavorites(result.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar favoritos');
    }
  };

  const loadDishFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const result = await getUserDishFavorites(user.uid);
      if (result.success && result.favorites) {
        setDishFavorites(result.favorites);
      }
    } catch (error: any) {
      console.error('Error al cargar favoritos de platos:', error);
    }
  };

  const loadReservations = async () => {
    try {
      const result = await ProfileService.getUserReservations();
      
      if (result.success && result.data) {
        setReservations(result.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar reservas');
    }
  };

  const loadOrders = async () => {
    try {
      const result = await ProfileService.getUserOrders();
      
      if (result.success && result.data) {
        setOrders(result.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar pedidos');
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setName(userProfile.name);
      setLastName(userProfile.lastName);
      setPhone(userProfile.phone);
      setAddress(userProfile.address);
    }
    setIsEditMode(!isEditMode);
  };

  const saveProfile = async () => {
    if (!name.trim() || !lastName.trim()) {
      Alert.alert('Error', 'El nombre y apellido son obligatorios');
      return;
    }

    try {
      const result = await ProfileService.updateProfile({
        name: name.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (result.success) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setIsEditMode(false);
        await loadUserProfile();
      } else {
        Alert.alert('Error', result.error || 'Error al actualizar perfil');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar perfil');
    }
  };

  const removeFavorite = async (restaurantId: string) => {
    try {
      const result = await ProfileService.removeFavorite(restaurantId);
      
      if (result.success) {
        setFavorites(favorites.filter(fav => fav.restaurantId !== restaurantId));
        Alert.alert('Éxito', 'Restaurante eliminado de favoritos');
      } else {
        Alert.alert('Error', result.error || 'Error al eliminar favorito');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al eliminar favorito');
    }
  };

  const removeDishFromFavorites = async (dishId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const result = await removeDishFavorite(user.uid, dishId);
      if (result.success) {
        setDishFavorites(dishFavorites.filter(fav => fav.dishId !== dishId));
        Alert.alert('Éxito', 'Plato eliminado de favoritos');
      } else {
        Alert.alert('Error', result.error || 'Error al eliminar favorito');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al eliminar favorito');
    }
  };

  const cancelReservation = async (reservationId: string, restaurantId: string) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que quieres cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await ProfileService.cancelReservation(reservationId, restaurantId);
              
              if (result.success) {
                Alert.alert('Éxito', 'Reserva cancelada correctamente');
                await loadReservations();
              } else {
                Alert.alert('Error', result.error || 'Error al cancelar reserva');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al cancelar reserva');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await ProfileService.signOut();
              if (!result.success) {
                Alert.alert('Error', result.error || 'Error al cerrar sesión');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month}, ${year}`;
  };

  return {
    activeTab,
    setActiveTab,
    userProfile,
    favorites,
    dishFavorites,
    reservations,
    orders,
    isLoading,
    isEditMode,
    name,
    setName,
    lastName,
    setLastName,
    phone,
    setPhone,
    address,
    setAddress,
    toggleEditMode,
    saveProfile,
    removeFavorite,
    removeDishFromFavorites,
    cancelReservation,
    handleSignOut,
    formatDate,
    loadUserProfile,
    loadFavorites,
    loadDishFavorites,
    loadReservations,
    loadOrders,
  } as const;
}