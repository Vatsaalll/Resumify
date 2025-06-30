/*
  # Usage Tracking and Analytics Schema

  1. New Tables
    - `usage_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `action_type` (text)
      - `resource_id` (uuid)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
    
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `key_name` (text)
      - `key_hash` (text)
      - `permissions` (text array)
      - `last_used_at` (timestamp)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
    - Add usage tracking functions

  3. Functions
    - Usage tracking functions
    - Rate limiting functions
    - Analytics functions