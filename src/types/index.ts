export type UserRole = "customer" | "business" | "admin";

export type RequestStatus = "Испратено" | "Во обработка" | "Одговорено";

export type RequestType = "product" | "contact";

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  verified: boolean;
  approved: boolean;
  active: boolean;
  featured: boolean;
  views: number;
  phone: string;
  email: string;
  hours: string;
  logoUrl: string;
  coverUrl: string;
  keywords: string[];
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  city: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  businessId?: string;
}

export interface CustomerRequest {
  id: string;
  type: RequestType;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  businessId: string;
  productId?: string;
  quantity?: number;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface FavoriteState {
  businessIds: string[];
  productIds: string[];
}

export interface ProductFormValues {
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  featured: boolean;
}

export interface BusinessProfileValues {
  name: string;
  category: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logoUrl: string;
  coverUrl: string;
}

export interface RequestFormValues {
  customerName: string;
  email: string;
  phone: string;
  quantity?: number;
  message: string;
}
