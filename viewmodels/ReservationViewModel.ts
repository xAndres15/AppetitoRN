// viewmodels/ReservationViewModel.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Restaurant } from '../models/Reservation';
import { ReservationService } from '../services/ReservationService';

export function useReservationViewModel() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'China', 'Mexicana', 'Perro', 'Pizza'];

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCategory, restaurants]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const result = await ReservationService.getRestaurants();
      
      if (result.success && result.data) {
        setRestaurants(result.data);
        setFilteredRestaurants(result.data);
      } else {
        Alert.alert('Error', result.error || 'Error al cargar restaurantes');
      }
    } catch (error: any) {
      console.error('Error loading restaurants:', error);
      Alert.alert('Error', error.message || 'Error al cargar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.cuisine?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          restaurant.description?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  };

  return {
    restaurants: filteredRestaurants,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    loadRestaurants,
  } as const;
}