/*
  # Usage Tracking and Analytics Schema

  1. New Tables
    - `usage_logs` - Track user actions and API usage
    - `api_keys` - Store API keys for users
  
  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
  
  3. Functions
    - Usage tracking and analytics functions
*/

CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('resume_analysis', 'job_search', 'download', 'api_call')),
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key_name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  permissions text[] DEFAULT '{"read"}',
  last_used_at timestamptz,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policies for usage_logs
CREATE POLICY "Users can read own usage logs"
  ON usage_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for api_keys
CREATE POLICY "Users can read own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action_type ON usage_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Function to log usage
CREATE OR REPLACE FUNCTION public.log_usage(
  p_user_id uuid,
  p_action_type text,
  p_resource_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO usage_logs (user_id, action_type, resource_id, metadata)
  VALUES (p_user_id, p_action_type, p_resource_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limits (simplified without subscription tables)
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id uuid,
  p_action_type text
)
RETURNS boolean AS $$
DECLARE
  current_usage integer;
  current_month_start date;
  plan_limit integer;
BEGIN
  -- Set default limits (can be customized later)
  IF p_action_type = 'resume_analysis' THEN
    plan_limit := 10; -- Free plan limit
  ELSIF p_action_type = 'job_search' THEN
    plan_limit := 5; -- Free plan limit
  ELSE
    RETURN true; -- No limit for other actions
  END IF;
  
  -- Calculate current month usage
  current_month_start := DATE_TRUNC('month', CURRENT_DATE);
  
  SELECT COUNT(*) INTO current_usage
  FROM usage_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at >= current_month_start;
  
  RETURN current_usage < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  current_month_start date;
  last_month_start date;
  last_month_end date;
BEGIN
  current_month_start := DATE_TRUNC('month', CURRENT_DATE);
  last_month_start := DATE_TRUNC('month', CURRENT_DATE - interval '1 month');
  last_month_end := current_month_start - interval '1 day';
  
  WITH monthly_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis' AND created_at >= current_month_start) as analyses_this_month,
      COUNT(*) FILTER (WHERE action_type = 'job_search' AND created_at >= current_month_start) as searches_this_month,
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis' AND created_at >= last_month_start AND created_at <= last_month_end) as analyses_last_month,
      COUNT(*) FILTER (WHERE action_type = 'job_search' AND created_at >= last_month_start AND created_at <= last_month_end) as searches_last_month,
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis') as total_analyses,
      COUNT(*) FILTER (WHERE action_type = 'job_search') as total_searches
    FROM usage_logs
    WHERE user_id = p_user_id
  )
  SELECT jsonb_build_object(
    'current_month', jsonb_build_object(
      'analyses', analyses_this_month,
      'job_searches', searches_this_month
    ),
    'last_month', jsonb_build_object(
      'analyses', analyses_last_month,
      'job_searches', searches_last_month
    ),
    'total', jsonb_build_object(
      'analyses', total_analyses,
      'job_searches', total_searches
    )
  ) INTO result
  FROM monthly_stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;