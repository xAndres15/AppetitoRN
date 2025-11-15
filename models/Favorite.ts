// models/Favorite.ts
export interface Favorite {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantCategory: string;
  restaurantRating?: number;
  restaurantReviews?: number;
  restaurantDistance?: string;
  restaurantDeliveryTime?: string;
  createdAt: number;
}