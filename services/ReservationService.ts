// services/ReservationService.ts
import { auth, createReservation, getAllRestaurants, getUserData } from '../lib/firebase';
import { Restaurant } from '../models/Reservation';

export const ReservationService = {
  async getRestaurants(): Promise<{ success: boolean; data?: Restaurant[]; error?: string }> {
    try {
      const result = await getAllRestaurants();
      
      if (result.success && result.restaurants) {
        const mappedRestaurants: Restaurant[] = result.restaurants.map((restaurant: any, index: number) => ({
          id: restaurant.id || `restaurant-${index}`,
          firebaseId: restaurant.id,
          name: restaurant.name || 'Restaurante',
          description: restaurant.description || restaurant.cuisine || 'Restaurante',
          location: restaurant.location || restaurant.address || 'Ubicación',
          image: restaurant.image || 'https://via.placeholder.com/400x300',
          phone: restaurant.phone,
          schedule: restaurant.schedule,
          cuisine: restaurant.cuisine,
          address: restaurant.address || restaurant.location,
        }));
        
        return { success: true, data: mappedRestaurants };
      }
      
      return { success: false, error: 'No se pudieron cargar los restaurantes' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar restaurantes' };
    }
  },

  async getUserData() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await getUserData(user.uid);
      if (result.success && result.data) {
        return { success: true, data: result.data };
      }

      return { success: false, error: 'No se pudieron cargar los datos del usuario' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al cargar datos del usuario' };
    }
  },

  async createReservation(
    reservationData: any, 
    restaurantId: string
  ): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    try {
      const result = await createReservation(reservationData, restaurantId);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al crear la reserva' };
    }
  },
};