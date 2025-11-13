// models/Reservation.ts
export interface Restaurant {
  id: string;
  firebaseId?: string;
  name: string;
  description: string;
  location: string;
  image: string;
  phone?: string;
  schedule?: {
    day: string;
    hours: string;
  }[];
  cuisine?: string;
  address?: string;
}

export interface ReservationFormData {
  date: string;
  time: string;
  numberOfPeople: number;
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id?: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  numberOfPeople: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: number;
}