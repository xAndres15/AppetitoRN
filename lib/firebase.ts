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
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  logo?: string;
  coverImage?: string;
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
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  restaurantId: string;
  quantity: number;
  addedAt: number;
}

export interface CartItemWithProduct extends CartItem {
  product?: Product;
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

// Función para obtener el rol del usuario
export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${uid}`));
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.role || 'user';
    }
    return null;
  } catch (error: any) {
    console.error('Error al obtener rol del usuario:', error);
    return null;
  }
};

// Función para obtener datos del usuario
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
// 🆕 FUNCIONES NUEVAS PARA PERFIL
// ============================================

// Actualizar perfil de usuario
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
// 🆕 FUNCIONES PARA FAVORITOS
// ============================================

// Agregar restaurante a favoritos
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

// Remover restaurante de favoritos
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

// Obtener favoritos del usuario
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

// Verificar si un restaurante está en favoritos
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
// ==================== FAVORITOS DE PLATOS ====================

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
// 🆕 ALIAS PARA COMPATIBILIDAD CON NUEVO CÓDIGO
// ============================================
export const signInUser = loginUser;
export const signUpUser = registerUser;
export const signOutUser = logoutUser;

// ============================================
// FUNCIONES PARA RESTAURANTES
// ============================================

// Obtener todos los restaurantes
export const getAllRestaurants = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'restaurants'));
    
    if (snapshot.exists()) {
      const restaurants: Restaurant[] = [];
      snapshot.forEach((childSnapshot) => {
        restaurants.push({
          id: childSnapshot.key, // ← DEBE ESTAR ESTA LÍNEA
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

// Crear un nuevo restaurante
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
    
    // Asignar el restaurante al administrador
    await update(ref(database), {
      [`users/${adminId}/restaurantId`]: restaurantId
    });
    
    return { success: true, restaurantId, restaurant };
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    return { success: false, error: error.message };
  }
};

// Obtener información del restaurante
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
    
    // Si no hay ID, obtener el primer restaurante
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

// Actualizar información del restaurante
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

// Crear producto
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

// Obtener todos los productos de un restaurante o de todos
export const getProducts = async (restaurantId?: string) => {
  try {
    if (restaurantId) {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/products`));
      
      if (snapshot.exists()) {
        const products: Product[] = [];
        snapshot.forEach((childSnapshot) => {
          products.push({
            id: childSnapshot.key, // ← AGREGAR ESTO
            ...childSnapshot.val()
          });
        });
        return { success: true, products };
      }
      return { success: true, products: [] };
    } else {
      // Obtener productos de todos los restaurantes
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

// Obtener productos disponibles

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
              id: childSnapshot.key, // ← CRÍTICO: Incluir el ID
              ...product
            });
          }
        });
        return { success: true, products };
      }
      return { success: true, products: [] };
    } else {
      // Obtener productos de todos los restaurantes
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

// Obtener un producto por ID
export const getProductById = async (productId: string, restaurantId: string) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `restaurants/${restaurantId}/products/${productId}`));
    if (snapshot.exists()) {
      return { 
        success: true, 
        product: {
          id: productId, // ← AGREGAR ESTA LÍNEA (CRÍTICO)
          restaurantId: restaurantId, // ← AGREGAR ESTA LÍNEA
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

// Actualizar producto
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

// Eliminar producto
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
// FUNCIONES PARA ÓRDENES/PEDIDOS
// ============================================

// Crear orden
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
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Guardar en la colección general de pedidos
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);

    const orderToSave = {
      ...orderData,
      id: newOrderRef.key,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(newOrderRef, orderToSave);

    // También guardar en los pedidos del restaurante
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

// Obtener todas las órdenes
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

// Obtener órdenes de un usuario
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

// Actualizar estado de orden
export const updateOrderStatus = async (orderId: string, restaurantId: string, status: Order['status']) => {
  try {
    await update(ref(database), {
      [`restaurants/${restaurantId}/orders/${orderId}/status`]: status,
      [`restaurants/${restaurantId}/orders/${orderId}/updatedAt`]: Date.now()
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

// Crear reservación
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>, restaurantId: string) => {
  try {
    // Guardar SOLO en la colección PRINCIPAL de reservas
    const reservationsMainRef = ref(database, 'reservations');
    const newReservationMainRef = push(reservationsMainRef);
    const reservationId = newReservationMainRef.key;
    
    const reservation: Reservation = {
      ...reservationData,
      id: reservationId!,
      restaurantId: restaurantId, // Ya viene del parámetro
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Guardar en /reservations (colección principal)
    await set(newReservationMainRef, reservation);
    
    // TAMBIÉN guardar en /restaurants/{restaurantId}/reservations
    const restaurantReservationRef = ref(database, `restaurants/${restaurantId}/reservations/${reservationId}`);
    await set(restaurantReservationRef, reservation);
    
    return { success: true, reservationId, reservation };
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todas las reservaciones
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

// Obtener reservaciones de un usuario
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

// Actualizar estado de reservación
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
// FUNCIONES PARA CARRITO DE COMPRAS
// ============================================

// Agregar producto al carrito
export const addToCart = async (userId: string, productId: string, restaurantId: string, quantity: number = 1) => {
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
      await set(ref(database, `cart/${userId}/${productId}`), {
        productId,
        restaurantId,
        quantity,
        addedAt: Date.now()
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
};

// Obtener carrito del usuario
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

// Actualizar cantidad en carrito
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

// Eliminar producto del carrito
export const removeFromCart = async (userId: string, productId: string) => {
  try {
    await remove(ref(database, `cart/${userId}/${productId}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
};

// Limpiar carrito completo
export const clearCart = async (userId: string) => {
  try {
    await remove(ref(database, `cart/${userId}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
};

// Obtener items del carrito con información de productos
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