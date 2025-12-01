// This is a frontend utility file for email service configuration
// The actual email sending logic is implemented in the backend

export interface BookingData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  bookingDate: string;
  bookingTime: string;
  serviceCategory: string;
  serviceId: string;
  serviceDuration: string;
  servicePrice: number;
  notes?: string;
  bookingReference: string;
}

export interface ServiceDetails {
  title: string;
  category: string;
  duration: string;
  price: number;
  benefits?: string[];
  longDesc?: string;
}

// Frontend email service configuration
export const BREVO_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_BREVO_API_KEY || '',
  senderEmail: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || '',
  senderName: process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || '',
};

// Note: Email sending is handled by the backend API
// This file contains type definitions and configuration for frontend use