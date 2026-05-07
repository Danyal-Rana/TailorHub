/*
  # Tailors Hub - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the Tailors Hub application,
  a tailor measurement and order management system.

  ## New Tables

  ### 1. customers
  - `id` (uuid, primary key) - Unique customer identifier
  - `user_id` (uuid, foreign key) - Reference to the tailor who owns this customer
  - `name` (text) - Customer full name
  - `email` (text) - Customer email address
  - `phone` (text) - Customer phone number
  - `address` (text) - Customer address
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. measurements
  - `id` (uuid, primary key) - Unique measurement record identifier
  - `customer_id` (uuid, foreign key) - Reference to customer
  - `user_id` (uuid, foreign key) - Reference to the tailor
  - `measurement_type` (text) - Type of garment (shirt, pants, suit, etc.)
  - `neck` (numeric) - Neck measurement
  - `chest` (numeric) - Chest measurement
  - `waist` (numeric) - Waist measurement
  - `hips` (numeric) - Hips measurement
  - `shoulder` (numeric) - Shoulder measurement
  - `sleeve_length` (numeric) - Sleeve length
  - `shirt_length` (numeric) - Shirt length
  - `inseam` (numeric) - Inseam measurement
  - `outseam` (numeric) - Outseam measurement
  - `thigh` (numeric) - Thigh measurement
  - `notes` (text) - Additional measurement notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 3. orders
  - `id` (uuid, primary key) - Unique order identifier
  - `user_id` (uuid, foreign key) - Reference to the tailor
  - `customer_id` (uuid, foreign key) - Reference to customer
  - `measurement_id` (uuid, foreign key) - Reference to measurements used
  - `order_number` (text, unique) - Human-readable order number
  - `garment_type` (text) - Type of garment being tailored
  - `fabric_details` (text) - Fabric type and details
  - `design_notes` (text) - Design specifications and notes
  - `total_amount` (numeric) - Total order amount
  - `status` (text) - Order status (Pending, In Progress, Delivered)
  - `order_date` (timestamptz) - Order creation date
  - `delivery_date` (timestamptz) - Expected/actual delivery date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 4. payments
  - `id` (uuid, primary key) - Unique payment identifier
  - `order_id` (uuid, foreign key) - Reference to order
  - `user_id` (uuid, foreign key) - Reference to the tailor
  - `amount` (numeric) - Payment amount
  - `payment_date` (timestamptz) - Date of payment
  - `payment_method` (text) - Payment method (Cash, Card, Online, etc.)
  - `notes` (text) - Payment notes
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Policies ensure data isolation between different tailors
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  measurement_type text NOT NULL,
  neck numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  shoulder numeric,
  sleeve_length numeric,
  shirt_length numeric,
  inseam numeric,
  outseam numeric,
  thigh numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  measurement_id uuid REFERENCES measurements(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL,
  garment_type text NOT NULL,
  fabric_details text,
  design_notes text,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  order_date timestamptz DEFAULT now(),
  delivery_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_date timestamptz DEFAULT now(),
  payment_method text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Measurements policies
CREATE POLICY "Users can view own measurements"
  ON measurements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements"
  ON measurements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements"
  ON measurements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements"
  ON measurements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
  ON orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments"
  ON payments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_customer_id ON measurements(customer_id);
CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);