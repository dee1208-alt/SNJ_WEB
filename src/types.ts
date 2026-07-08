/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inventoryStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  description: string;
  specifications: Record<string, string>;
  ingredients?: string[];
  directions?: string;
  deliveryDaysEstimate: number;
}

export interface Review {
  id: string;
  productId?: string;
  clinicId?: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  area: string; // e.g., Gokulam, Kuvempunagar
  phone: string;
  rating: number;
  reviewsCount: number;
  image: string;
  coordinates?: { lat: number; lng: number };
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  qualification: string;
  experience: number; // in years
  specialization: string;
  languages: string[];
  fees: number;
  image: string;
  availableDays: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  timeSlots: string[]; // e.g., ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM", "06:00 PM"]
  rating: number;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  petName: string;
  petType: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Other';
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  fees: number;
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  grandTotal: number;
  couponCode?: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    pinCode: string; // Must be Mysore pins
    landmark?: string;
  };
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Order Placed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  timeline: { status: string; date: string; description: string }[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Partner = PartnerRegistration;

export interface PartnerRegistration {
  id: string;
  type: 'veterinarian' | 'clinic' | 'medicine_supplier' | 'pet_store' | 'brand_partnership';
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  experienceOrEstablishmentYear: string;
  licenseNumber: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  addresses: {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    pinCode: string;
    landmark?: string;
    isDefault: boolean;
  }[];
  wishlist: string[]; // Product IDs
}
