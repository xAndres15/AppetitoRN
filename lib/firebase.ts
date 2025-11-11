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
        restaurants.push(childSnapshot.val());
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
          products.push(childSnapshot.val());
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
    const result = await getProducts(restaurantId);
    if (result.success && result.products) {
      const availableProducts = result.products.filter(p => p.available);
      return { success: true, products: availableProducts };
    }
    return result;
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
      return { success: true, product: snapshot.val() };
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
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, restaurantId: string) => {
  try {
    const ordersRef = ref(database, `restaurants/${restaurantId}/orders`);
    const newOrderRef = push(ordersRef);
    const orderId = newOrderRef.key;
    
    const order: Order = {
      ...orderData,
      id: orderId!,
      restaurantId: restaurantId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newOrderRef, order);
    return { success: true, orderId, order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

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
export const getUserOrders = async (userId: string) => {
  try {
    const result = await getAllOrders();
    if (result.success && result.orders) {
      const userOrders = result.orders.filter(order => order.userId === userId);
      return { success: true, orders: userOrders };
    }
    return result;
  } catch (error: any) {
    console.error('Error getting user orders:', error);
    return { success: false, error: error.message };
  }
};

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
    const reservationsRef = ref(database, `restaurants/${restaurantId}/reservations`);
    const newReservationRef = push(reservationsRef);
    const reservationId = newReservationRef.key;
    
    const reservation: Reservation = {
      ...reservationData,
      id: reservationId!,
      restaurantId: restaurantId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newReservationRef, reservation);
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
export const getUserReservations = async (userId: string) => {
  try {
    const result = await getAllReservations();
    if (result.success && result.reservations) {
      const userReservations = result.reservations.filter(res => res.userId === userId);
      return { success: true, reservations: userReservations };
    }
    return result;
  } catch (error: any) {
    console.error('Error getting user reservations:', error);
    return { success: false, error: error.message };
  }
};

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