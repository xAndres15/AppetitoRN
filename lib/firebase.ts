// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { child, get, getDatabase, push, ref, remove, set, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA_6S4H6na3hxR-5x85E4Zg8q6Wkhbzm6o",
  authDomain: "appetito-project.firebaseapp.com",
  projectId: "appetito-project",
  storageBucket: "appetito-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef12345",
  databaseURL: "https://appetito-project-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

// ============================================
// INTERFACES
// ============================================

// ✅ Interface genérica para resultados
export interface FirebaseResult<T = void> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  restaurantId: string;
  createdAt: number;
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
  originalPrice?: number;
  discountedPrice?: number;
  rating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Restaurant {
  id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  adminId: string;
  createdAt: number;
  rating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface RestaurantInfo {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  image?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  cuisine?: string;
  isOpen?: boolean;
  schedule?: {
    day: string;
    hours: string;
    isOpen: boolean;
  }[];
  rating?: number;
  reviews?: number;
  totalReviews?: number;
  priceRange?: string;
  amenities?: string[];
  paymentMethods?: string[];
  facebook?: string; 
  instagram?: string; 
  twitter?: string; 
  tiktok?: string; 
  notificationSettings?: {
    newOrders: boolean;
    newReservations: boolean;
    reservationReminders: boolean;
    notificationSound: string;  
  };
  paymentMethodsConfig?: {
    cash: boolean;
    creditCard: boolean;
    debitCard: boolean;
  };
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Order {
  id?: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  tip?: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  deliveryTime?: string;
  notes?: string;
  restaurantId: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Reservation {
  id?: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  date: string;
  time: string;
  numberOfPeople: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  restaurantId: string;
  restaurantName?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  restaurantId: string;
  quantity: number;
  addedAt: number;
  hasPromotion?: boolean;
  promotionDiscount?: string;
  promotionTitle?: string;
  originalPrice?: number;
  discountedPrice?: number;
}

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export interface Promotion {
  id?: string;
  restaurantId: string;
  productId: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  active: boolean;
  minOrder?: number;
  deliveryTime?: string;
  productIds?: string[];
  createdAt: number;
  expiresAt?: number;
}

export interface ProductReview {
  id?: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  orderId: string;
  restaurantId: string;
  createdAt: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

export async function loginUser(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: cred.user };
  } catch (error: any) {
    return { success: false, error: error.code || error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.code || error.message };
  }
}

export async function registerUser(
  email: string,
  password: string,
  userData?: {
    name?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  }
) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await set(ref(database, 'users/' + uid), {
      email,
      name: userData?.name ?? '',
      lastName: userData?.lastName ?? '',
      phone: userData?.phone ?? '',
      address: userData?.address ?? '',
      role: 'user',
      photoURL: '',
      createdAt: Date.now(),
    });

    return { success: true, user: cred.user };
  } catch (error: any) {
    return { success: false, error: error.code || error.message };
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserRole = async (uid: string): Promise<{
  success: boolean;
  role?: 'user' | 'admin';
  restaurantId?: string;
  error?: string;
}> => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${uid}`));
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        success: true,
        role: userData.role || 'user',
        restaurantId: userData.restaurantId
      };
    }
    
    return { 
      success: false, 
      error: 'Usuario no encontrado' 
    };
  } catch (error: any) {
    console.error('Error al obtener rol del usuario:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const getUserData = async (uid: string) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${uid}`));
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    return { success: false, error: 'Usuario no encontrado' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA PERFIL
// ============================================

export async function updateUserProfile(
  userId: string,
  profileData: {
    name: string;
    lastName: string;
    phone: string;
    address: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await update(ref(database, `users/${userId}`), {
      name: profileData.name,
      lastName: profileData.lastName,
      phone: profileData.phone,
      address: profileData.address,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar perfil' };
  }
}

// ============================================
// FUNCIONES PARA FAVORITOS
// ============================================

export async function addFavorite(
  userId: string,
  restaurantData: {
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    restaurantCategory: string;
    restaurantRating?: number;
    restaurantReviews?: number;
    restaurantDistance?: string;
    restaurantDeliveryTime?: string;
    firebaseId?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await set(ref(database, `users/${userId}/favorites/${restaurantData.restaurantId}`), {
      ...restaurantData,
      userId,
      createdAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeFavorite(
  userId: string,
  restaurantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await remove(ref(database, `users/${userId}/favorites/${restaurantId}`));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserFavorites(
  userId: string
): Promise<{ success: boolean; favorites?: any[]; error?: string }> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/favorites`));

    if (snapshot.exists()) {
      const favoritesData = snapshot.val();
      const favorites = Object.keys(favoritesData).map((key) => ({
        id: key,
        ...favoritesData[key],
      }));
      return { success: true, favorites };
    }
    return { success: true, favorites: [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function isFavorite(
  userId: string,
  restaurantId: string
): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/favorites/${restaurantId}`));
    return { success: true, isFavorite: snapshot.exists() };
  } catch (error: any) {
    return { success: false, isFavorite: false };
  }
}

// ============================================
// FAVORITOS DE PLATOS
// ============================================

export async function addDishFavorite(
  userId: string,
  dishData: {
    dishId: string;
    dishName: string;
    dishImage: string;
    dishCategory: string;
    dishPrice: number;
    restaurantId: string;
    restaurantName: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await set(ref(database, `users/${userId}/dishFavorites/${dishData.dishId}`), {
      ...dishData,
      userId,
      createdAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeDishFavorite(
  userId: string,
  dishId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await remove(ref(database, `users/${userId}/dishFavorites/${dishId}`));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserDishFavorites(
  userId: string
): Promise<{ success: boolean; favorites?: any[]; error?: string }> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/dishFavorites`));

    if (snapshot.exists()) {
      const favoritesData = snapshot.val();
      const favorites = Object.keys(favoritesData).map((key) => ({
        id: key,
        ...favoritesData[key],
      }));
      return { success: true, favorites };
    }
    return { success: true, favorites: [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function isDishFavorite(
  userId: string,
  dishId: string
): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/dishFavorites/${dishId}`));
    return { success: true, isFavorite: snapshot.exists() };
  } catch (error: any) {
    return { success: false, isFavorite: false };
  }
}

// ============================================
// ALIAS PARA COMPATIBILIDAD
// ============================================
export const signInUser = loginUser;
export const signUpUser = registerUser;
export const signOutUser = logoutUser;

// ============================================
// FUNCIONES PARA RESTAURANTES
// ============================================

export const getAllRestaurants = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'restaurants'));
    
    if (snapshot.exists()) {
      const restaurants: Restaurant[] = [];
      snapshot.forEach((childSnapshot) => {
        restaurants.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return { success: true, restaurants };
    }
    return { success: true, restaurants: [] };
  } catch (error: any) {
    console.error('Error getting restaurants:', error);
    return { success: false, error: error.message };
  }
};

export const createRestaurant = async (restaurantData: Omit<Restaurant, 'id' | 'createdAt'>, adminId: string) => {
  try {
    const restaurantsRef = ref(database, 'restaurants');
    const newRestaurantRef = push(restaurantsRef);
    const restaurantId = newRestaurantRef.key;
    
    const restaurant: Restaurant = {
      ...restaurantData,
      id: restaurantId!,
      adminId: adminId,
      createdAt: Date.now()
    };
    
    await set(newRestaurantRef, restaurant);
    
    await update(ref(database), {
      [`users/${adminId}/restaurantId`]: restaurantId
    });
    
    return { success: true, restaurantId, restaurant };
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    return { success: false, error: error.message };
  }
};

export const getRestaurantInfo = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}`));
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return { success: true, info: data };
      }
    }
    
    const restaurantsResult = await getAllRestaurants();
    if (restaurantsResult.success && restaurantsResult.restaurants && restaurantsResult.restaurants.length > 0) {
      return { success: true, info: restaurantsResult.restaurants[0] };
    }
    
    return { success: false, error: 'Restaurante no encontrado' };
  } catch (error: any) {
    console.error('Error getting restaurant info:', error);
    return { success: false, error: error.message };
  }
};

export const updateRestaurantInfo = async (restaurantId: string, info: Partial<RestaurantInfo>) => {
  try {
    const restaurantUpdates: any = {};
    Object.keys(info).forEach(key => {
      restaurantUpdates[`restaurants/${restaurantId}/${key}`] = (info as any)[key];
    });
    
    await update(ref(database), restaurantUpdates);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating restaurant info:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA PRODUCTOS
// ============================================

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>, restaurantId: string) => {
  try {
    const productsRef = ref(database, `restaurants/${restaurantId}/products`);
    const newProductRef = push(productsRef);
    const productId = newProductRef.key;
    
    const product: Product = {
      ...productData,
      id: productId!,
      restaurantId: restaurantId,
      createdAt: Date.now()
    };
    
    await set(newProductRef, product);
    return { success: true, productId, product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
};

export const getProducts = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/products`));
      
      if (snapshot.exists()) {
        const products: Product[] = [];
        snapshot.forEach((childSnapshot) => {
          products.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        return { success: true, products };
      }
      return { success: true, products: [] };
    } else {
      const restaurantsResult = await getAllRestaurants();
      if (!restaurantsResult.success || !restaurantsResult.restaurants) {
        return { success: true, products: [] };
      }
      
      const allProducts: Product[] = [];
      for (const restaurant of restaurantsResult.restaurants) {
        const result = await getProducts(restaurant.id!);
        if (result.success && result.products) {
          allProducts.push(...result.products);
        }
      }
      
      return { success: true, products: allProducts };
    }
  } catch (error: any) {
    console.error('Error getting products:', error);
    return { success: false, error: error.message };
  }
};

export const getAvailableProducts = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/products`));
      
      if (snapshot.exists()) {
        const products: Product[] = [];
        snapshot.forEach((childSnapshot) => {
          const product = childSnapshot.val();
          if (product.available) {
            products.push({
              id: childSnapshot.key,
              ...product
            });
          }
        });
        return { success: true, products };
      }
      return { success: true, products: [] };
    } else {
      const restaurantsResult = await getAllRestaurants();
      if (!restaurantsResult.success || !restaurantsResult.restaurants) {
        return { success: true, products: [] };
      }
      
      const allProducts: Product[] = [];
      for (const restaurant of restaurantsResult.restaurants) {
        const result = await getAvailableProducts(restaurant.id!);
        if (result.success && result.products) {
          allProducts.push(...result.products);
        }
      }
      
      return { success: true, products: allProducts };
    }
  } catch (error: any) {
    console.error('Error getting available products:', error);
    return { success: false, error: error.message };
  }
};

export const getProductById = async (productId: string, restaurantId: string) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/products/${productId}`));
    if (snapshot.exists()) {
      return { 
        success: true, 
        product: {
          id: productId,
          restaurantId: restaurantId,
          ...snapshot.val()
        } 
      };
    }
    return { success: false, error: 'Producto no encontrado' };
  } catch (error: any) {
    console.error('Error getting product:', error);
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (productId: string, restaurantId: string, updates: Partial<Product>) => {
  try {
    const productUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'restaurantId') {
        productUpdates[`restaurants/${restaurantId}/products/${productId}/${key}`] = (updates as any)[key];
      }
    });
    
    await update(ref(database), productUpdates);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (productId: string, restaurantId: string) => {
  try {
    await remove(ref(database, `restaurants/${restaurantId}/products/${productId}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA ÓRDENES
// ============================================

export async function createOrder(orderData: {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  total: number;
  deliveryAddress: string;
  deliveryTime?: string;
  paymentMethod: string;
  status: string;
  notes?: string;
  userName: string;
  userPhone: string;
}, restaurantId: string): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);

    const orderToSave = {
      ...orderData,
      id: newOrderRef.key,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(newOrderRef, orderToSave);

    const restaurantOrderRef = ref(
      database,
      `restaurants/${orderData.restaurantId}/orders/${newOrderRef.key}`
    );
    await set(restaurantOrderRef, orderToSave);

    return { success: true, orderId: newOrderRef.key || undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al crear pedido',
    };
  }
}

export const getAllOrders = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/orders`));
      
      if (snapshot.exists()) {
        const orders: Order[] = [];
        snapshot.forEach((childSnapshot) => {
          orders.push(childSnapshot.val());
        });
        orders.sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, orders };
      }
      return { success: true, orders: [] };
    } else {
      const restaurantsResult = await getAllRestaurants();
      if (!restaurantsResult.success || !restaurantsResult.restaurants) {
        return { success: true, orders: [] };
      }
      
      const allOrders: Order[] = [];
      for (const restaurant of restaurantsResult.restaurants) {
        const result = await getAllOrders(restaurant.id!);
        if (result.success && result.orders) {
          allOrders.push(...result.orders);
        }
      }
      
      allOrders.sort((a, b) => b.createdAt - a.createdAt);
      return { success: true, orders: allOrders };
    }
  } catch (error: any) {
    console.error('Error getting orders:', error);
    return { success: false, error: error.message };
  }
};

export async function getUserOrders(
  userId: string
): Promise<{ success: boolean; orders?: any[]; error?: string }> {
  try {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);

    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const orders = Object.keys(ordersData)
        .map((key) => ({
          id: key,
          ...ordersData[key],
        }))
        .filter((order) => order.userId === userId);

      orders.sort((a, b) => b.createdAt - a.createdAt);
      return { success: true, orders };
    }

    return { success: true, orders: [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateOrderStatus = async (orderId: string, restaurantId: string, status: Order['status']) => {
  try {
    await update(ref(database), {
      [`restaurants/${restaurantId}/orders/${orderId}/status`]: status,
      [`restaurants/${restaurantId}/orders/${orderId}/updatedAt`]: Date.now(),
      [`orders/${orderId}/status`]: status,
      [`orders/${orderId}/updatedAt`]: Date.now()
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA RESERVACIONES
// ============================================

export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>, restaurantId: string) => {
  try {
    const reservationsMainRef = ref(database, 'reservations');
    const newReservationMainRef = push(reservationsMainRef);
    const reservationId = newReservationMainRef.key;
    
    const reservation: Reservation = {
      ...reservationData,
      id: reservationId!,
      restaurantId: restaurantId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newReservationMainRef, reservation);
    
    const restaurantReservationRef = ref(database, `restaurants/${restaurantId}/reservations/${reservationId}`);
    await set(restaurantReservationRef, reservation);
    
    return { success: true, reservationId, reservation };
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error.message };
  }
};

export const getAllReservations = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/reservations`));
      
      if (snapshot.exists()) {
        const reservations: Reservation[] = [];
        snapshot.forEach((childSnapshot) => {
          reservations.push(childSnapshot.val());
        });
        reservations.sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, reservations };
      }
      return { success: true, reservations: [] };
    } else {
      const restaurantsResult = await getAllRestaurants();
      if (!restaurantsResult.success || !restaurantsResult.restaurants) {
        return { success: true, reservations: [] };
      }
      
      const allReservations: Reservation[] = [];
      for (const restaurant of restaurantsResult.restaurants) {
        const result = await getAllReservations(restaurant.id!);
        if (result.success && result.reservations) {
          allReservations.push(...result.reservations);
        }
      }
      
      allReservations.sort((a, b) => b.createdAt - a.createdAt);
      return { success: true, reservations: allReservations };
    }
  } catch (error: any) {
    console.error('Error getting reservations:', error);
    return { success: false, error: error.message };
  }
};

export async function getUserReservations(
  userId: string
): Promise<{ success: boolean; reservations?: any[]; error?: string }> {
  try {
    const reservationsRef = ref(database, 'reservations');
    const snapshot = await get(reservationsRef);

    if (snapshot.exists()) {
      const reservationsData = snapshot.val();
      const reservations = Object.keys(reservationsData)
        .map((key) => ({
          id: key,
          ...reservationsData[key],
        }))
        .filter((reservation) => reservation.userId === userId);

      reservations.sort((a, b) => b.createdAt - a.createdAt);
      return { success: true, reservations };
    }

    return { success: true, reservations: [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateReservationStatus = async (reservationId: string, restaurantId: string, status: Reservation['status']) => {
  try {
    await update(ref(database), {
      [`restaurants/${restaurantId}/reservations/${reservationId}/status`]: status,
      [`restaurants/${restaurantId}/reservations/${reservationId}/updatedAt`]: Date.now()
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error updating reservation status:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA CARRITO
// ============================================

export const addToCart = async (
  userId: string, 
  productId: string, 
  restaurantId: string, 
  quantity: number = 1,
  promotionData?: {
    hasPromotion: boolean;
    promotionDiscount: string;
    promotionTitle: string;
    originalPrice: number;
    discountedPrice: number;
  }
) => {
  try {
    const productResult = await getProductById(productId, restaurantId);
    if (!productResult.success) {
      return { success: false, error: 'Producto no encontrado' };
    }

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `cart/${userId}/${productId}`));
    
    if (snapshot.exists()) {
      const currentQuantity = snapshot.val().quantity;
      await update(ref(database), {
        [`cart/${userId}/${productId}/quantity`]: currentQuantity + quantity
      });
    } else {
      const cartItem: CartItem = {
        productId,
        restaurantId,
        quantity,
        addedAt: Date.now(),
        ...(promotionData && {
          hasPromotion: promotionData.hasPromotion,
          promotionDiscount: promotionData.promotionDiscount,
          promotionTitle: promotionData.promotionTitle,
          originalPrice: promotionData.originalPrice,
          discountedPrice: promotionData.discountedPrice,
        })
      };
      
      await set(ref(database, `cart/${userId}/${productId}`), cartItem);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
};

export const getCart = async (userId: string) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `cart/${userId}`));
    
    if (snapshot.exists()) {
      const cartItems: CartItem[] = [];
      snapshot.forEach((childSnapshot) => {
        cartItems.push(childSnapshot.val());
      });
      return { success: true, cartItems };
    }
    return { success: true, cartItems: [] };
  } catch (error: any) {
    console.error('Error getting cart:', error);
    return { success: false, error: error.message };
  }
};

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
  try {
    if (quantity <= 0) {
      return await removeFromCart(userId, productId);
    }
    
    await update(ref(database), {
      [`cart/${userId}/${productId}/quantity`]: quantity
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return { success: false, error: error.message };
  }
};

export const removeFromCart = async (userId: string, productId: string) => {
  try {
    await remove(ref(database, `cart/${userId}/${productId}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
};

export const clearCart = async (userId: string) => {
  try {
    await remove(ref(database, `cart/${userId}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
};

export const getCartItems = async (userId: string) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `cart/${userId}`));
    
    if (snapshot.exists()) {
      const cartItems: CartItemWithProduct[] = [];
      
      const promises: Promise<void>[] = [];
      snapshot.forEach((childSnapshot) => {
        const cartItem = childSnapshot.val() as CartItem;
        const promise = getProductById(cartItem.productId, cartItem.restaurantId).then((productResult) => {
          if (productResult.success && productResult.product) {
            cartItems.push({
              ...cartItem,
              product: productResult.product
            });
          }
        });
        promises.push(promise);
      });
      
      await Promise.all(promises);
      return { success: true, items: cartItems };
    }
    
    return { success: true, items: [] };
  } catch (error: any) {
    console.error('Error getting cart items:', error);
    return { success: false, error: error.message, items: [] };
  }
};

// ============================================
// FUNCIONES ADMIN
// ============================================

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
  restaurantId: string;
  name?: string;
}

export async function isUserAdmin(userId: string): Promise<{
  success: boolean;
  isAdmin: boolean;
  restaurantId?: string;
  error?: string;
}> {
  try {
    const adminRef = ref(database, `admins/${userId}`);
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
      const adminData = snapshot.val();
      return {
        success: true,
        isAdmin: true,
        restaurantId: adminData.restaurantId,
      };
    }

    return {
      success: true,
      isAdmin: false,
    };
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return {
      success: false,
      isAdmin: false,
      error: error.message,
    };
  }
}

export async function getAdminData(userId: string): Promise<{
  success: boolean;
  data?: AdminUser;
  error?: string;
}> {
  try {
    const adminRef = ref(database, `admins/${userId}`);
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
      return {
        success: true,
        data: {
          uid: userId,
          ...snapshot.val(),
        },
      };
    }

    return {
      success: false,
      error: 'Admin not found',
    };
  } catch (error: any) {
    console.error('Error getting admin data:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// FUNCIONES PARA SUBIR IMÁGENES (BASE64)
// ============================================

export const uploadProductImage = async (file: Blob, productId: string) => {
  try {
    console.log('📸 Convirtiendo imagen a base64...');
    
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    const imageURL = await base64Promise;
    console.log('✅ Imagen convertida a base64, longitud:', imageURL.length);
    
    return { success: true, imageURL };
  } catch (error: any) {
    console.error('❌ Error converting product image to base64:', error);
    return { success: false, error: error.message };
  }
};

export const uploadRestaurantImage = async (file: Blob, restaurantId: string) => {
  try {
    console.log('📸 Convirtiendo imagen de restaurante a base64...');
    
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    const imageURL = await base64Promise;
    console.log('✅ Imagen de restaurante convertida a base64, longitud:', imageURL.length);
    
    return { success: true, imageURL };
  } catch (error: any) {
    console.error('❌ Error converting restaurant image to base64:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA PROMOCIONES
// ============================================

export const createPromotion = async (
  promotionData: Omit<Promotion, 'id' | 'createdAt'>,
  restaurantId: string
) => {
  try {
    const promotionsRef = ref(database, `restaurants/${restaurantId}/promotions`);
    const newPromotionRef = push(promotionsRef);
    const promotionId = newPromotionRef.key;

    const promotion: Promotion = {
      ...promotionData,
      id: promotionId!,
      restaurantId: restaurantId,
      createdAt: Date.now(),
    };

    await set(newPromotionRef, promotion);
    return { success: true, promotionId, promotion };
  } catch (error: any) {
    console.error('Error creating promotion:', error);
    return { success: false, error: error.message };
  }
};

export const getPromotions = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(
        child(dbRef, `restaurants/${restaurantId}/promotions`)
      );

      if (snapshot.exists()) {
        const promotions: Promotion[] = [];
        snapshot.forEach((childSnapshot) => {
          promotions.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        promotions.sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, promotions };
      }
      return { success: true, promotions: [] };
    } else {
      const restaurantsResult = await getAllRestaurants();
      if (!restaurantsResult.success || !restaurantsResult.restaurants) {
        return { success: true, promotions: [] };
      }

      const allPromotions: Promotion[] = [];
      for (const restaurant of restaurantsResult.restaurants) {
        const result = await getPromotions(restaurant.id!);
        if (result.success && result.promotions) {
          allPromotions.push(...result.promotions);
        }
      }

      allPromotions.sort((a, b) => b.createdAt - a.createdAt);
      return { success: true, promotions: allPromotions };
    }
  } catch (error: any) {
    console.error('Error getting promotions:', error);
    return { success: false, error: error.message };
  }
};

export const getActivePromotions = async (restaurantId?: string) => {
  try {
    const result = await getPromotions(restaurantId);
    if (result.success && result.promotions) {
      const now = Date.now();
      const activePromotions = result.promotions.filter(
        (promo) =>
          promo.active && (!promo.expiresAt || promo.expiresAt > now)
      );
      return { success: true, promotions: activePromotions };
    }
    return result;
  } catch (error: any) {
    console.error('Error getting active promotions:', error);
    return { success: false, error: error.message };
  }
};

export const getPromotionById = async (
  promotionId: string,
  restaurantId: string
) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(
      child(dbRef, `restaurants/${restaurantId}/promotions/${promotionId}`)
    );

    if (snapshot.exists()) {
      return {
        success: true,
        promotion: {
          id: promotionId,
          ...snapshot.val(),
        },
      };
    }

    return { success: false, error: 'Promoción no encontrada' };
  } catch (error: any) {
    console.error('Error getting promotion:', error);
    return { success: false, error: error.message };
  }
};

export const updatePromotion = async (
  promotionId: string,
  restaurantId: string,
  updates: Partial<Promotion>
) => {
  try {
    const promotionUpdates: any = {};
    Object.keys(updates).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'restaurantId') {
        promotionUpdates[
          `restaurants/${restaurantId}/promotions/${promotionId}/${key}`
        ] = (updates as any)[key];
      }
    });

    await update(ref(database), promotionUpdates);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating promotion:', error);
    return { success: false, error: error.message };
  }
};

export const deletePromotion = async (
  promotionId: string,
  restaurantId: string
) => {
  try {
    await remove(
      ref(database, `restaurants/${restaurantId}/promotions/${promotionId}`)
    );
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting promotion:', error);
    return { success: false, error: error.message };
  }
};

export const uploadPromotionImage = async (file: Blob, promotionId: string) => {
  try {
    console.log('📸 Convirtiendo imagen de promoción a base64...');

    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const imageURL = await base64Promise;
    console.log('✅ Imagen de promoción convertida a base64, longitud:', imageURL.length);

    return { success: true, imageURL };
  } catch (error: any) {
    console.error('❌ Error converting promotion image to base64:', error);
    return { success: false, error: error.message };
  }
};

export const getProductPromotions = async (
  productId: string,
  restaurantId: string
) => {
  try {
    const result = await getActivePromotions(restaurantId);
    if (result.success && result.promotions) {
      const productPromotions = result.promotions.filter(
        (promo) =>
          !promo.productIds ||
          promo.productIds.length === 0 ||
          promo.productIds.includes(productId)
      );
      return { success: true, promotions: productPromotions };
    }
    return result;
  } catch (error: any) {
    console.error('Error getting product promotions:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FUNCIONES PARA REVIEWS DE PRODUCTOS
// ============================================

export async function createProductReview(
  review: ProductReview
): Promise<FirebaseResult<{ reviewId: string }>> {
  try {
    console.log('🔵 [CREATE REVIEW] ========== INICIO ==========');
    console.log('🔵 [CREATE REVIEW] Datos recibidos:', {
      productId: review.productId,
      productName: review.productName,
      restaurantId: review.restaurantId,
      userId: review.userId,
      orderId: review.orderId,
      rating: review.rating,
      hasComment: !!review.comment,
    });

    const hasReviewed = await hasUserReviewedOrder(review.userId, review.orderId);
    
    if (hasReviewed.success && hasReviewed.hasReviewed) {
      console.log('⚠️ [CREATE REVIEW] Usuario ya calificó este pedido');
      return {
        success: false,
        error: 'Ya has calificado este pedido',
      };
    }
    console.log('✅ [CREATE REVIEW] Usuario NO ha calificado este pedido antes');

    const reviewPath = `restaurants/${review.restaurantId}/products/${review.productId}/reviews`;
    console.log('🔵 [CREATE REVIEW] Ruta de Firebase:', reviewPath);
    
    const reviewsRef = ref(database, reviewPath);
    const newReviewRef = push(reviewsRef);
    const reviewId = newReviewRef.key!;

    console.log('🔵 [CREATE REVIEW] ID de review generado:', reviewId);

    const reviewData = {
      ...review,
      id: reviewId,
      createdAt: Date.now(),
    };

    console.log('🔵 [CREATE REVIEW] Guardando review en Firebase...');
    await set(newReviewRef, reviewData);
    console.log('✅ [CREATE REVIEW] Review guardada exitosamente');

    const reviewedOrderPath = `users/${review.userId}/reviewedOrders/${review.orderId}`;
    console.log('🔵 [CREATE REVIEW] Marcando pedido como calificado en:', reviewedOrderPath);
    const reviewedOrderRef = ref(database, reviewedOrderPath);
    await set(reviewedOrderRef, true);
    console.log('✅ [CREATE REVIEW] Pedido marcado como calificado');

    console.log('🔵 [CREATE REVIEW] Actualizando estadísticas del producto...');
    const statsResult = await updateProductRatingStats(review.productId, review.restaurantId);
    
    if (statsResult.success) {
      console.log('✅ [CREATE REVIEW] Estadísticas actualizadas exitosamente');
    } else {
      console.error('❌ [CREATE REVIEW] Error al actualizar estadísticas:', statsResult.error);
    }

    console.log('🔵 [CREATE REVIEW] ========== FIN EXITOSO ==========');
    return {
      success: true,
      reviewId,
    };
  } catch (error: any) {
    console.error('❌ [CREATE REVIEW] ========== ERROR ==========');
    console.error('❌ [CREATE REVIEW] Error completo:', error);
    console.error('❌ [CREATE REVIEW] Stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Error al crear la reseña',
    };
  }
}

export async function updateProductRatingStats(
  productId: string,
  restaurantId: string
): Promise<FirebaseResult<void>> {
  try {
    console.log('🔵 [UPDATE STATS] ========== INICIO ==========');
    console.log('🔵 [UPDATE STATS] ProductId:', productId);
    console.log('🔵 [UPDATE STATS] RestaurantId:', restaurantId);

    const reviewsPath = `restaurants/${restaurantId}/products/${productId}/reviews`;
    console.log('🔵 [UPDATE STATS] Buscando reviews en:', reviewsPath);
    
    const reviewsRef = ref(database, reviewsPath);
    const snapshot = await get(reviewsRef);

    if (!snapshot.exists()) {
      console.log('⚠️ [UPDATE STATS] No hay reviews, estableciendo valores por defecto');
      const productPath = `restaurants/${restaurantId}/products/${productId}`;
      const productRef = ref(database, productPath);
      await update(productRef, {
        rating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      console.log('✅ [UPDATE STATS] Valores por defecto establecidos');
      return { success: true };
    }

    const reviews = snapshot.val();
    const reviewArray: ProductReview[] = Object.values(reviews);
    
    console.log('🔵 [UPDATE STATS] Reviews encontradas:', reviewArray.length);
    console.log('🔵 [UPDATE STATS] Ratings individuales:', reviewArray.map(r => r.rating));

    const totalReviews = reviewArray.length;
    const sumRatings = reviewArray.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewArray.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    console.log('🔵 [UPDATE STATS] Estadísticas calculadas:');
    console.log('  - Promedio:', averageRating.toFixed(2));
    console.log('  - Total reviews:', totalReviews);
    console.log('  - Distribución:', distribution);

    const productPath = `restaurants/${restaurantId}/products/${productId}`;
    console.log('🔵 [UPDATE STATS] Actualizando producto en:', productPath);
    
    const productRef = ref(database, productPath);
    const updateData = {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: totalReviews,
      ratingDistribution: distribution,
    };
    
    console.log('🔵 [UPDATE STATS] Datos a actualizar:', updateData);
    await update(productRef, updateData);
    console.log('✅ [UPDATE STATS] Producto actualizado exitosamente');
    console.log('🔵 [UPDATE STATS] ========== FIN EXITOSO ==========');

    return { success: true };
  } catch (error: any) {
    console.error('❌ [UPDATE STATS] ========== ERROR ==========');
    console.error('❌ [UPDATE STATS] Error completo:', error);
    console.error('❌ [UPDATE STATS] Stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Error al actualizar estadísticas',
    };
  }
}

export async function getProductReviews(
  productId: string,
  restaurantId: string
): Promise<FirebaseResult<{ reviews: ProductReview[] }>> {
  try {
    console.log('🔵 [GET REVIEWS] Obteniendo reviews para:', { productId, restaurantId });
    
    const reviewsRef = ref(
      database,
      `restaurants/${restaurantId}/products/${productId}/reviews`
    );
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      const reviews: ProductReview[] = [];
      snapshot.forEach((childSnapshot) => {
        reviews.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      reviews.sort((a, b) => b.createdAt - a.createdAt);
      console.log('✅ [GET REVIEWS] Reviews encontradas:', reviews.length);
      return { success: true, reviews };
    }

    console.log('⚠️ [GET REVIEWS] No se encontraron reviews');
    return { success: true, reviews: [] };
  } catch (error: any) {
    console.error('❌ [GET REVIEWS] Error:', error);
    return { success: false, error: error.message, reviews: [] };
  }
}

export async function hasUserReviewedOrder(
  userId: string,
  orderId: string
): Promise<FirebaseResult<{ hasReviewed: boolean }>> {
  try {
    const reviewRef = ref(database, `users/${userId}/reviewedOrders/${orderId}`);
    const snapshot = await get(reviewRef);

    return {
      success: true,
      hasReviewed: snapshot.exists(),
    };
  } catch (error: any) {
    console.error('❌ [HAS REVIEWED] Error:', error);
    return {
      success: false,
      hasReviewed: false,
      error: error.message,
    };
  }
}

export async function getProductRatingStats(
  productId: string,
  restaurantId: string
): Promise<FirebaseResult<{ stats: ReviewStats }>> {
  try {
    console.log('🔵 [GET STATS] Obteniendo stats para:', { productId, restaurantId });
    
    const productRef = ref(
      database,
      `restaurants/${restaurantId}/products/${productId}`
    );
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const productData = snapshot.val();
      const stats: ReviewStats = {
        averageRating: productData.rating || 0,
        totalReviews: productData.totalReviews || 0,
        ratingDistribution: productData.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };

      console.log('✅ [GET STATS] Stats encontradas:', stats);
      return { success: true, stats };
    }

    console.log('⚠️ [GET STATS] Producto no encontrado, retornando stats vacías');
    return {
      success: true,
      stats: {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  } catch (error: any) {
    console.error('❌ [GET STATS] Error:', error);
    return { 
      success: false, 
      error: error.message,
      stats: {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  }
}

// ==========================================
// RESTAURANT REVIEWS (BASADO EN RESERVAS)
// ==========================================

export interface RestaurantReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  reservationId: string;
  createdAt: number;
}

export interface RestaurantRatingStats {
  rating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Crear una review de restaurante
 */
export async function createRestaurantReview(
  review: Omit<RestaurantReview, 'id'>
): Promise<FirebaseResult<{ reviewId: string }>> {
  try {
    console.log('🔵 [CREATE RESTAURANT REVIEW] ========== INICIO ==========');
    console.log('🔵 [CREATE RESTAURANT REVIEW] Datos recibidos:', {
      restaurantId: review.restaurantId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      reservationId: review.reservationId,
    });

    // Verificar si el usuario ya calificó esta reserva
    const hasReviewed = await hasUserReviewedReservation(review.userId, review.reservationId);
    
    if (hasReviewed.success && hasReviewed.hasReviewed) {
      console.log('⚠️ [CREATE RESTAURANT REVIEW] Usuario ya calificó esta reserva');
      return {
        success: false,
        error: 'Ya has calificado este restaurante',
      };
    }

    // Crear la review
    const reviewPath = `restaurants/${review.restaurantId}/restaurantReviews`;
    console.log('🔵 [CREATE RESTAURANT REVIEW] Ruta de Firebase:', reviewPath);
    
    const reviewsRef = ref(database, reviewPath);
    const newReviewRef = push(reviewsRef);
    const reviewId = newReviewRef.key!;

    console.log('🔵 [CREATE RESTAURANT REVIEW] ID de review generado:', reviewId);

    const reviewData: RestaurantReview = {
      ...review,
      id: reviewId,
      createdAt: Date.now(),
    };

    await set(newReviewRef, reviewData);
    console.log('✅ [CREATE RESTAURANT REVIEW] Review guardada exitosamente');

    // Marcar reserva como calificada
    const reviewedReservationPath = `users/${review.userId}/reviewedReservations/${review.reservationId}`;
    console.log('🔵 [CREATE RESTAURANT REVIEW] Marcando reserva como calificada:', reviewedReservationPath);
    await set(ref(database, reviewedReservationPath), true);

    // Actualizar estadísticas del restaurante
    console.log('🔵 [CREATE RESTAURANT REVIEW] Actualizando estadísticas...');
    await updateRestaurantRatingStats(review.restaurantId);

    console.log('🔵 [CREATE RESTAURANT REVIEW] ========== FIN EXITOSO ==========');
    return {
      success: true,
      reviewId,
    };
  } catch (error: any) {
    console.error('❌ [CREATE RESTAURANT REVIEW] ========== ERROR ==========');
    console.error('❌ [CREATE RESTAURANT REVIEW] Error completo:', error);
    return {
      success: false,
      error: error.message || 'Error al crear la reseña',
    };
  }
}

/**
 * Actualizar estadísticas de rating del restaurante
 */
async function updateRestaurantRatingStats(restaurantId: string): Promise<void> {
  try {
    console.log('🔵 [UPDATE RESTAURANT STATS] ========== INICIO ==========');
    console.log('🔵 [UPDATE RESTAURANT STATS] RestaurantId:', restaurantId);

    const reviewsPath = `restaurants/${restaurantId}/restaurantReviews`;
    const reviewsRef = ref(database, reviewsPath);
    const snapshot = await get(reviewsRef);

    if (!snapshot.exists()) {
      console.log('⚠️ [UPDATE RESTAURANT STATS] No hay reviews, estableciendo valores por defecto');
      const restaurantRef = ref(database, `restaurants/${restaurantId}`);
      await update(restaurantRef, {
        rating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      return;
    }

    const reviews = snapshot.val();
    const reviewArray: RestaurantReview[] = Object.values(reviews);
    
    console.log('🔵 [UPDATE RESTAURANT STATS] Reviews encontradas:', reviewArray.length);

    // Calcular estadísticas
    const totalReviews = reviewArray.length;
    const sumRatings = reviewArray.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;

    // Calcular distribución
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewArray.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    console.log('🔵 [UPDATE RESTAURANT STATS] Estadísticas calculadas:');
    console.log('  - Promedio:', averageRating.toFixed(2));
    console.log('  - Total reviews:', totalReviews);
    console.log('  - Distribución:', distribution);

    // Actualizar el restaurante
    const restaurantRef = ref(database, `restaurants/${restaurantId}`);
    await update(restaurantRef, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: totalReviews,
      ratingDistribution: distribution,
    });

    console.log('✅ [UPDATE RESTAURANT STATS] Restaurante actualizado exitosamente');
    console.log('🔵 [UPDATE RESTAURANT STATS] ========== FIN EXITOSO ==========');
  } catch (error: any) {
    console.error('❌ [UPDATE RESTAURANT STATS] Error:', error);
  }
}

/**
 * Obtener reviews de un restaurante
 */
export async function getRestaurantReviews(
  restaurantId: string
): Promise<FirebaseResult<{ reviews: RestaurantReview[] }>> {
  try {
    console.log('🔵 [GET RESTAURANT REVIEWS] Obteniendo reviews de:', restaurantId);
    
    const reviewsRef = ref(database, `restaurants/${restaurantId}/restaurantReviews`);
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      const reviews: RestaurantReview[] = [];
      snapshot.forEach((childSnapshot) => {
        reviews.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      reviews.sort((a, b) => b.createdAt - a.createdAt);
      console.log('✅ [GET RESTAURANT REVIEWS] Reviews encontradas:', reviews.length);
      return { success: true, reviews };
    }

    console.log('⚠️ [GET RESTAURANT REVIEWS] No se encontraron reviews');
    return { success: true, reviews: [] };
  } catch (error: any) {
    console.error('❌ [GET RESTAURANT REVIEWS] Error:', error);
    return { success: false, error: error.message, reviews: [] };
  }
}

/**
 * Verificar si el usuario ya calificó una reserva
 */
export async function hasUserReviewedReservation(
  userId: string,
  reservationId: string
): Promise<FirebaseResult<{ hasReviewed: boolean }>> {
  try {
    const reviewRef = ref(database, `users/${userId}/reviewedReservations/${reservationId}`);
    const snapshot = await get(reviewRef);

    return {
      success: true,
      hasReviewed: snapshot.exists(),
    };
  } catch (error: any) {
    console.error('❌ [HAS USER REVIEWED RESERVATION] Error:', error);
    return {
      success: false,
      hasReviewed: false,
      error: error.message,
    };
  }
}

/**
 * Obtener estadísticas de rating de un restaurante
 */
export async function getRestaurantRatingStats(
  restaurantId: string
): Promise<FirebaseResult<{ stats: RestaurantRatingStats }>> {
  try {
    console.log('🔵 [GET RESTAURANT STATS] Obteniendo stats de:', restaurantId);
    
    const restaurantRef = ref(database, `restaurants/${restaurantId}`);
    const snapshot = await get(restaurantRef);

    if (snapshot.exists()) {
      const restaurantData = snapshot.val();
      const stats: RestaurantRatingStats = {
        rating: restaurantData.rating || 0,
        totalReviews: restaurantData.totalReviews || 0,
        ratingDistribution: restaurantData.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };

      console.log('✅ [GET RESTAURANT STATS] Stats encontradas:', stats);
      return { success: true, stats };
    }

    console.log('⚠️ [GET RESTAURANT STATS] Restaurante no encontrado');
    return {
      success: true,
      stats: {
        rating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  } catch (error: any) {
    console.error('❌ [GET RESTAURANT STATS] Error:', error);
    return {
      success: false,
      error: error.message,
      stats: {
        rating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  }
}