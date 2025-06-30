/*
  # Subscription and Usage Management Schema

  1. New Tables
    - `subscription_plans`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `price_monthly` (numeric)
      - `price_yearly` (numeric)
      - `analyses_per_month` (integer)
      - `features` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `plan_id` (text, references subscription_plans)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `stripe_subscription_id` (text)
      - `stripe_customer_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to read their own subscription data
    - Add policies for public access to plan information

  3. Default Data
    - Insert default subscription plans (Free, Pro, Enterprise)