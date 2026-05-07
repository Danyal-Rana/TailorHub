import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type Measurement = {
  id: string;
  customer_id: string;
  user_id: string;
  measurement_type: string;
  neck: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  shoulder: number | null;
  sleeve_length: number | null;
  shirt_length: number | null;
  inseam: number | null;
  outseam: number | null;
  thigh: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  customer_id: string;
  measurement_id: string | null;
  order_number: string;
  garment_type: string;
  fabric_details: string | null;
  design_notes: string | null;
  total_amount: number;
  status: 'Pending' | 'In Progress' | 'Delivered';
  order_date: string;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
};
