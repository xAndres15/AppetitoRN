// services/ProfileService.ts
import { router } from 'expo-router';
import { get, ref, remove, set, update } from 'firebase/database';
import { auth, database, getUserData, getUserOrders, getUserReservations, signOutUser, updateUserProfile } from '../lib/firebase';

export const ProfileService = {
  async getUserProfile() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await getUserData(user.uid);
      if (result.success && result.data) {
        return { 
          success: true, 
          data: {
            uid: user.uid,
            email: user.email || result.data.email || '',
            name: result.data.name || '',
            lastName: result.data.lastName || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            photoURL: user.photoURL || undefined,
          }
        };
      }

      return { success: false, error: 'No se pudo cargar el perfil' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar perfil' };
    }
  },

  async updateProfile(profileData: {
    name: string;
    lastName: string;
    phone: string;
    address: string;
  }) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await updateUserProfile(user.uid, profileData);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al actualizar perfil' };
    }
  },

  async signOut() {
    try {
      const result = await signOutUser();
      if (result.success) {
        router.replace('/login');
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cerrar sesión' };
    }
  },

  async getFavorites() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const favoritesRef = ref(database, `users/${user.uid}/favorites`);
      const snapshot = await get(favoritesRef);

      if (snapshot.exists()) {
        const favoritesData = snapshot.val();
        const favorites = Object.keys(favoritesData).map(key => ({
          id: key,
          ...favoritesData[key],
        }));
        return { success: true, data: favorites };
      }

      return { success: true, data: [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar favoritos' };
    }
  },

  async addFavorite(restaurantData: {
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    restaurantCategory: string;
    restaurantRating?: number;
    restaurantReviews?: number;
    restaurantDistance?: string;
    restaurantDeliveryTime?: string;
  }) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const favoriteRef = ref(database, `users/${user.uid}/favorites/${restaurantData.restaurantId}`);
      await set(favoriteRef, {
        ...restaurantData,
        userId: user.uid,
        createdAt: Date.now(),
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al agregar favorito' };
    }
  },

  async removeFavorite(restaurantId: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const favoriteRef = ref(database, `users/${user.uid}/favorites/${restaurantId}`);
      await remove(favoriteRef);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al eliminar favorito' };
    }
  },

  async isFavorite(restaurantId: string) {
    try {
      const user = auth.currentUser;
      if (!user) return { success: false, isFavorite: false };

      const favoriteRef = ref(database, `users/${user.uid}/favorites/${restaurantId}`);
      const snapshot = await get(favoriteRef);

      return { success: true, isFavorite: snapshot.exists() };
    } catch (error: any) {
      return { success: false, isFavorite: false };
    }
  },

  async getUserReservations() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Usar la función de firebase.ts que ya corregimos
      const result = await getUserReservations(user.uid);
      
      if (result.success && result.reservations) {
        return { success: true, data: result.reservations };
      }

      return { success: true, data: [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar reservas' };
    }
  },

async cancelReservation(reservationId: string, restaurantId: string) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Usar update con rutas completas (la forma correcta)
    await update(ref(database), {
      [`reservations/${reservationId}/status`]: 'cancelled',
      [`reservations/${reservationId}/updatedAt`]: Date.now(),
      [`restaurants/${restaurantId}/reservations/${reservationId}/status`]: 'cancelled',
      [`restaurants/${restaurantId}/reservations/${reservationId}/updatedAt`]: Date.now()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al cancelar reserva' };
  }
},

  async getUserOrders() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Usar la función de firebase.ts que ya corregimos
      const result = await getUserOrders(user.uid);
      
      if (result.success && result.orders) {
        return { success: true, data: result.orders };
      }

      return { success: true, data: [] };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar pedidos' };
    }
  },
};