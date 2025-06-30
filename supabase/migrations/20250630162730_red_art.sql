/*
  # User Authentication and Profile Management Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `subscription_tier` (text, default 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resume_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `file_name` (text)
      - `file_size` (integer)
      - `analysis_type` (text)
      - `overall_score` (integer)
      - `keyword_score` (integer)
      - `structure_score` (integer)
      - `formatting_score` (integer)
      - `readability_score` (integer)
      - `extracted_text` (text)
      - `found_keywords` (text array)
      - `missing_keywords` (text array)
      - `improvements` (jsonb)
      - `job_matches` (jsonb)
      - `created_at` (timestamp)
    
    - `job_searches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `resume_analysis_id` (uuid, references resume_analyses)
      - `suggested_roles` (text array)
      - `search_keywords` (text array)
      - `status` (text, default 'pending')
      - `workflow_id` (text)
      - `download_url` (text)
      - `sheet_name` (text)
      - `jobs_found` (integer, default 0)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public data where appropriate

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns