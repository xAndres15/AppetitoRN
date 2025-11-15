// models/User.ts
export interface User { 
  uid: string; 
  email: string; 
  displayName?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  photoURL?: string;
}